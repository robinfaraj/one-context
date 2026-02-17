import MemoryClient from "mem0ai";
import type { AddMemoryOptions, MemoryProvider } from "../types";

export class Mem0Provider implements MemoryProvider {
	private client: MemoryClient;

	constructor(apiKey?: string) {
		const key = apiKey ?? process.env.MEM0_API_KEY;
		if (!key) {
			throw new Error("MEM0_API_KEY environment variable is required");
		}
		this.client = new MemoryClient({ apiKey: key });
	}

	async add(content: string, userId: string, options?: AddMemoryOptions) {
		return this.client.add([{ role: "user", content }], {
			user_id: userId,
			metadata: options?.metadata,
			categories: options?.categories,
		}) as any;
	}

	async search(
		query: string,
		userId: string,
		filters?: Record<string, unknown>,
	) {
		return this.client.search(query, {
			user_id: userId,
			filters,
		}) as any;
	}

	async get(memoryId: string) {
		return this.client.get(memoryId) as any;
	}

	async getAll(userId: string) {
		return this.client.getAll({
			user_id: userId,
		}) as any;
	}

	async update(memoryId: string, content: string) {
		return this.client.update(memoryId, { text: content }) as any;
	}

	async deleteMemory(memoryId: string) {
		return this.client.delete(memoryId) as any;
	}

	async deleteAll(userId: string) {
		return this.client.deleteAll({ user_id: userId }) as any;
	}

	async history(memoryId: string) {
		return this.client.history(memoryId) as any;
	}
}
