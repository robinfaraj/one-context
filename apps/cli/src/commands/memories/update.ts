import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import {
	createSpinner,
	printError,
	printSuccess,
	validateId,
} from "../../lib/output.js";

export function registerUpdateCommand(parent: Command): void {
	parent
		.command("update")
		.description("Update a memory")
		.argument("<id>", "Memory ID")
		.argument("<content>", "New content")
		.action(async (id: string, content: string) => {
			validateId(id);
			const spinner = createSpinner("Updating memory…").start();
			try {
				await apiRequest(`/api/memories/${id}`, {
					method: "PUT",
					body: JSON.stringify({ content }),
				});
				spinner.stop();
				printSuccess("Memory updated.");
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Failed to update memory: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
