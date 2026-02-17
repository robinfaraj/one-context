#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server";

function parseArgs(args: string[]): { apiKey: string } {
	const idx = args.indexOf("--api-key");
	if (idx === -1 || idx + 1 >= args.length) {
		console.error("Usage: onecontext-mcp --api-key octx_...");
		process.exit(1);
	}
	return { apiKey: args[idx + 1] };
}

async function main() {
	const { apiKey } = parseArgs(process.argv.slice(2));

	const server = await createServer(apiKey);
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
