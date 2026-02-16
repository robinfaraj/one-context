import { db } from "@onecontext/database/server";
import { tool } from "ai";
import { z } from "zod";

export function getListSourcesTool(userId: string) {
	return tool({
		description:
			"List all connected sources and integrations for the user. Use when the user asks about their connected sources or integration status.",
		inputSchema: z.object({}),
		execute: async () => {
			const sources = await db.source.findMany({
				where: { userId },
				select: {
					id: true,
					provider: true,
					status: true,
					lastSyncAt: true,
					memoryCount: true,
				},
			});
			return sources;
		},
	});
}
