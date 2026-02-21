import MemoryClient from "mem0ai";
import type {
	AddMemoryOptions,
	AddResult,
	Memory,
	MemoryHistory,
	MemoryProvider,
	SearchResult,
} from "../types";

/** Shape returned by Mem0 paginated endpoints */
interface Mem0PaginatedResponse {
	results?: unknown[];
}

export class Mem0Provider implements MemoryProvider {
	private client: MemoryClient;

	constructor(apiKey?: string) {
		const key = apiKey ?? process.env.MEM0_API_KEY;
		if (!key) {
			throw new Error("MEM0_API_KEY environment variable is required");
		}
		this.client = new MemoryClient({ apiKey: key });
	}

	async add(
		content: string,
		userId: string,
		options?: AddMemoryOptions,
	): Promise<AddResult> {
		return this.client.add([{ role: "user", content }], {
			user_id: userId,
			metadata: options?.metadata,
			categories: options?.categories,
		}) as unknown as AddResult;
	}

	async search(
		query: string,
		userId: string,
		filters?: Record<string, unknown>,
	): Promise<SearchResult[]> {
		return this.client.search(query, {
			user_id: userId,
			filters,
		}) as unknown as SearchResult[];
	}

	async get(memoryId: string): Promise<Memory> {
		return this.client.get(memoryId) as unknown as Memory;
	}

	async getAll(userId: string): Promise<Memory[]> {
		const PAGE_SIZE = 100;
		const allMemories: Memory[] = [];
		let page = 1;

		// Fetch all pages — Mem0 paginates results
		while (true) {
			const response = await this.client.getAll({
				user_id: userId,
				page,
				page_size: PAGE_SIZE,
			});

			// Unwrap paginated response format
			const results = Array.isArray(response)
				? (response as unknown as Memory[])
				: Array.isArray((response as Mem0PaginatedResponse)?.results)
					? ((response as Mem0PaginatedResponse).results as unknown as Memory[])
					: [];

			allMemories.push(...results);

			// Stop if we got fewer than a full page (no more data)
			if (results.length < PAGE_SIZE) break;
			page++;
		}

		return allMemories;
	}

	async update(memoryId: string, content: string): Promise<Memory> {
		return this.client.update(memoryId, {
			text: content,
		}) as unknown as Memory;
	}

	async deleteMemory(memoryId: string): Promise<void> {
		try {
			await this.client.delete(memoryId);
		} catch (error: unknown) {
			// Treat "not found" as success — the memory is already gone
			const message =
				error instanceof Error ? error.message : String(error);
			if (message.includes("Memory not found")) return;
			throw error;
		}
	}

	async deleteAll(userId: string): Promise<void> {
		await this.client.deleteAll({ user_id: userId });
	}

	async history(memoryId: string): Promise<MemoryHistory[]> {
		return this.client.history(memoryId) as unknown as MemoryHistory[];
	}
}
