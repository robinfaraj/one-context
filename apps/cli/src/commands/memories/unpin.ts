import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import { createSpinner, printError, printSuccess } from "../../lib/output.js";

export function registerUnpinCommand(parent: Command): void {
	parent
		.command("unpin")
		.description("Unpin a memory")
		.argument("<id>", "Memory ID")
		.action(async (id: string) => {
			const spinner = createSpinner("Unpinning memory…");
			try {
				spinner.start();
				await apiRequest(`/api/memories/${id}/pin`, { method: "DELETE" });
				spinner.stop();
				printSuccess("Memory unpinned.");
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Failed to unpin memory: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
