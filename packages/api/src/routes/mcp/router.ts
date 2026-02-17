import { StreamableHTTPTransport } from "@hono/mcp";
import type { Context } from "hono";
import { Hono } from "hono";
import { mcpAuthMiddleware } from "../../middleware/mcp-auth";
import { createOneContextMcpServer } from "./server";

async function handleMcpRequest(c: Context) {
	const user = c.get("user");

	const server = createOneContextMcpServer({
		userId: user.id,
	});

	const transport = new StreamableHTTPTransport();
	await server.connect(transport);
	return transport.handleRequest(c);
}

export const mcpRouter = new Hono()
	.basePath("/mcp")
	.use(mcpAuthMiddleware)
	.all("/", handleMcpRequest)
	.all("/*", handleMcpRequest);
