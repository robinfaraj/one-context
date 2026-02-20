import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import {
	createSpinner,
	printError,
	printJson,
	printTable,
} from "../../lib/output.js";

interface SearchResult {
	id: string;
	memory: string;
	categories: string[];
	score: number;
}

export function registerSearchCommand(parent: Command): void {
	parent
		.command("search")
		.description("Search memories")
		.argument("<query>", "Search query")
		.option("--filters <json>", "JSON filters")
		.option("--json", "Output as JSON")
		.action(async (query: string, opts) => {
			const spinner = createSpinner("Searching memories…");
			try {
				spinner.start();
				const params = new URLSearchParams({ q: query });
				if (opts.filters) {
					params.set("filters", opts.filters);
				}
				const results = await apiRequest<SearchResult[]>(
					`/api/memories/search?${params.toString()}`,
				);
				spinner.stop();

				if (opts.json) {
					printJson(results);
					return;
				}

				if (results.length === 0) {
					console.log("No memories found.");
					return;
				}

				printTable(
					["ID", "Memory", "Categories", "Score"],
					results.map((m) => [
						m.id.slice(0, 8),
						m.memory.length > 60 ? `${m.memory.slice(0, 57)}...` : m.memory,
						(m.categories ?? []).join(", "),
						m.score.toFixed(2),
					]),
				);
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Search failed: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
