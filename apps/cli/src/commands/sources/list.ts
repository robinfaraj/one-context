import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import {
	createSpinner,
	printError,
	printJson,
	printTable,
} from "../../lib/output.js";

interface Integration {
	provider: string;
	name: string;
	connected: boolean;
	source: { status: string; lastSyncedAt: string | null } | null;
}

interface SourcesResponse {
	integrations: Integration[];
	connectedSources: unknown[];
	pendingConnections: string[];
}

export function registerListCommand(parent: Command): void {
	parent
		.command("list")
		.description("List connected sources")
		.option("--json", "Output as JSON")
		.action(async (opts) => {
			const spinner = createSpinner("Fetching sources…");
			try {
				spinner.start();
				const data = await apiRequest<SourcesResponse>("/api/sources");
				spinner.stop();

				if (opts.json) {
					printJson(data);
					return;
				}

				if (data.integrations.length === 0) {
					console.log("No integrations available.");
					return;
				}

				printTable(
					["Provider", "Connected", "Status", "Last Synced"],
					data.integrations.map((i) => [
						i.name ?? i.provider,
						i.connected ? "yes" : "no",
						i.source?.status ?? "–",
						i.source?.lastSyncedAt
							? new Date(i.source.lastSyncedAt).toLocaleString()
							: "never",
					]),
				);
			} catch (error) {
				spinner.stop();
				if (error instanceof ApiError) {
					printError(`Failed to list sources: ${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
