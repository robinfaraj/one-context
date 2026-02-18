"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";

export interface Memory {
	id: string;
	memory: string;
	categories?: string[];
	created_at?: string;
	updated_at?: string;
	score?: number;
	metadata: {
		pinned?: boolean;
		source?: string;
		user_id?: string;
		[key: string]: unknown;
	};
}

export function useMemories() {
	return useQuery({
		queryKey: ["memories"],
		queryFn: async (): Promise<Memory[]> => {
			const res = await apiClient.memories.$get();
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return (await res.json()) as unknown as Memory[];
		},
	});
}

export function useSearchMemories(query: string) {
	return useQuery({
		queryKey: ["memories", "search", query],
		queryFn: async (): Promise<Memory[]> => {
			const res = await apiClient.memories.search.$get({
				query: { q: query },
			});
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return (await res.json()) as unknown as Memory[];
		},
		enabled: query.length > 0,
	});
}

export function useUpdateMemory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, content }: { id: string; content: string }) => {
			const res = await apiClient.memories[":id"].$put({
				param: { id },
				json: { content },
			});
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return res.json();
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
	});
}

export function useDeleteMemory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await apiClient.memories[":id"].$delete({
				param: { id },
			});
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
	});
}

export function usePinMemory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await apiClient.memories[":id"].pin.$post({
				param: { id },
			});
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return res.json();
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
	});
}

export function useUnpinMemory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await apiClient.memories[":id"].pin.$delete({
				param: { id },
			});
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
	});
}
