import type { Command } from "commander";
import { registerConnectCommand } from "./connect.js";
import { registerDisconnectCommand } from "./disconnect.js";
import { registerListCommand } from "./list.js";
import { registerSyncCommand } from "./sync.js";

export function registerSourcesCommand(program: Command): void {
	const sources = program
		.command("sources")
		.description("Manage connected sources");

	registerListCommand(sources);
	registerConnectCommand(sources);
	registerSyncCommand(sources);
	registerDisconnectCommand(sources);
}
