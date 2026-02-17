import {
	deletePinnedMemory,
	findPinnedMemoryIdsByUserId,
	upsertPinnedMemory,
} from "@onecontext/database/queries";
import * as mem0 from "@onecontext/memory";

export async function listMemories(userId: string) {
	const [memories, pinnedRows] = await Promise.all([
		mem0.getAll(userId),
		findPinnedMemoryIdsByUserId(userId),
	]);
	const pinnedIds = new Set(pinnedRows.map((r) => r.memoryId));
	return memories.map((m) => ({
		...m,
		metadata: {
			...m.metadata,
			pinned: pinnedIds.has(m.id),
		},
	}));
}

export async function searchMemories(
	query: string,
	userId: string,
	filters?: Record<string, unknown>,
) {
	return mem0.search(query, userId, filters);
}

export async function updateMemory(memoryId: string, content: string) {
	return mem0.update(memoryId, content);
}

export async function deleteMemory(memoryId: string) {
	await mem0.deleteMemory(memoryId);
}

export async function pinMemory(userId: string, memoryId: string) {
	return upsertPinnedMemory(userId, memoryId);
}

export async function unpinMemory(userId: string, memoryId: string) {
	await deletePinnedMemory(userId, memoryId);
}
