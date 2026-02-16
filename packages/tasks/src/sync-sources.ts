import { db } from "@onecontext/database/server";
import {
	get,
	getAccessToken,
	persistSyncResult,
} from "@onecontext/integrations";
import { logger, schedules } from "@trigger.dev/sdk/v3";

export const syncSourcesTask = schedules.task({
	id: "sync-sources",
	// Run daily at 3 AM UTC
	cron: "0 3 * * *",
	run: async () => {
		const users = await db.user.findMany({
			where: { syncEnabled: true },
			select: { id: true },
		});

		logger.info(`Found ${users.length} users with sync enabled`);

		for (const user of users) {
			const sources = await db.source.findMany({
				where: { userId: user.id, status: "connected" },
			});

			for (const source of sources) {
				try {
					const adapter = get(source.provider);
					if (!adapter) {
						logger.warn(`No adapter for provider: ${source.provider}`);
						continue;
					}

					const accessToken = await getAccessToken(user.id, source.provider);
					if (!accessToken) {
						logger.warn(
							`No access token for ${source.provider} (user: ${user.id})`,
						);
						continue;
					}

					await db.source.update({
						where: { id: source.id },
						data: { status: "syncing" },
					});

					const result = await adapter.sync(user.id, accessToken);
					await persistSyncResult(source.id, user.id, result);

					await db.source.update({
						where: { id: source.id },
						data: { status: "connected" },
					});

					logger.info(
						`Synced ${source.provider} for user ${user.id}: ${result.contentItems.length} items, ${result.memoriesAdded} memories`,
					);
				} catch (error) {
					logger.error(
						`Failed to sync ${source.provider} for user ${user.id}`,
						{ error },
					);

					await db.source.update({
						where: { id: source.id },
						data: { status: "error" },
					});
				}
			}
		}
	},
});
