import { createInterface } from "node:readline/promises";
import chalk from "chalk";
import type { Command } from "commander";
import { getApiUrl, writeConfig } from "../lib/config.js";
import { createSpinner, printError } from "../lib/output.js";

export function registerLoginCommand(program: Command): void {
	program
		.command("login")
		.description("Authenticate with your OneContext API key")
		.option("--api-key <key>", "API key (or paste interactively)")
		.option("--api-url <url>", "API base URL")
		.action(async (opts) => {
			let apiKey: string = opts.apiKey;
			const apiUrl: string = opts.apiUrl ?? getApiUrl();

			if (!apiKey) {
				const rl = createInterface({
					input: process.stdin,
					output: process.stdout,
				});
				apiKey = await rl.question("Paste your API key: ");
				rl.close();
				if (!apiKey.trim()) {
					printError("API key is required.");
					process.exit(1);
				}
				apiKey = apiKey.trim();
			}

			const spinner = createSpinner("Validating API key...").start();

			try {
				const response = await fetch(`${apiUrl}/api/dashboard`, {
					headers: { "x-api-key": apiKey },
				});

				if (!response.ok) {
					spinner.fail("Invalid API key.");
					process.exit(1);
				}

				const data = (await response.json()) as {
					user?: { name?: string; email?: string };
				};

				writeConfig({ apiUrl, apiKey });
				spinner.succeed(
					`Logged in${data.user?.name ? ` as ${chalk.bold(data.user.name)}` : ""}${data.user?.email ? ` (${data.user.email})` : ""}`,
				);
			} catch (err) {
				spinner.fail(
					`Failed to connect to ${apiUrl}: ${err instanceof Error ? err.message : String(err)}`,
				);
				process.exit(1);
			}
		});
}
