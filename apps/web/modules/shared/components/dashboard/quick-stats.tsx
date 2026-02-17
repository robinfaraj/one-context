import { useSubscription } from "@shared/lib/billing-api";
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
		limitKey: "memories" as const,
	},
	{
		key: "sourceCount" as const,
		label: "Sources",
		icon: Plug,
		limitKey: "sources" as const,
	},
	{
		key: "chatCount" as const,
		label: "Chats",
		icon: MessageSquare,
		limitKey: null,
	},
];

function getUsageColor(count: number, limit: number | "unlimited"): string {
	if (limit === "unlimited") return "";
	const pct = (count / limit) * 100;
	if (pct >= 100) return "text-red-600";
	if (pct >= 80) return "text-amber-600";
	return "";
}

export function QuickStats({ stats, isLoading }: QuickStatsProps) {
	const { data: sub } = useSubscription();

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
				const limit = s.limitKey && sub ? sub.limits[s.limitKey] : "unlimited";
				const colorClass = getUsageColor(count, limit);
				return (
					<Card key={s.key}>
						<CardContent className="flex items-center gap-4 p-5">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<Icon className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p
									className={`text-2xl font-semibold tracking-tight ${colorClass}`}
								>
									{count}
									{limit !== "unlimited" && (
										<span className="text-base font-normal text-muted-foreground">
											/{limit}
										</span>
									)}
								</p>
								<p className="text-sm text-muted-foreground">{s.label}</p>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
