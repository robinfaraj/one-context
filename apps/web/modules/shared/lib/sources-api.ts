"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "./api-client";

export interface Source {
	id: string;
	provider: string;
	displayName: string | null;
	status: string;
	itemCount: number;
	lastSyncAt: string | null;
	userId: string;
	createdAt: string;
	updatedAt: string;
	metadata: unknown;
	lastSyncedAt: string | null;
}

export interface Integration {
	provider: string;
	displayName: string;
	icon: string;
	description: string;
	available: boolean;
	comingSoon?: boolean;
	connected: boolean;
	source: Source | null;
}

export interface SourcesResponse {
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

export function useSources() {
	return useQuery({
		queryKey: ["sources"],
		queryFn: async (): Promise<SourcesResponse> => {
			const res = await apiClient.sources.$get();
			if (!res.ok) {
				const body = await res.json().catch((err: unknown) => {
					console.warn("Failed to parse error response body", {
						status: res.status,
						err,
					});
					return null;
				});
				const message =
					(body as Record<string, unknown> | null)?.error ??
					`Request failed: ${res.status}`;
				throw new ApiError(
					message as string,
					res.status,
					(body as Record<string, unknown> | null)?.upgrade as
						| boolean
						| undefined,
				);
			}
			return (await res.json()) as unknown as SourcesResponse;
		},
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
		mutationFn: async (provider: string): Promise<SyncResult> => {
			const res = await apiClient.sources[":provider"].sync.$post({
				param: { provider },
			});
			if (!res.ok) {
				const body = await res.json().catch((err: unknown) => {
					console.warn("Failed to parse error response body", {
						status: res.status,
						err,
					});
					return null;
				});
				const message =
					(body as Record<string, unknown> | null)?.error ??
					`Request failed: ${res.status}`;
				throw new ApiError(
					message as string,
					res.status,
					(body as Record<string, unknown> | null)?.upgrade as
						| boolean
						| undefined,
				);
			}
			return (await res.json()) as unknown as SyncResult;
		},
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
		mutationFn: async (provider: string): Promise<ConnectResult> => {
			const res = await apiClient.sources[":provider"].connect.$post({
				param: { provider },
			});
			if (!res.ok) {
				const body = await res.json().catch((err: unknown) => {
					console.warn("Failed to parse error response body", {
						status: res.status,
						err,
					});
					return null;
				});
				const message =
					(body as Record<string, unknown> | null)?.error ??
					`Request failed: ${res.status}`;
				throw new ApiError(
					message as string,
					res.status,
					(body as Record<string, unknown> | null)?.upgrade as
						| boolean
						| undefined,
				);
			}
			return (await res.json()) as unknown as ConnectResult;
		},
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
		mutationFn: async (provider: string) => {
			const res = await apiClient.sources[":provider"].$delete({
				param: { provider },
			});
			if (!res.ok) {
				const body = await res.json().catch((err: unknown) => {
					console.warn("Failed to parse error response body", {
						status: res.status,
						err,
					});
					return null;
				});
				const message =
					(body as Record<string, unknown> | null)?.error ??
					`Request failed: ${res.status}`;
				throw new Error(message as string);
			}
			return res.json();
		},
		onMutate: async (provider) => {
			await qc.cancelQueries({ queryKey: ["sources"] });
			const previous = qc.getQueryData<SourcesResponse>(["sources"]);

			if (previous) {
				qc.setQueryData<SourcesResponse>(["sources"], {
					...previous,
					connectedSources: previous.connectedSources.filter(
						(s) => s.provider !== provider,
					),
					integrations: previous.integrations.map((i) =>
						i.provider === provider
							? { ...i, connected: false, source: null }
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
			if (context?.previous) {
				qc.setQueryData(["sources"], context.previous);
			}
			toast.error("Failed to disconnect source");
		},
	});
}
