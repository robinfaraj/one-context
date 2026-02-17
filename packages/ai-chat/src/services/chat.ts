import { db } from "@onecontext/database/server";

export async function listChats(userId: string) {
	return db.chat.findMany({
		where: { userId },
		orderBy: { updatedAt: "desc" },
		select: {
			id: true,
			title: true,
			createdAt: true,
			updatedAt: true,
		},
	});
}

export async function getChat(chatId: string, userId: string) {
	return db.chat.findFirst({
		where: { id: chatId, userId },
		include: {
			messages: {
				orderBy: { createdAt: "asc" },
			},
		},
	});
}

export async function createChat(userId: string, title?: string) {
	return db.chat.create({
		data: {
			userId,
			title: title ?? "New Chat",
		},
	});
}

export async function deleteChat(chatId: string, userId: string) {
	const chat = await db.chat.findFirst({
		where: { id: chatId, userId },
	});

	if (!chat) return null;

	await db.chat.delete({ where: { id: chatId } });
	return chat;
}
