import { Card, CardContent } from "@ui/components/card";
import { Skeleton } from "@ui/components/skeleton";
import { Brain, MessageSquare, Plug } from "lucide-react";
import type { DashboardStats } from "../../lib/dashboard-api";

interface QuickStatsProps {
	stats?: DashboardStats;
	isLoading: boolean;
}

const statConfig = [
	{
		key: "memoryCount" as const,
		label: "Memories",
		icon: Brain,
	},
	{
		key: "sourceCount" as const,
		label: "Sources",
		icon: Plug,
	},
	{
		key: "chatCount" as const,
		label: "Chats",
		icon: MessageSquare,
	},
];

export function QuickStats({ stats, isLoading }: QuickStatsProps) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{statConfig.map((s) => (
					<Card key={s.key}>
						<CardContent className="flex items-center gap-4 p-5">
							<Skeleton className="h-10 w-10 rounded-lg" />
							<div className="flex flex-col gap-1">
								<Skeleton className="h-6 w-12" />
								<Skeleton className="h-3.5 w-16" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
			{statConfig.map((s) => {
				const Icon = s.icon;
				const count = stats?.[s.key] ?? 0;
				return (
					<Card key={s.key}>
						<CardContent className="flex items-center gap-4 p-5">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700/10">
								<Icon className="h-5 w-5 text-emerald-700" />
							</div>
							<div>
								<p className="text-2xl font-semibold tracking-tight">{count}</p>
								<p className="text-sm text-muted-foreground">{s.label}</p>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
