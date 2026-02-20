import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import { createSpinner, printError, printSuccess } from "../../lib/output.js";

export function registerAddCommand(parent: Command): void {
	parent
		.command("add")
		.description("Add a new memory")
		.argument("<content>", "Memory content")
		.option("--categories <categories>", "Comma-separated categories")
		.action(async (content: string, opts) => {
			const spinner = createSpinner("Adding memory…");
			try {
				spinner.start();
				const body: { content: string; categories?: string[] } = { content };
				if (opts.categories) {
					body.categories = opts.categories
						.split(",")
						.map((c: string) => c.trim());
				}
				await apiRequest("/api/memories", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});
				spinner.stop();
				printSuccess("Memory added.");
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Failed to add memory: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
