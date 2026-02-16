"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Source {
	id: string;
	provider: string;
	displayName: string;
	status: string;
	lastSyncAt: string | null;
	itemCount: number;
	createdAt: string;
	updatedAt: string;
}

interface Integration {
	provider: string;
	displayName: string;
	icon: string;
	description: string;
	available: boolean;
	comingSoon?: boolean;
	connected: boolean;
	source?: Source;
}

interface SourcesResponse {
	integrations: Integration[];
	connectedSources: Source[];
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, { credentials: "include", ...init });
	if (!res.ok) throw new Error(`Request failed: ${res.status}`);
	return res.json();
}

export function useSources() {
	return useQuery<SourcesResponse>({
		queryKey: ["sources"],
		queryFn: () => fetchJson<SourcesResponse>("/api/sources"),
	});
}

export function useSyncSource() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (provider: string) =>
			fetchJson(`/api/sources/${provider}/sync`, { method: "POST" }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["sources"] });
			toast.success("Sync started");
		},
		onError: () => toast.error("Failed to start sync"),
	});
}

export function useDisconnectSource() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (provider: string) =>
			fetchJson(`/api/sources/${provider}`, { method: "DELETE" }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["sources"] });
			toast.success("Source disconnected");
		},
		onError: () => toast.error("Failed to disconnect source"),
	});
}

export type { Source, Integration, SourcesResponse };
