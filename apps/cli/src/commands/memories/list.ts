import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import {
	createSpinner,
	printError,
	printJson,
	printTable,
} from "../../lib/output.js";

interface Memory {
	id: string;
	memory: string;
	categories: string[];
	metadata: { pinned?: boolean } | null;
}

export function registerListCommand(parent: Command): void {
	parent
		.command("list")
		.description("List all memories")
		.option("--json", "Output as JSON")
		.action(async (opts) => {
			const spinner = createSpinner("Fetching memories…");
			try {
				spinner.start();
				const memories = await apiRequest<Memory[]>("/api/memories");
				spinner.stop();

				if (opts.json) {
					printJson(memories);
					return;
				}

				if (memories.length === 0) {
					console.log("No memories found.");
					return;
				}

				printTable(
					["ID", "Memory", "Categories", "Pinned"],
					memories.map((m) => [
						m.id.slice(0, 8),
						m.memory.length > 60 ? `${m.memory.slice(0, 57)}...` : m.memory,
						(m.categories ?? []).join(", "),
						m.metadata?.pinned ? "yes" : "no",
					]),
				);
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Failed to list memories: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
