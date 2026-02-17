import { getMemoryProvider } from "./provider";
import type { AddMemoryOptions } from "./types";

export async function add(
	content: string,
	userId: string,
	options?: AddMemoryOptions,
) {
	return getMemoryProvider().add(content, userId, options);
}

export async function search(
	query: string,
	userId: string,
	filters?: Record<string, unknown>,
) {
	return getMemoryProvider().search(query, userId, filters);
}

export async function get(memoryId: string) {
	return getMemoryProvider().get(memoryId);
}

export async function getAll(userId: string) {
	return getMemoryProvider().getAll(userId);
}

export async function update(memoryId: string, content: string) {
	return getMemoryProvider().update(memoryId, content);
}

export async function deleteMemory(memoryId: string) {
	return getMemoryProvider().deleteMemory(memoryId);
}

export async function deleteAll(userId: string) {
	return getMemoryProvider().deleteAll(userId);
}

export async function history(memoryId: string) {
	return getMemoryProvider().history(memoryId);
}
