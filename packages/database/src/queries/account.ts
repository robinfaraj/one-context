import { db } from "../client";

export async function findUserChatsWithMessages(userId: string) {
	return db.chat.findMany({
		where: { userId },
		include: { messages: true },
	});
}

export async function findUserContentItems(userId: string) {
	return db.contentItem.findMany({
		where: { source: { userId } },
	});
}
