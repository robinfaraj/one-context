import { createInterface } from "node:readline/promises";
import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import {
	createSpinner,
	printError,
	printSuccess,
	validateId,
} from "../../lib/output.js";

export function registerDeleteCommand(parent: Command): void {
	parent
		.command("delete")
		.description("Delete a memory")
		.argument("<id>", "Memory ID")
		.option("--force", "Skip confirmation")
		.action(async (id: string, opts) => {
			validateId(id);
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

			const spinner = createSpinner("Deleting memory…");
			try {
				spinner.start();
				await apiRequest(`/api/memories/${id}`, { method: "DELETE" });
				spinner.stop();
				printSuccess("Memory deleted.");
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Failed to delete memory: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
