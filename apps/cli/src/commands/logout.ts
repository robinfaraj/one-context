import type { Command } from "commander";
import { clearConfig, getConfigPath } from "../lib/config.js";
import { printSuccess } from "../lib/output.js";

export function registerLogoutCommand(program: Command): void {
	program
		.command("logout")
		.description("Clear stored credentials")
		.action(() => {
			clearConfig();
			printSuccess(`Logged out. Config cleared at ${getConfigPath()}`);
		});
}
