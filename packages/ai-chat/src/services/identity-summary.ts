import { titleModel } from "@onecontext/ai";
import { findSourcesSummaryByUserId } from "@onecontext/database/queries";
import { logger } from "@onecontext/logs";
import { getAll } from "@onecontext/memory";
import { generateText } from "ai";

export async function generateIdentitySummary(
	userId: string,
	userName?: string,
): Promise<string> {
	const [memories, sources] = await Promise.all([
		getAll(userId).catch((err) => {
			logger.warn("Failed to fetch memories for identity summary", {
				userId,
				error: err,
			});
			return [];
		}),
		findSourcesSummaryByUserId(userId).catch((err) => {
			logger.warn("Failed to fetch sources for identity summary", {
				userId,
				error: err,
			});
			return [];
		}),
	]);

	if (memories.length === 0) {
		return "";
	}

	const memoryText = memories
		.slice(0, 50)
		.map((m) => `- ${m.memory}`)
		.join("\n");

	const sourceText = sources
		.map(
			(s) =>
				`${s.provider} (${s.status}, ${s.memoryCount ?? 0} memories synced)`,
		)
		.join(", ");

	const prompt = `You are summarizing a user's AI identity profile for an onboarding screen. Based on the data below, write a concise 2-4 sentence summary of who this person is — their role, what they work on, their tech interests, and recent activity. Write in second person ("You are..."). Be specific and concrete, not generic. If there isn't enough data for a rich summary, write what you can.

${userName ? `Name: ${userName}` : ""}
Connected sources: ${sourceText || "None"}
Memories (${memories.length} total):
${memoryText}`;

	const { text } = await generateText({
		model: titleModel,
		prompt,
	});

	return text.trim();
}
