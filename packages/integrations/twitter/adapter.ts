import { logger } from "@onecontext/logs";
import * as mem0 from "@onecontext/memory";
import { Client } from "@xdevplatform/xdk";
import type {
	ContentItemInput,
	IntegrationAdapter,
	SyncResult,
} from "../types";

export const twitterAdapter: IntegrationAdapter = {
	provider: "twitter",
	displayName: "Twitter / X",
	icon: "twitter",
	description: "Import your tweets and interactions",
	oauthProvider: "twitter",

	async sync(userId: string, accessToken: string): Promise<SyncResult> {
		const client = new Client({ accessToken });
		const contentItems: ContentItemInput[] = [];
		let memoriesAdded = 0;

		try {
			// Get authenticated user profile via XDK
			const meResponse = await client.users.getMe({
				userFields: [
					"description",
					"location",
					"name",
					"username",
					"url",
					"public_metrics",
				],
			});
			const profile = meResponse.data;
			const twitterUserId = profile?.id;

			if (!twitterUserId) {
				logger.error("Twitter /users/me returned no user ID");
				return { contentItems, memoriesAdded };
			}

			// Store profile as a content item
			const profileText = [
				`X profile: @${profile.username} (${profile.name})`,
				profile.description ? `Bio: ${profile.description}` : null,
				profile.location ? `Location: ${profile.location}` : null,
				profile.url ? `Website: ${profile.url}` : null,
			]
				.filter(Boolean)
				.join(". ");

			contentItems.push({
				externalId: "profile",
				type: "profile",
				rawData: profile,
				contentDate: new Date(),
				textContent: profileText,
			});

			// Fetch recent original posts only (no replies, no retweets)
			const tweetsResponse = await client.users.getPosts(twitterUserId, {
				maxResults: 50,
				exclude: ["retweets", "replies"],
				tweetFields: [
					"created_at",
					"public_metrics",
					"text",
					"referenced_tweets",
				],
			});

			const tweets = tweetsResponse.data ?? [];

			for (const tweet of tweets) {
				// Skip quote tweets (API exclude only supports retweets/replies)
				const refs = (tweet as any).referencedTweets ?? [];
				if (refs.some((r: any) => r.type === "quoted")) continue;

				contentItems.push({
					externalId: tweet.id ?? "",
					type: "tweet",
					rawData: tweet,
					contentDate: new Date(tweet.createdAt ?? Date.now()),
					textContent: tweet.text ?? "",
				});
			}

			// Send to Mem0 for semantic indexing
			// Send profile separately, then tweets in small batches so Mem0
			// extracts granular memories instead of collapsing everything into one.
			const BATCH_SIZE = 5;
			for (let i = 0; i < contentItems.length; i += BATCH_SIZE) {
				const batch = contentItems.slice(i, i + BATCH_SIZE);
				const batchText = batch.map((item) => item.textContent).join("\n\n");
				const batchType = batch[0].type === "profile" ? "profile" : "tweets";
				try {
					const result = await mem0.add(batchText, userId, {
						metadata: { source: "twitter", type: batchType },
						categories: ["social", "twitter"],
					});
					memoriesAdded += Array.isArray(result) ? result.length : 1;
				} catch (err) {
					logger.error("Mem0 add failed for Twitter sync batch:", err);
				}
			}
		} catch (err) {
			logger.error("Twitter sync error:", err);
			throw err;
		}

		return { contentItems, memoriesAdded };
	},
};
