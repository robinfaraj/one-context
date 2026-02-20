import type { Command } from "commander";
import { registerDeleteAccountCommand } from "./delete-account.js";
import { registerExportCommand } from "./export.js";
import { registerSyncCommand } from "./sync.js";
import { registerUpdateCommand } from "./update.js";

export function registerSettingsCommand(program: Command): void {
	const settings = program
		.command("settings")
		.description("Manage account settings");

	registerUpdateCommand(settings);
	registerSyncCommand(settings);
	registerExportCommand(settings);
	registerDeleteAccountCommand(settings);
}
