import chalk from "chalk";
import type { Command } from "commander";
import { ApiError, apiRequest } from "../lib/api-client.js";
import { createSpinner, printError, printJson } from "../lib/output.js";

interface DashboardResponse {
	user: {
		name: string | null;
		email: string;
		image: string | null;
	};
	stats: { memoryCount: number; sourceCount: number; chatCount: number };
	connectedSources: Array<{
		provider: string;
		status: string;
		lastSyncedAt: string | null;
	}>;
}

export function registerDashboardCommand(program: Command): void {
	program
		.command("dashboard")
		.description("View your account dashboard")
		.option("--json", "Output as JSON")
		.action(async (options: { json?: boolean }) => {
			const spinner = createSpinner("Loading dashboard…").start();

			try {
				const data = await apiRequest<DashboardResponse>("/api/dashboard");
				spinner.stop();

				if (options.json) {
					printJson(data);
					return;
				}

				console.log(chalk.bold("\n Profile"));
				console.log(`  Name:     ${data.user.name ?? "—"}`);
				console.log(`  Email:    ${data.user.email}`);

				console.log(chalk.bold("\n Stats"));
				console.log(`  Memories: ${data.stats.memoryCount}`);
				console.log(`  Sources:  ${data.stats.sourceCount}`);

				console.log(chalk.bold("\n Connected Sources"));
				if (data.connectedSources.length === 0) {
					console.log("  No sources connected.");
				} else {
					for (const source of data.connectedSources) {
						const synced = source.lastSyncedAt
							? new Date(source.lastSyncedAt).toLocaleString()
							: "never";
						console.log(
							`  ${source.provider} — ${source.status} (last synced: ${synced})`,
						);
					}
				}
				console.log();
			} catch (error) {
				spinner.fail("Failed to load dashboard.");
				if (error instanceof ApiError) {
					printError(error.message);
				} else {
					throw error;
				}
			}
		});
}
