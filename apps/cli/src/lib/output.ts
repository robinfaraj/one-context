import chalk from "chalk";
import ora from "ora";

export function printJson(data: unknown): void {
	console.log(JSON.stringify(data, null, 2));
}

export function printTable(headers: string[], rows: string[][]): void {
	const colWidths = headers.map((h, i) => {
		const maxRow = rows.reduce(
			(max, row) => Math.max(max, (row[i] ?? "").length),
			0,
		);
		return Math.max(h.length, maxRow);
	});

	const headerLine = headers
		.map((h, i) => chalk.bold(h.padEnd(colWidths[i])))
		.join("  ");
	const separator = colWidths.map((w) => "─".repeat(w)).join("──");

	console.log(headerLine);
	console.log(chalk.dim(separator));
	for (const row of rows) {
		const line = row
			.map((cell, i) => (cell ?? "").padEnd(colWidths[i]))
			.join("  ");
		console.log(line);
	}
}

export function createSpinner(text: string) {
	return ora(text);
}

export function printError(message: string): void {
	console.error(chalk.red(`Error: ${message}`));
}

export function printSuccess(message: string): void {
	console.log(chalk.green(message));
}

export function printWarning(message: string): void {
	console.log(chalk.yellow(message));
}

export function validateId(id: string): void {
	if (!id || id.includes("../") || id.includes("/") || id.includes("\\")) {
		printError("Invalid resource ID.");
		process.exit(1);
	}
}
