import type { Command } from "commander";
import { registerAddCommand } from "./add.js";
import { registerDeleteCommand } from "./delete.js";
import { registerListCommand } from "./list.js";
import { registerPinCommand } from "./pin.js";
import { registerSearchCommand } from "./search.js";
import { registerUnpinCommand } from "./unpin.js";
import { registerUpdateCommand } from "./update.js";

export function registerMemoriesCommand(program: Command): void {
	const memories = program
		.command("memories")
		.description("Manage your memories");

	registerListCommand(memories);
	registerSearchCommand(memories);
	registerAddCommand(memories);
	registerUpdateCommand(memories);
	registerDeleteCommand(memories);
	registerPinCommand(memories);
	registerUnpinCommand(memories);
}
