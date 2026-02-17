export interface Memory {
	id: string;
	memory: string;
	metadata?: Record<string, unknown>;
	categories?: string[];
	created_at?: string;
	updated_at?: string;
}

export interface SearchResult {
	id: string;
	memory: string;
	score: number;
	metadata?: Record<string, unknown>;
	categories?: string[];
}

export interface MemoryHistory {
	id: string;
	memory_id: string;
	old_memory: string;
	new_memory: string;
	event: string;
	created_at: string;
}

export interface AddMemoryOptions {
	metadata?: Record<string, unknown>;
	categories?: string[];
}

export interface AddResult {
	results: Memory[];
}

export interface MemoryProvider {
	add(
		content: string,
		userId: string,
		options?: AddMemoryOptions,
	): Promise<AddResult>;
	search(
		query: string,
		userId: string,
		filters?: Record<string, unknown>,
	): Promise<SearchResult[]>;
	get(memoryId: string): Promise<Memory>;
	getAll(userId: string): Promise<Memory[]>;
	update(memoryId: string, content: string): Promise<Memory>;
	deleteMemory(memoryId: string): Promise<void>;
	deleteAll(userId: string): Promise<void>;
	history(memoryId: string): Promise<MemoryHistory[]>;
}
