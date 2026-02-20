import { createInterface } from "node:readline/promises";
import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import { createSpinner, printError, printSuccess } from "../../lib/output.js";

export function registerDisconnectCommand(parent: Command): void {
	parent
		.command("disconnect")
		.description("Disconnect a source provider")
		.argument("<provider>", "Provider name")
		.option("--force", "Skip confirmation")
		.action(async (provider: string, opts) => {
			if (!opts.force) {
				const rl = createInterface({
					input: process.stdin,
					output: process.stdout,
				});
				const answer = await rl.question("Are you sure? (y/N) ");
				rl.close();
				if (answer.toLowerCase() !== "y") {
					console.log("Cancelled.");
					return;
				}
			}

			const spinner = createSpinner(`Disconnecting ${provider}…`);
			try {
				spinner.start();
				await apiRequest(`/api/sources/${provider}`, { method: "DELETE" });
				spinner.stop();
				printSuccess(`${provider} disconnected.`);
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Failed to disconnect ${provider}: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
