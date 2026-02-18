"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "./api-client";

export function useUpdateProfile() {
	return useMutation({
		mutationFn: async (data: { name?: string; profileSummary?: string }) => {
			const res = await apiClient.settings.profile.$put({ json: data });
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return res.json();
		},
		onSuccess: () => toast.success("Profile updated"),
		onError: () => toast.error("Failed to update profile"),
	});
}

export function useUpdateSyncSettings() {
	return useMutation({
		mutationFn: async (data: { syncEnabled: boolean }) => {
			const res = await apiClient.settings.sync.$put({ json: data });
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return res.json();
		},
		onSuccess: () => toast.success("Sync settings updated"),
		onError: () => toast.error("Failed to update sync settings"),
	});
}

export function useExportData() {
	return useMutation({
		mutationFn: async () => {
			const res = await apiClient.settings.export.$get();
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
		mutationFn: async () => {
			const res = await apiClient.settings.account.$delete();
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
		},
		onError: () => toast.error("Failed to delete account"),
	});
}
