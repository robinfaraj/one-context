"use client";

import { authClient } from "@shared/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ApiKey {
	id: string;
	name: string | null;
	start: string | null;
	prefix: string | null;
	createdAt: Date;
	expiresAt: Date | null;
}

export function useApiKeys() {
	return useQuery<ApiKey[]>({
		queryKey: ["api-keys"],
		queryFn: async () => {
			const res = await authClient.apiKey.list();
			if (res.error) throw new Error(res.error.message);
			return (res.data ?? []) as ApiKey[];
		},
	});
}

export function useCreateApiKey() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (name: string) => {
			const res = await authClient.apiKey.create({ name });
			if (res.error) throw new Error(res.error.message);
			return res.data as { key: string } & ApiKey;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["api-keys"] });
			toast.success("API key created");
		},
		onError: (err: Error) => {
			toast.error(err.message || "Failed to create API key");
		},
	});
}

export function useDeleteApiKey() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await authClient.apiKey.delete({ keyId: id });
			if (res.error) throw new Error(res.error.message);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["api-keys"] });
			toast.success("API key revoked");
		},
		onError: (err: Error) => {
			toast.error(err.message || "Failed to revoke API key");
		},
	});
}
