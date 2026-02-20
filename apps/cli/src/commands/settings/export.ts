import { writeFile } from "node:fs/promises";
import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import {
	createSpinner,
	printError,
	printJson,
	printSuccess,
} from "../../lib/output.js";

export function registerExportCommand(parent: Command): void {
	parent
		.command("export")
		.description("Export your account data")
		.option("--output <file>", "Write export to a file instead of stdout")
		.action(async (options: { output?: string }) => {
			const spinner = createSpinner("Exporting data…").start();

			try {
				const data = await apiRequest<unknown>("/api/settings/export");
				spinner.stop();

				if (options.output) {
					await writeFile(
						options.output,
						JSON.stringify(data, null, 2),
						"utf-8",
					);
					printSuccess(`Data exported to ${options.output}`);
				} else {
					printJson(data);
				}
			} catch (error) {
				spinner.fail("Failed to export data.");
				if (error instanceof ApiError) {
					printError(error.message);
				} else {
					throw error;
				}
			}
		});
}
