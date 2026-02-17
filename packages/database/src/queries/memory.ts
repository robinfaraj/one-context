import { db } from "../client";

export async function findPinnedMemoryIdsByUserId(userId: string) {
	return db.pinnedMemory.findMany({
		where: { userId },
		select: { memoryId: true },
	});
}

export async function upsertPinnedMemory(userId: string, memoryId: string) {
	return db.pinnedMemory.upsert({
		where: {
			userId_memoryId: { userId, memoryId },
		},
		update: {},
		create: { userId, memoryId },
	});
}

export async function deletePinnedMemory(userId: string, memoryId: string) {
	return db.pinnedMemory.deleteMany({
		where: { userId, memoryId },
	});
}
