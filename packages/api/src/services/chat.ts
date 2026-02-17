import { findChatByIdAndUser, updateChat } from "@onecontext/database/queries";

export async function updateChatTitle(
	chatId: string,
	userId: string,
	title?: string,
) {
	const chat = await findChatByIdAndUser(chatId, userId);
	if (!chat) return null;

	return updateChat(chatId, { title: title ?? chat.title });
}
