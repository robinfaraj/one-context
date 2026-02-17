import { db } from "../client";

export async function findChatByIdAndUser(chatId: string, userId: string) {
	return db.chat.findFirst({
		where: { id: chatId, userId },
	});
}

export async function updateChat(chatId: string, data: { title?: string }) {
	return db.chat.update({
		where: { id: chatId },
		data,
	});
}

export async function findChatsWithMessages(userId: string) {
	return db.chat.findMany({
		where: { userId },
		include: { messages: true },
	});
}
