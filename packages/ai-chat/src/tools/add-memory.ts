import * as mem0 from "@onecontext/memory";
import { tool } from "ai";
import { z } from "zod";

export function getAddMemoryTool(userId: string) {
	return tool({
		description:
			"Store a memory or piece of knowledge for the user. Use when the user shares preferences, facts about themselves, or explicitly asks you to remember something.",
		inputSchema: z.object({
			content: z.string().describe("The knowledge or information to remember"),
			categories: z
				.array(z.string())
				.optional()
				.describe("Optional categories to organize the memory"),
		}),
		execute: async ({ content, categories }) => {
			await mem0.add(content, userId, { categories });
			return { success: true, message: "Memory saved successfully." };
		},
	});
}
