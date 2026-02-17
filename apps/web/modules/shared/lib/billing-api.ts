"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SubscriptionInfo {
	plan: string;
	isPro: boolean;
	subscription: {
		status: string;
		currentPeriodEnd: string;
		cancelAtPeriodEnd: boolean;
		stripePriceId: string;
	} | null;
	usage: {
		sources: number;
		memories: number;
		apiCallsToday: number;
	};
	limits: {
		sources: number | "unlimited";
		memories: number | "unlimited";
		apiCallsPerDay: number | "unlimited";
	};
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, { credentials: "include", ...init });
	if (!res.ok) throw new Error(`Request failed: ${res.status}`);
	return res.json();
}

export function useSubscription() {
	return useQuery<SubscriptionInfo>({
		queryKey: ["billing", "subscription"],
		queryFn: () => fetchJson<SubscriptionInfo>("/api/billing/subscription"),
	});
}

export function useCheckout() {
	return useMutation({
		mutationFn: async (priceId: string) => {
			const res = await fetchJson<{ url: string }>("/api/billing/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ priceId }),
			});
			return res;
		},
		onSuccess: (data) => {
			if (data.url) {
				window.location.href = data.url;
			}
		},
		onError: () => toast.error("Failed to create checkout session"),
	});
}

export function useCreatePortalSession() {
	return useMutation({
		mutationFn: async () => {
			const res = await fetchJson<{ url: string }>("/api/billing/portal", {
				method: "POST",
			});
			return res;
		},
		onSuccess: (data) => {
			if (data.url) {
				window.location.href = data.url;
			}
		},
		onError: () => toast.error("Failed to open billing portal"),
	});
}

export function useCancelSubscription() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			await fetchJson("/api/billing/cancel", { method: "POST" });
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["billing"] });
			toast.success("Subscription will be canceled at end of billing period");
		},
		onError: () => toast.error("Failed to cancel subscription"),
	});
}

export type { SubscriptionInfo };
