"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "./api-client";

export interface SubscriptionInfo {
	plan: string;
	planId: string;
	isPro: boolean;
	subscription: {
		id: string;
		status: string;
		currentPeriodEnd: string;
		cancelAtPeriodEnd: boolean;
	} | null;
	usage: {
		sources: number;
		memories: number;
		apiCallsToday: number;
	};
	limits: {
		memories: number | "unlimited";
		sources: number | "unlimited";
		apiCallsPerDay: number | "unlimited";
		[key: string]: number | "unlimited";
	};
}

export function useSubscription() {
	return useQuery({
		queryKey: ["billing", "subscription"],
		queryFn: async (): Promise<SubscriptionInfo> => {
			const res = await apiClient.billing.subscription.$get();
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return (await res.json()) as unknown as SubscriptionInfo;
		},
	});
}

export function useCheckout() {
	return useMutation({
		mutationFn: async (priceId: string) => {
			const res = await apiClient.billing.checkout.$post({
				json: { priceId },
			});
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return res.json();
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
			const res = await apiClient.billing.portal.$post();
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return res.json();
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
			const res = await apiClient.billing.cancel.$post();
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			await res.json();
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["billing"] });
			toast.success("Subscription will be canceled at end of billing period");
		},
		onError: () => toast.error("Failed to cancel subscription"),
	});
}
