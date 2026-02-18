"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api-client";

export interface DashboardUser {
	name: string;
	email: string;
	image?: string | null;
}

export interface DashboardStats {
	memoryCount: number;
	sourceCount: number;
	chatCount: number;
}

export interface DashboardSource {
	id: string;
	provider: string;
	displayName: string | null;
	status: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
	metadata: unknown;
	lastSyncedAt: string | null;
}

export interface DashboardActivity {
	id: string;
	type: string;
	contentType: string;
	rawData: unknown;
	importedAt: string;
	source: {
		id: string;
		provider: string;
		displayName: string | null;
		[key: string]: unknown;
	};
	[key: string]: unknown;
}

export interface DashboardResponse {
	user: DashboardUser;
	stats: DashboardStats;
	connectedSources: DashboardSource[];
	recentActivity: DashboardActivity[];
}

export function useDashboard() {
	return useQuery({
		queryKey: ["dashboard"],
		queryFn: async (): Promise<DashboardResponse> => {
			const res = await apiClient.dashboard.$get();
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return (await res.json()) as unknown as DashboardResponse;
		},
	});
}
