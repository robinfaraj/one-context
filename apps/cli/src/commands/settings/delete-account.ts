import { createInterface } from "node:readline/promises";
import chalk from "chalk";
import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import { createSpinner, printError, printSuccess } from "../../lib/output.js";

export function registerDeleteAccountCommand(parent: Command): void {
	parent
		.command("delete-account")
		.description("Permanently delete your account")
		.action(async () => {
			console.log(
				chalk.red(
					"\nWARNING: This will permanently delete your account and all associated data.\n",
				),
			);

			const rl = createInterface({
				input: process.stdin,
				output: process.stdout,
			});

			const answer = await rl.question(chalk.red("Type DELETE to confirm: "));
			rl.close();

			if (answer !== "DELETE") {
				printError("Account deletion cancelled.");
				return;
			}

			const spinner = createSpinner("Deleting account…").start();

			try {
				await apiRequest("/api/settings/account", { method: "DELETE" });
				spinner.succeed("Account deleted.");
				printSuccess("Your account has been permanently deleted.");
			} catch (error) {
				spinner.fail("Failed to delete account.");
				if (error instanceof ApiError) {
					printError(error.message);
				} else {
					throw error;
				}
			}
		});
}
