"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, { credentials: "include", ...init });
	if (!res.ok) throw new Error(`Request failed: ${res.status}`);
	return res.json();
}

export function useUpdateProfile() {
	return useMutation({
		mutationFn: (data: { name?: string; profileSummary?: string }) =>
			fetchJson("/api/settings/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			}),
		onSuccess: () => toast.success("Profile updated"),
		onError: () => toast.error("Failed to update profile"),
	});
}

export function useUpdateSyncSettings() {
	return useMutation({
		mutationFn: (data: { syncEnabled: boolean }) =>
			fetchJson("/api/settings/sync", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			}),
		onSuccess: () => toast.success("Sync settings updated"),
		onError: () => toast.error("Failed to update sync settings"),
	});
}

export function useExportData() {
	return useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/settings/export", {
				credentials: "include",
			});
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			const data = await res.json();
			const blob = new Blob([JSON.stringify(data, null, 2)], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `onecontext-export-${new Date().toISOString().slice(0, 10)}.json`;
			a.click();
			URL.revokeObjectURL(url);
		},
		onSuccess: () => toast.success("Data exported"),
		onError: () => toast.error("Failed to export data"),
	});
}

export function useDeleteAccount() {
	return useMutation({
		mutationFn: () => fetchJson("/api/settings/account", { method: "DELETE" }),
		onError: () => toast.error("Failed to delete account"),
	});
}
