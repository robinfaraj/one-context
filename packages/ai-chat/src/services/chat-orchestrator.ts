import { chatAgentSystemPrompt, chatModel } from "@onecontext/ai";
import { db } from "@onecontext/database/server";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import {
	getAddMemoryTool,
	getListSourcesTool,
	getSearchMemoriesTool,
	getWebSearchTool,
} from "../tools";
import type { ChatStreamOptions } from "../types";
import { generateChatTitle } from "./title";

export async function handleChatRequest({
	chatId,
	messages,
	userId,
}: ChatStreamOptions) {
	const currentChatId = chatId ?? crypto.randomUUID();

	// Find-or-create: if the chat doesn't exist yet, create it implicitly.
	// This supports the pattern where the client generates a UUID upfront
	// and the DB record is created on the first message.
	const existing = await db.chat.findFirst({
		where: { id: currentChatId, userId },
	});

	if (!existing) {
		await db.chat.create({
			data: {
				id: currentChatId,
				userId,
				title: "New Chat",
			},
		});
	}

	const lastMessage = messages[messages.length - 1];
	if (lastMessage?.role === "user") {
		await db.chatMessage.create({
			data: {
				chatId: currentChatId,
				role: "user",
				parts: lastMessage.parts as any,
			},
		});
	}

	const modelMessages = await convertToModelMessages(messages);

	const result = streamText({
		model: chatModel,
		system: chatAgentSystemPrompt,
		messages: modelMessages,
		tools: {
			webSearch: getWebSearchTool(),
			addMemory: getAddMemoryTool(userId),
			searchMemories: getSearchMemoriesTool(userId),
			listSources: getListSourcesTool(userId),
		},
		stopWhen: stepCountIs(5),
		onFinish: async ({ text }) => {
			await db.chatMessage.create({
				data: {
					chatId: currentChatId,
					role: "assistant",
					parts: [{ type: "text", text }],
				},
			});

			const allMessages = await db.chatMessage.findMany({
				where: { chatId: currentChatId },
				orderBy: { createdAt: "asc" },
				select: { role: true, parts: true },
			});

			generateChatTitle(currentChatId, allMessages).catch(() => {});
		},
	});

	return { result, chatId: currentChatId };
}
