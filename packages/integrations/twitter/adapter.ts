import { logger } from "@onecontext/logs";
import * as mem0 from "@onecontext/memory";
import type {
	ContentItemInput,
	IntegrationAdapter,
	SyncResult,
} from "../types";

const TWITTER_API_BASE = "https://api.x.com/2";

export const twitterAdapter: IntegrationAdapter = {
	provider: "twitter",
	displayName: "Twitter / X",
	icon: "twitter",
	description: "Import your tweets and interactions",
	oauthProvider: "twitter",

	async sync(userId: string, accessToken: string): Promise<SyncResult> {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const contentItems: ContentItemInput[] = [];
		let memoriesAdded = 0;

		try {
			// Get authenticated user ID
			const meRes = await fetch(`${TWITTER_API_BASE}/users/me`, { headers });
			if (!meRes.ok) {
				logger.error(
					`Twitter /users/me failed: ${meRes.status} ${await meRes.text()}`,
				);
				return { contentItems, memoriesAdded };
			}
			const meData = await meRes.json();
			const twitterUserId = meData.data?.id;
			if (!twitterUserId) {
				logger.error("Twitter /users/me returned no user ID");
				return { contentItems, memoriesAdded };
			}

			// Fetch recent tweets
			const tweetsRes = await fetch(
				`${TWITTER_API_BASE}/users/${twitterUserId}/tweets?max_results=50&tweet.fields=created_at,public_metrics,text`,
				{ headers },
			);
			if (!tweetsRes.ok) {
				logger.error(
					`Twitter tweets fetch failed: ${tweetsRes.status} ${await tweetsRes.text()}`,
				);
				return { contentItems, memoriesAdded };
			}
			const tweetsData = await tweetsRes.json();
			const tweets = tweetsData.data ?? [];

			for (const tweet of tweets) {
				contentItems.push({
					externalId: tweet.id,
					type: "tweet",
					rawData: tweet,
					contentDate: new Date(tweet.created_at),
					textContent: tweet.text,
				});
			}

			// Send to Mem0 for semantic indexing (batched)
			if (contentItems.length > 0) {
				const batchedText = contentItems
					.map((item) => item.textContent)
					.join("\n\n");
				try {
					const result = await mem0.add(batchedText, userId, {
						metadata: { source: "twitter", type: "tweets" },
						categories: ["social", "twitter"],
					});
					memoriesAdded = Array.isArray(result) ? result.length : 1;
				} catch (err) {
					logger.error("Mem0 add failed for Twitter sync:", err);
				}
			}
		} catch (err) {
			logger.error("Twitter sync error:", err);
		}

		return { contentItems, memoriesAdded };
	},
};
