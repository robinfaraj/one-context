import { config } from "@onecontext/config";
import { db } from "@onecontext/database/server";
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
			const user = await db.user.findUnique({
				where: { id: userId },
				select: { plan: true },
			});
			const planConfig =
				config.payments.plans[user?.plan ?? "free"] ??
				config.payments.plans.free;
			const memoryLimit = planConfig.limits.memories;

			if (memoryLimit !== "unlimited") {
				const allMemories = await mem0.getAll(userId);
				if (allMemories.length >= memoryLimit) {
					return {
						success: false,
						message: `Memory limit reached (${allMemories.length}/${memoryLimit}). Tell the user they've hit their memory limit and suggest upgrading at [Settings → Billing](/settings/billing) to store more memories.`,
					};
				}
			}

			await mem0.add(content, userId, {
				categories,
				metadata: { source: "chat" },
			});
			return { success: true, message: "Memory saved successfully." };
		},
	});
}
