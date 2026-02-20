import chalk from "chalk";
import type { Command } from "commander";
import { ApiError, apiRequest } from "../lib/api-client.js";
import { createSpinner, printError, printJson } from "../lib/output.js";

interface SubscriptionInfo {
	plan: string;
	status: string;
	currentPeriodEnd: string | null;
	usage: { memories: number; sources: number };
	limits: { memories: number | "unlimited"; sources: number | "unlimited" };
}

interface PortalResponse {
	url: string;
}

export function registerBillingCommand(program: Command): void {
	const billing = program
		.command("billing")
		.description("Manage billing and subscription")
		.option("--json", "Output as JSON")
		.action(async (options: { json?: boolean }) => {
			await showSubscriptionStatus(options.json);
		});

	billing
		.command("status")
		.description("View subscription status")
		.option("--json", "Output as JSON")
		.action(async (options: { json?: boolean }) => {
			await showSubscriptionStatus(options.json);
		});

	billing
		.command("portal")
		.description("Open the billing portal")
		.option("--json", "Output as JSON")
		.action(async (options: { json?: boolean }) => {
			const spinner = createSpinner("Getting billing portal…").start();

			try {
				const data = await apiRequest<PortalResponse>("/api/billing/portal", {
					method: "POST",
				});
				spinner.stop();

				if (options.json) {
					printJson(data);
					return;
				}

				console.log(chalk.bold("\n Billing Portal"));
				console.log(`  ${data.url}\n`);
			} catch (error) {
				spinner.fail("Failed to get billing portal.");
				if (error instanceof ApiError) {
					printError(error.message);
				} else {
					throw error;
				}
			}
		});
}

async function showSubscriptionStatus(json?: boolean): Promise<void> {
	const spinner = createSpinner("Loading subscription…").start();

	try {
		const data = await apiRequest<SubscriptionInfo>(
			"/api/billing/subscription",
		);
		spinner.stop();

		if (json) {
			printJson(data);
			return;
		}

		const periodEnd = data.currentPeriodEnd
			? new Date(data.currentPeriodEnd).toLocaleDateString()
			: "—";

		const formatLimit = (v: number | "unlimited") =>
			v === "unlimited" ? "unlimited" : String(v);

		console.log(chalk.bold("\n Subscription"));
		console.log(`  Plan:       ${data.plan}`);
		console.log(`  Status:     ${data.status}`);
		console.log(`  Period End: ${periodEnd}`);

		console.log(chalk.bold("\n Usage"));
		console.log(
			`  Memories: ${data.usage.memories} / ${formatLimit(data.limits.memories)}`,
		);
		console.log(
			`  Sources:  ${data.usage.sources} / ${formatLimit(data.limits.sources)}`,
		);
		console.log();
	} catch (error) {
		spinner.fail("Failed to load subscription.");
		if (error instanceof ApiError) {
			printError(error.message);
		} else {
			throw error;
		}
	}
}
