"use client";

import { ConnectedSourcesStrip } from "@shared/components/dashboard/connected-sources-strip";
import { ProfileSummaryCard } from "@shared/components/dashboard/profile-summary-card";
import { QuickActions } from "@shared/components/dashboard/quick-actions";
import { QuickStats } from "@shared/components/dashboard/quick-stats";
import { RecentActivity } from "@shared/components/dashboard/recent-activity";
import { useDashboard } from "@shared/lib/dashboard-api";
import { Button } from "@ui/components/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardPage() {
	const { data, isLoading, isError, refetch } = useDashboard();

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center py-16 gap-3">
				<AlertTriangle className="h-8 w-8 text-muted-foreground" />
				<p className="text-sm text-muted-foreground">
					Failed to load dashboard
				</p>
				<Button variant="outline" size="sm" onClick={() => refetch()}>
					Try again
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-6 p-4 pt-0">
			<title>Dashboard | OneContext</title>
			<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

			<ProfileSummaryCard user={data?.user} isLoading={isLoading} />

			<QuickStats stats={data?.stats} isLoading={isLoading} />

			<ConnectedSourcesStrip
				sources={data?.connectedSources}
				isLoading={isLoading}
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
				<div className="lg:col-span-3">
					<RecentActivity
						activity={data?.recentActivity}
						isLoading={isLoading}
					/>
				</div>
				<div className="lg:col-span-2">
					<QuickActions />
				</div>
			</div>
		</div>
	);
}
