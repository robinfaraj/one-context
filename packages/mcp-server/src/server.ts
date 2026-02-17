import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { auth } from "@onecontext/auth";
import { db } from "@onecontext/database/server";
import * as mem0 from "@onecontext/memory";
import { z } from "zod";

async function resolveUser(apiKey: string) {
	const result = await auth.api.verifyApiKey({ body: { key: apiKey } });
	if (!result?.valid || !result.key) {
		throw new Error("Invalid API key");
	}
	const userId = (result.key as { userId: string }).userId;
	const user = await db.user.findUnique({ where: { id: userId } });
	if (!user) {
		throw new Error("User not found for this API key");
	}
	return user;
}

export async function createServer(apiKey: string) {
	const user = await resolveUser(apiKey);

	const server = new McpServer({
		name: "OneContext",
		version: "1.0.0",
	});

	// --- Tools ---

	server.tool(
		"get_profile",
		"Get the user's profile information",
		{},
		async () => {
			const freshUser = await db.user.findUnique({ where: { id: user.id } });
			if (!freshUser) {
				return { content: [{ type: "text", text: "User not found" }] };
			}
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(
							{
								id: freshUser.id,
								name: freshUser.name,
								email: freshUser.email,
								username: freshUser.username ?? null,
								image: freshUser.image,
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
			const results = await mem0.search(query, user.id);
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
			const result = await mem0.add(content, user.id, { categories });
			return {
				content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
			};
		},
	);

	server.tool("get_memories", "Get all memories for the user", {}, async () => {
		const memories = await mem0.getAll(user.id);
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
				where: { userId: user.id },
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
			const freshUser = await db.user.findUnique({ where: { id: user.id } });
			const sources = await db.source.findMany({ where: { userId: user.id } });
			const summary = {
				name: freshUser?.name,
				email: freshUser?.email,
				username: freshUser?.username ?? null,
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
