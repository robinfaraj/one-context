import { db } from "@onecontext/database/server";
import { getValidXAccessToken } from "./twitter/x-auth";
import type { SyncResult } from "./types";

/**
 * Persist sync results: upsert content items and update source metadata.
 */
export async function persistSyncResult(
	sourceId: string,
	userId: string,
	result: SyncResult,
) {
	for (const item of result.contentItems) {
		await db.contentItem.upsert({
			where: {
				sourceId_externalId: {
					sourceId,
					externalId: item.externalId,
				},
			},
			create: {
				userId,
				sourceId,
				externalId: item.externalId,
				type: item.type,
				rawData: item.rawData,
				contentDate: item.contentDate,
			},
			update: {
				rawData: item.rawData,
				contentDate: item.contentDate,
			},
		});
	}

	await db.source.update({
		where: { id: sourceId },
		data: {
			lastSyncAt: new Date(),
			memoryCount: { increment: result.memoriesAdded },
		},
	});
}

/**
 * Get a valid access token for a user+provider, with automatic refresh for
 * providers that support it (Twitter/X).
 */
export async function getAccessToken(
	userId: string,
	provider: string,
): Promise<string | null> {
	// Twitter tokens expire after ~2h — use refresh-aware getter
	if (provider === "twitter") {
		try {
			return await getValidXAccessToken(userId);
		} catch {
			return null;
		}
	}

	// Other providers: direct lookup (GitHub tokens don't expire)
	const account = await db.account.findFirst({
		where: { userId, providerId: provider },
	});
	return account?.accessToken ?? null;
}
