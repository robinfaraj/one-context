#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { registerBillingCommand } from "./commands/billing.js";
import { registerDashboardCommand } from "./commands/dashboard.js";
import { registerLoginCommand } from "./commands/login.js";
import { registerLogoutCommand } from "./commands/logout.js";
import { registerMemoriesCommand } from "./commands/memories/index.js";
import { registerSettingsCommand } from "./commands/settings/index.js";
import { registerSourcesCommand } from "./commands/sources/index.js";
import { registerWhoamiCommand } from "./commands/whoami.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
	readFileSync(join(__dirname, "..", "package.json"), "utf-8"),
);

const program = new Command();

program
	.name("octx")
	.description("OneContext CLI — manage your AI identity from the terminal")
	.version(pkg.version);

registerLoginCommand(program);
registerLogoutCommand(program);
registerWhoamiCommand(program);
registerMemoriesCommand(program);
registerSourcesCommand(program);
registerSettingsCommand(program);
registerDashboardCommand(program);
registerBillingCommand(program);

program.parse();
