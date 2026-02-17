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
	pendingConnections: string[];
	disconnectedProviders: string[];
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

export function useConnectSource() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (provider: string) =>
			fetchJson(`/api/sources/${provider}/connect`, { method: "POST" }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["sources"] });
			toast.success("Source connected and synced");
		},
		onError: () => toast.error("Failed to connect source"),
	});
}

export function useDisconnectSource() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (provider: string) =>
			fetchJson(`/api/sources/${provider}`, { method: "DELETE" }),
		onMutate: async (provider) => {
			// Cancel outgoing refetches so they don't overwrite our optimistic update
			await qc.cancelQueries({ queryKey: ["sources"] });
			const previous = qc.getQueryData<SourcesResponse>(["sources"]);

			// Optimistically move the source to disconnected
			if (previous) {
				qc.setQueryData<SourcesResponse>(["sources"], {
					...previous,
					connectedSources: previous.connectedSources.filter(
						(s) => s.provider !== provider,
					),
					integrations: previous.integrations.map((i) =>
						i.provider === provider
							? { ...i, connected: false, source: undefined }
							: i,
					),
					pendingConnections: previous.pendingConnections.filter(
						(p) => p !== provider,
					),
					disconnectedProviders: [...previous.disconnectedProviders, provider],
				});
			}

			return { previous };
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["sources"] });
			toast.success("Source disconnected");
		},
		onError: (_err, _provider, context) => {
			// Rollback on error
			if (context?.previous) {
				qc.setQueryData(["sources"], context.previous);
			}
			toast.error("Failed to disconnect source");
		},
	});
}

export type { Source, Integration, SourcesResponse };
