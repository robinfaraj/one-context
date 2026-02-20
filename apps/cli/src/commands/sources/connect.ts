import chalk from "chalk";
import type { Command } from "commander";
import { printWarning } from "../../lib/output.js";

const OAUTH_PROVIDERS = ["github", "twitter", "notion"];

export function registerConnectCommand(parent: Command): void {
	parent
		.command("connect")
		.description("Connect a source provider")
		.argument("<provider>", "Provider name (e.g. github, twitter, notion)")
		.action(async (provider: string) => {
			if (OAUTH_PROVIDERS.includes(provider.toLowerCase())) {
				printWarning(
					`${provider} requires browser-based OAuth and cannot be connected via the CLI.`,
				);
				console.log(
					`\nConnect your sources on the web dashboard:\n  ${chalk.cyan("https://onecontext.dev/sources")}\n`,
				);
				return;
			}

			printWarning(
				`Unknown provider "${provider}". Connect sources via the web dashboard:\n  ${chalk.cyan("https://onecontext.dev/sources")}`,
			);
		});
}
