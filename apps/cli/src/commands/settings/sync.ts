import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import { createSpinner, printError } from "../../lib/output.js";

export function registerSyncCommand(parent: Command): void {
	parent
		.command("sync")
		.description("Enable or disable automatic syncing")
		.option("--enable", "Enable automatic sync")
		.option("--disable", "Disable automatic sync")
		.action(async (options: { enable?: boolean; disable?: boolean }) => {
			if (options.enable && options.disable) {
				printError("Cannot use --enable and --disable together.");
				process.exit(1);
			}
			if (!options.enable && !options.disable) {
				printError("One of --enable or --disable is required.");
				process.exit(1);
			}

			const syncEnabled = !!options.enable;
			const spinner = createSpinner(
				syncEnabled ? "Enabling sync…" : "Disabling sync…",
			).start();

			try {
				await apiRequest("/api/settings/sync", {
					method: "PUT",
					body: JSON.stringify({ syncEnabled }),
				});

				spinner.succeed(
					syncEnabled ? "Automatic sync enabled." : "Automatic sync disabled.",
				);
			} catch (error) {
				spinner.fail("Failed to update sync settings.");
				if (error instanceof ApiError) {
					printError(error.message);
				} else {
					throw error;
				}
			}
		});
}
