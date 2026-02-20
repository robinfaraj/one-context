import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import { createSpinner, printError, printSuccess } from "../../lib/output.js";

export function registerPinCommand(parent: Command): void {
	parent
		.command("pin")
		.description("Pin a memory")
		.argument("<id>", "Memory ID")
		.action(async (id: string) => {
			const spinner = createSpinner("Pinning memory…");
			try {
				spinner.start();
				await apiRequest(`/api/memories/${id}/pin`, { method: "POST" });
				spinner.stop();
				printSuccess("Memory pinned.");
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Failed to pin memory: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
