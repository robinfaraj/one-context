import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { db } from "@onecontext/database/server";
import * as mem0 from "@onecontext/memory";
import { z } from "zod";

export interface McpContext {
	userId: string;
}

export function createOneContextMcpServer(context: McpContext) {
	const server = new McpServer({
		name: "OneContext",
		version: "1.0.0",
	});

	const { userId } = context;

	// --- Tools ---

	server.tool(
		"get_profile",
		"Get the user's profile information",
		{},
		async () => {
			const user = await db.user.findUnique({ where: { id: userId } });
			if (!user) {
				return { content: [{ type: "text", text: "User not found" }] };
			}
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(
							{
								id: user.id,
								name: user.name,
								email: user.email,
								username: (user as any).username ?? null,
								image: user.image,
								bio: (user as any).bio ?? null,
							},
							null,
							2,
						),
					},
				],
			};
		},
	);

	server.tool(
		"search_memories",
		"Semantic search across the user's memories",
		{ query: z.string().describe("The search query") },
		async ({ query }) => {
			const results = await mem0.search(query, userId);
			return {
				content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
			};
		},
	);

	server.tool(
		"add_memory",
		"Add a new memory for the user",
		{
			content: z.string().describe("The memory content to store"),
			categories: z
				.array(z.string())
				.optional()
				.describe("Optional categories for the memory"),
		},
		async ({ content, categories }) => {
			const result = await mem0.add(content, userId, { categories });
			return {
				content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
			};
		},
	);

	server.tool("get_memories", "Get all memories for the user", {}, async () => {
		const memories = await mem0.getAll(userId);
		return {
			content: [{ type: "text", text: JSON.stringify(memories, null, 2) }],
		};
	});

	server.tool(
		"list_sources",
		"List the user's connected data sources",
		{},
		async () => {
			const sources = await db.source.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
			});
			return {
				content: [{ type: "text", text: JSON.stringify(sources, null, 2) }],
			};
		},
	);

	// --- Resources ---

	server.resource(
		"profile_summary",
		new ResourceTemplate("profile://summary", { list: undefined }),
		async () => {
			const user = await db.user.findUnique({ where: { id: userId } });
			const sources = await db.source.findMany({ where: { userId } });
			const summary = {
				name: user?.name,
				email: user?.email,
				username: (user as any)?.username ?? null,
				connectedSources: sources.map((s) => s.provider),
			};
			return {
				contents: [
					{
						uri: "profile://summary",
						text: JSON.stringify(summary, null, 2),
						mimeType: "application/json",
					},
				],
			};
		},
	);

	return server;
}
