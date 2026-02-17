"use client";

import { useQuery } from "@tanstack/react-query";

interface DashboardUser {
	name: string;
	email: string;
	image: string | null;
}

interface DashboardStats {
	memoryCount: number;
	sourceCount: number;
	chatCount: number;
}

interface DashboardSource {
	id: string;
	provider: string;
	displayName: string;
	status: string;
	lastSyncAt: string | null;
	itemCount: number;
	createdAt: string;
	updatedAt: string;
}

interface DashboardActivity {
	id: string;
	contentType: string;
	externalId: string;
	rawData: any;
	importedAt: string;
	source: DashboardSource;
}

interface DashboardResponse {
	user: DashboardUser;
	stats: DashboardStats;
	connectedSources: DashboardSource[];
	recentActivity: DashboardActivity[];
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, { credentials: "include", ...init });
	if (!res.ok) throw new Error(`Request failed: ${res.status}`);
	return res.json();
}

export function useDashboard() {
	return useQuery<DashboardResponse>({
		queryKey: ["dashboard"],
		queryFn: () => fetchJson<DashboardResponse>("/api/dashboard"),
	});
}

export type {
	DashboardResponse,
	DashboardUser,
	DashboardStats,
	DashboardSource,
	DashboardActivity,
};
