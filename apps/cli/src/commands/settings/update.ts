import type { Command } from "commander";
import { ApiError, apiRequest } from "../../lib/api-client.js";
import { createSpinner, printError, printSuccess } from "../../lib/output.js";

export function registerUpdateCommand(parent: Command): void {
	parent
		.command("update")
		.description("Update your profile settings")
		.option("--name <name>", "Update display name")
		.option("--summary <summary>", "Update profile summary")
		.action(async (options: { name?: string; summary?: string }) => {
			if (!options.name && !options.summary) {
				printError("At least one of --name or --summary is required.");
				process.exit(1);
			}

			const spinner = createSpinner("Updating profile…");
			try {
				const body: Record<string, string> = {};
				if (options.name) body.name = options.name;
				if (options.summary) body.profileSummary = options.summary;

				const result = await apiRequest<Record<string, unknown>>(
					"/api/settings/profile",
					{
						method: "PUT",
						body: JSON.stringify(body),
					},
				);

				spinner.succeed("Profile updated.");
				if (result.name) printSuccess(`Name: ${result.name}`);
				if (result.summary) printSuccess(`Summary: ${result.summary}`);
			} catch (error) {
				spinner.fail("Failed to update profile.");
				if (error instanceof ApiError) {
					printError(`${error.message}`);
				} else {
					throw error;
				}
			}
		});
}
