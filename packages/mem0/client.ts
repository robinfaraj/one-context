import MemoryClient from "mem0ai";

let _client: MemoryClient | undefined;

function getClient(): MemoryClient {
	if (!_client) {
		const apiKey = process.env.MEM0_API_KEY;
		if (!apiKey) {
			throw new Error("MEM0_API_KEY environment variable is required");
		}
		_client = new MemoryClient({ apiKey });
	}
	return _client;
}

export interface AddMemoryOptions {
	metadata?: Record<string, unknown>;
	categories?: string[];
}

export async function add(
	content: string,
	userId: string,
	options?: AddMemoryOptions,
) {
	return getClient().add([{ role: "user", content }], {
		user_id: userId,
		metadata: options?.metadata,
		categories: options?.categories,
	});
}

export async function search(
	query: string,
	userId: string,
	filters?: Record<string, unknown>,
) {
	return getClient().search(query, {
		user_id: userId,
		filters,
	});
}

export async function get(memoryId: string) {
	return getClient().get(memoryId);
}

export async function getAll(userId: string) {
	return getClient().getAll({
		user_id: userId,
	});
}

export async function update(memoryId: string, content: string) {
	return getClient().update(memoryId, { text: content });
}

export async function deleteMemory(memoryId: string) {
	return getClient().delete(memoryId);
}

export async function history(memoryId: string) {
	return getClient().history(memoryId);
}
