import { logger } from "@onecontext/logs";
import * as mem0 from "@onecontext/memory";
import type {
	ContentItemInput,
	IntegrationAdapter,
	SyncResult,
} from "../types";

const GITHUB_API_BASE = "https://api.github.com";

export const githubAdapter: IntegrationAdapter = {
	provider: "github",
	displayName: "GitHub",
	icon: "github",
	description: "Import your repos, bio, and activity",
	oauthProvider: "github",

	async sync(userId: string, accessToken: string): Promise<SyncResult> {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/vnd.github+json",
			"User-Agent": "OneContext",
		};

		const contentItems: ContentItemInput[] = [];
		let memoriesAdded = 0;

		try {
			// Fetch user profile
			const profileRes = await fetch(`${GITHUB_API_BASE}/user`, { headers });
			if (!profileRes.ok) {
				logger.error(
					`GitHub /user failed: ${profileRes.status} ${await profileRes.text()}`,
				);
				return { contentItems, memoriesAdded };
			}
			const profile = await profileRes.json();

			const profileText = `GitHub profile: ${profile.name ?? profile.login}. Bio: ${profile.bio ?? "N/A"}. Company: ${profile.company ?? "N/A"}. Location: ${profile.location ?? "N/A"}. Blog: ${profile.blog ?? "N/A"}`;
			contentItems.push({
				externalId: "profile",
				type: "profile",
				rawData: profile,
				contentDate: new Date(),
				textContent: profileText,
			});

			// Fetch top repos
			const reposRes = await fetch(
				`${GITHUB_API_BASE}/user/repos?sort=updated&per_page=10&type=owner`,
				{ headers },
			);
			if (!reposRes.ok) {
				logger.error(
					`GitHub /user/repos failed: ${reposRes.status} ${await reposRes.text()}`,
				);
				// Return partial results (profile only)
			} else {
				const repos = await reposRes.json();

				for (const repo of repos) {
					const repoText = `${repo.full_name}: ${repo.description ?? "No description"}. Language: ${repo.language ?? "N/A"}. Stars: ${repo.stargazers_count}`;
					contentItems.push({
						externalId: repo.full_name,
						type: "repo",
						rawData: repo,
						contentDate: new Date(repo.updated_at),
						textContent: repoText,
					});
				}
			}

			// Send to Mem0 for semantic indexing in small batches
			const BATCH_SIZE = 5;
			for (let i = 0; i < contentItems.length; i += BATCH_SIZE) {
				const batch = contentItems.slice(i, i + BATCH_SIZE);
				const batchText = batch.map((item) => item.textContent).join("\n\n");
				const batchType = batch[0].type === "profile" ? "profile" : "repos";
				try {
					const result = await mem0.add(batchText, userId, {
						metadata: { source: "github", type: batchType },
						categories: ["development", "github"],
					});
					memoriesAdded += Array.isArray(result) ? result.length : 1;
				} catch (err) {
					logger.error("Mem0 add failed for GitHub sync batch:", err);
				}
			}
		} catch (err) {
			logger.error("GitHub sync error:", err);
		}

		return { contentItems, memoriesAdded };
	},
};
