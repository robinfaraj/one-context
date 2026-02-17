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

class ApiError extends Error {
	status: number;
	upgrade?: boolean;

	constructor(message: string, status: number, upgrade?: boolean) {
		super(message);
		this.status = status;
		this.upgrade = upgrade;
	}
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, { credentials: "include", ...init });
	if (!res.ok) {
		const body = await res.json().catch((err) => {
			console.warn("Failed to parse error response body", {
				status: res.status,
				err,
			});
			return null;
		});
		const message = body?.error ?? `Request failed: ${res.status}`;
		throw new ApiError(message, res.status, body?.upgrade);
	}
	return res.json();
}

export function useSources() {
	return useQuery<SourcesResponse>({
		queryKey: ["sources"],
		queryFn: () => fetchJson<SourcesResponse>("/api/sources"),
	});
}

interface SyncResult {
	provider: string;
	itemsSynced: number;
	memoriesAdded: number;
}

export function useSyncSource() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (provider: string) =>
			fetchJson<SyncResult>(`/api/sources/${provider}/sync`, {
				method: "POST",
			}),
		onSuccess: (data) => {
			qc.invalidateQueries({ queryKey: ["sources"] });
			if (data.itemsSynced > 0) {
				toast.success(
					`Synced ${data.itemsSynced} items, ${data.memoriesAdded} memories added`,
				);
			} else {
				toast.success("Sync complete — no new items found");
			}
		},
		onError: (err: Error) => toast.error(err.message),
	});
}

interface ConnectResult {
	source: Source;
	syncResult: { itemsSynced: number; memoriesAdded: number } | null;
}

export function useConnectSource() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (provider: string) =>
			fetchJson<ConnectResult>(`/api/sources/${provider}/connect`, {
				method: "POST",
			}),
		onSuccess: (data) => {
			qc.invalidateQueries({ queryKey: ["sources"] });
			if (data.syncResult) {
				toast.success(
					`Connected and synced ${data.syncResult.itemsSynced} items`,
				);
			} else {
				toast.success("Source connected");
			}
		},
		onError: (err: Error) => toast.error(err.message),
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
