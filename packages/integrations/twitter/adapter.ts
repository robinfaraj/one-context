import { logger } from "@onecontext/logs";
import * as mem0 from "@onecontext/memory";
import { Client } from "@xdevplatform/xdk";
import type {
	ContentItemInput,
	IntegrationAdapter,
	SyncResult,
} from "../types";
import { getUserTweets } from "./twitterapi-client";
import type { Tweet } from "./types";

const MEM0_SYSTEM_INSTRUCTION = `You are extracting factual information about a person from their tweets.

ONLY extract concrete, verifiable facts such as:
- Professional role, company, job title
- Technical skills, programming languages, tools they use
- Projects they are building or contributing to
- Industries or domains they work in
- Geographic location, city, country
- Educational background
- Real opinions on technologies, products, or industry topics
- Hobbies, interests, and activities they genuinely engage in

DO NOT extract memories from:
- Jokes, sarcasm, irony, or shitposts
- Memes, copypastas, or internet humor
- Hypothetical scenarios or thought experiments
- Retweet-style commentary or dunking on others
- Vague or generic statements that could apply to anyone
- Song lyrics, quotes, or references to media

If a tweet is clearly humorous or non-literal, skip it entirely. Only extract what you are confident is a genuine fact about this person.`;

const TOP_TWEETS_FOR_MEM0 = 60;
const MEM0_BATCH_SIZE = 10;

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
			// Get authenticated user profile via official X SDK (user is OAuth'd)
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

			if (!profile?.username) {
				logger.error("Twitter /users/me returned no username");
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

			// Fetch tweets via twitterapi.io (paginated, ~200 tweets)
			const allTweets = await getUserTweets(profile.username, 200);
			logger.info(
				`Fetched ${allTweets.length} tweets for @${profile.username}`,
			);

			// Filter out replies, retweets, and quote tweets
			const originalTweets = allTweets.filter(
				(t) =>
					!t.isReply && !t.isRetweet && !t.retweeted_tweet && !t.quoted_tweet,
			);
			logger.info(`${originalTweets.length} original tweets after filtering`);

			// Store ALL filtered tweets as content items
			for (const tweet of originalTweets) {
				contentItems.push({
					externalId: tweet.id,
					type: "tweet",
					rawData: tweet,
					contentDate: new Date(tweet.createdAt),
					textContent: tweet.text,
				});
			}

			// Rank by engagement score
			const ranked = [...originalTweets].sort(
				(a, b) => engagementScore(b) - engagementScore(a),
			);
			const topTweets = ranked.slice(0, TOP_TWEETS_FOR_MEM0);

			// Send profile to Mem0
			try {
				const profileResult = await mem0.add(
					`${MEM0_SYSTEM_INSTRUCTION}\n\n${profileText}`,
					userId,
					{
						metadata: { source: "twitter", type: "profile" },
						categories: ["social", "twitter"],
					},
				);
				memoriesAdded += Array.isArray(profileResult)
					? profileResult.length
					: 1;
			} catch (err) {
				logger.error("Mem0 add failed for Twitter profile:", err);
			}

			// Send top tweets to Mem0 in batches
			for (let i = 0; i < topTweets.length; i += MEM0_BATCH_SIZE) {
				const batch = topTweets.slice(i, i + MEM0_BATCH_SIZE);
				const batchText = batch.map((t) => t.text).join("\n\n");
				try {
					const result = await mem0.add(
						`${MEM0_SYSTEM_INSTRUCTION}\n\n${batchText}`,
						userId,
						{
							metadata: { source: "twitter", type: "tweets" },
							categories: ["social", "twitter"],
						},
					);
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

function engagementScore(tweet: Tweet): number {
	return (
		tweet.likeCount +
		tweet.retweetCount * 2 +
		tweet.replyCount +
		tweet.quoteCount
	);
}
