"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Memory {
	id: string;
	memory: string;
	categories: string[];
	metadata: {
		source?: string;
		pinned?: boolean;
		[key: string]: unknown;
	};
	created_at: string;
	updated_at: string;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, { credentials: "include", ...init });
	if (!res.ok) throw new Error(`Request failed: ${res.status}`);
	return res.json();
}

export function useMemories() {
	return useQuery<Memory[]>({
		queryKey: ["memories"],
		queryFn: () => fetchJson<Memory[]>("/api/memories"),
	});
}

export function useSearchMemories(query: string) {
	return useQuery<Memory[]>({
		queryKey: ["memories", "search", query],
		queryFn: () =>
			fetchJson<Memory[]>(
				`/api/memories/search?q=${encodeURIComponent(query)}`,
			),
		enabled: query.length > 0,
	});
}

export function useUpdateMemory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, content }: { id: string; content: string }) =>
			fetchJson(`/api/memories/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content }),
			}),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
	});
}

export function useDeleteMemory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) =>
			fetchJson(`/api/memories/${id}`, { method: "DELETE" }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
	});
}

export function usePinMemory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) =>
			fetchJson(`/api/memories/${id}/pin`, { method: "POST" }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
	});
}

export function useUnpinMemory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) =>
			fetchJson(`/api/memories/${id}/pin`, { method: "DELETE" }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
	});
}
