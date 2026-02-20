import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import { createSpinner, printError, printSuccess } from "../../lib/output.js";

export function registerConnectCommand(parent: Command): void {
	parent
		.command("connect")
		.description("Connect a source provider")
		.argument("<provider>", "Provider name (e.g. github, twitter, notion)")
		.action(async (provider: string) => {
			const spinner = createSpinner(`Connecting ${provider}…`);
			try {
				spinner.start();
				await apiRequest(`/api/sources/${provider}/connect`, {
					method: "POST",
				});
				spinner.stop();
				printSuccess(`${provider} connected.`);
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Failed to connect ${provider}: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
