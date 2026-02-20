import chalk from "chalk";
import type { Command } from "commander";
import { apiRequest } from "../lib/api-client.js";
import { createSpinner, printError, printJson } from "../lib/output.js";

interface DashboardResponse {
	user: {
		name: string | null;
		email: string;
		image: string | null;
	};
	stats: {
		memoryCount: number;
		sourceCount: number;
		chatCount: number;
	};
}

export function registerWhoamiCommand(program: Command): void {
	program
		.command("whoami")
		.description("Show current authenticated user")
		.option("--json", "Output raw JSON")
		.action(async (opts) => {
			const spinner = createSpinner("Fetching user info...").start();
			try {
				const data = await apiRequest<DashboardResponse>("/api/dashboard");
				spinner.stop();

				if (opts.json) {
					printJson(data.user);
					return;
				}

				const { user } = data;
				console.log(`${chalk.bold("Name:")}      ${user.name ?? "–"}`);
				console.log(`${chalk.bold("Email:")}     ${user.email}`);
				console.log(`${chalk.bold("Memories:")}  ${data.stats.memoryCount}`);
				console.log(`${chalk.bold("Sources:")}   ${data.stats.sourceCount}`);
			} catch (err) {
				spinner.fail("Failed to fetch user info");
				printError(err instanceof Error ? err.message : String(err));
				process.exit(1);
			}
		});
}
