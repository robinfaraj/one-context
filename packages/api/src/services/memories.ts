import {
	deletePinnedMemory,
	findPinnedMemoryIdsByUserId,
	upsertPinnedMemory,
} from "@onecontext/database/queries";
import * as mem0 from "@onecontext/memory";

export async function addMemory(
	content: string,
	userId: string,
	categories?: string[],
) {
	return mem0.add(content, userId, categories ? { categories } : undefined);
}

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

async function verifyMemoryOwnership(memoryId: string, userId: string) {
	const memory = await mem0.get(memoryId);
	if (!memory || memory.metadata?.user_id !== userId) {
		return null;
	}
	return memory;
}

export async function updateMemory(
	memoryId: string,
	content: string,
	userId: string,
) {
	const memory = await verifyMemoryOwnership(memoryId, userId);
	if (!memory) {
		return null;
	}
	return mem0.update(memoryId, content);
}

export async function deleteMemory(memoryId: string, userId: string) {
	const memory = await verifyMemoryOwnership(memoryId, userId);
	if (!memory) {
		return null;
	}
	await mem0.deleteMemory(memoryId);
	return true;
}

export async function pinMemory(userId: string, memoryId: string) {
	const memory = await verifyMemoryOwnership(memoryId, userId);
	if (!memory) {
		return null;
	}
	return upsertPinnedMemory(userId, memoryId);
}

export async function unpinMemory(userId: string, memoryId: string) {
	await deletePinnedMemory(userId, memoryId);
}
