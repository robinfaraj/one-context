import { db } from "../client";

export async function countChats(userId: string) {
	return db.chat.count({ where: { userId } });
}

export async function findRecentContentItems(userId: string, take = 10) {
	return db.contentItem.findMany({
		where: { source: { userId } },
		orderBy: { importedAt: "desc" },
		take,
		include: { source: true },
	});
}

export async function findContentItemsByUser(userId: string) {
	return db.contentItem.findMany({
		where: { source: { userId } },
	});
}
