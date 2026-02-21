import { logger } from "@onecontext/logs";
import type { Tweet, TweetResponse } from "./types";

const TWITTERAPI_BASE_URL = "https://api.twitterapi.io/twitter";
const MAX_REQUESTS = 15;
const RATE_LIMIT_BACKOFF_MS = 2000;

/**
 * Fetch a user's tweets via twitterapi.io with cursor-based pagination.
 * Returns a flat array of tweets, up to `maxTweets`.
 */
export async function getUserTweets(
	userName: string,
	maxTweets = 200,
): Promise<Tweet[]> {
	const apiKey = process.env.TWITTERAPI_API_KEY;
	if (!apiKey) {
		throw new Error("TWITTERAPI_API_KEY environment variable is required");
	}

	const allTweets: Tweet[] = [];
	let cursor: string | undefined;
	let requestCount = 0;

	while (allTweets.length < maxTweets && requestCount < MAX_REQUESTS) {
		const url = new URL(`${TWITTERAPI_BASE_URL}/user/last_tweets`);
		url.searchParams.set("userName", userName);
		if (cursor) {
			url.searchParams.set("cursor", cursor);
		}

		requestCount++;

		const response = await fetchWithRateLimitRetry(url.toString(), apiKey);
		const data = (await response.json()) as TweetResponse;

		if (!data.tweets || data.tweets.length === 0) break;

		allTweets.push(...data.tweets);

		if (!data.has_next_page || !data.next_cursor) break;

		cursor = data.next_cursor;
	}

	return allTweets.slice(0, maxTweets);
}

async function fetchWithRateLimitRetry(
	url: string,
	apiKey: string,
	maxRetries = 3,
): Promise<Response> {
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		const response = await fetch(url, {
			headers: { "X-API-Key": apiKey },
		});

		if (response.status === 429 && attempt < maxRetries) {
			logger.warn(
				`twitterapi.io rate limited (429), retrying in ${RATE_LIMIT_BACKOFF_MS}ms (attempt ${attempt + 1}/${maxRetries})`,
			);
			await sleep(RATE_LIMIT_BACKOFF_MS * (attempt + 1));
			continue;
		}

		if (!response.ok) {
			throw new Error(
				`twitterapi.io request failed: ${response.status} ${response.statusText}`,
			);
		}

		return response;
	}

	throw new Error("twitterapi.io rate limit retries exhausted");
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
