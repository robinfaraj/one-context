import * as mem0 from "@onecontext/memory";
import { tool } from "ai";
import { z } from "zod";

export function getSearchMemoriesTool(userId: string) {
	return tool({
		description:
			"Search the user's stored memories and knowledge. Use when the user asks about their stored information or when you need context about the user.",
		inputSchema: z.object({
			query: z.string().describe("The search query to find relevant memories"),
		}),
		execute: async ({ query }) => {
			const results = await mem0.search(query, userId);
			return results;
		},
	});
}
