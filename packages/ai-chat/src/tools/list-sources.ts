import { findSourcesSummaryByUserId } from "@onecontext/database/queries";
import { tool } from "ai";
import { z } from "zod";

export function getListSourcesTool(userId: string) {
	return tool({
		description:
			"List all connected sources and integrations for the user. Use when the user asks about their connected sources or integration status.",
		inputSchema: z.object({}),
		execute: async () => {
			return findSourcesSummaryByUserId(userId);
		},
	});
}
