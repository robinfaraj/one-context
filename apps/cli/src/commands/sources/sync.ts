import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import { createSpinner, printError, printSuccess } from "../../lib/output.js";

interface SyncResult {
	itemsSynced: number;
}

export function registerSyncCommand(parent: Command): void {
	parent
		.command("sync")
		.description("Sync a source provider")
		.argument("<provider>", "Provider name")
		.action(async (provider: string) => {
			const spinner = createSpinner(`Syncing ${provider}…`);
			try {
				spinner.start();
				const result = await apiRequest<SyncResult>(
					`/api/sources/${provider}/sync`,
					{ method: "POST" },
				);
				spinner.stop();
				printSuccess(`${provider} synced — ${result.itemsSynced} items.`);
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Failed to sync ${provider}: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
