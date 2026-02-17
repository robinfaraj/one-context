import { titleModel } from "@onecontext/ai";
import { db } from "@onecontext/database/server";
import { generateText } from "ai";

interface MessagePart {
	type?: string;
	text?: string;
}

export async function generateChatTitle(
	chatId: string,
	messages: { role: string; parts: unknown }[],
) {
	const userMessages = messages.filter((m) => m.role === "user");
	if (userMessages.length < 2) return;

	const context = messages
		.slice(0, 6)
		.map((m) => {
			const parts = m.parts as MessagePart[] | undefined;
			const text =
				Array.isArray(parts) && parts.length > 0
					? (parts[0].text ?? JSON.stringify(parts[0]))
					: String(m.parts);
			return `${m.role}: ${text}`;
		})
		.join("\n");

	const { text } = await generateText({
		model: titleModel,
		prompt: `Generate a short title (max 6 words) for this conversation. Return only the title, no quotes or punctuation.\n\n${context}`,
	});

	const title = text.trim().slice(0, 100);

	await db.chat.update({
		where: { id: chatId },
		data: { title },
	});

	return title;
}
