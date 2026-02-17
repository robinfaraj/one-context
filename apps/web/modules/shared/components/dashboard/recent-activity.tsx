import { SourceIcon } from "@shared/components/sources/source-icon";
import { Card, CardContent } from "@ui/components/card";
import { Skeleton } from "@ui/components/skeleton";
import { Activity } from "lucide-react";
import type { DashboardActivity } from "../../lib/dashboard-api";

interface RecentActivityProps {
	activity?: DashboardActivity[];
	isLoading: boolean;
}

function formatRelativeTime(dateStr: string): string {
	const now = Date.now();
	const then = new Date(dateStr).getTime();
	const diffMs = now - then;
	const diffMin = Math.floor(diffMs / 60_000);

	if (diffMin < 1) return "just now";
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	const diffDay = Math.floor(diffHr / 24);
	if (diffDay < 30) return `${diffDay}d ago`;
	return new Date(dateStr).toLocaleDateString();
}

function getContentPreview(item: DashboardActivity): string {
	if (!item.rawData) return "Imported content";
	const raw =
		typeof item.rawData === "string"
			? item.rawData
			: JSON.stringify(item.rawData);
	const text = raw
		.replace(/[{}"\\]/g, "")
		.replace(/,/g, ", ")
		.trim();
	return text.length > 120 ? `${text.slice(0, 120)}...` : text;
}

const contentTypeBadgeColors: Record<string, string> = {
	tweet: "bg-sky-100 text-sky-700",
	repo: "bg-violet-100 text-violet-700",
	note: "bg-amber-100 text-amber-700",
	page: "bg-blue-100 text-blue-700",
};

export function RecentActivity({ activity, isLoading }: RecentActivityProps) {
	return (
		<div className="flex flex-col gap-3">
			<h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
				<Activity className="h-4 w-4" />
				Recent Activity
			</h3>
			<Card className="flex min-h-[225px] flex-col">
				<CardContent className="flex-1 pt-4">
					{isLoading ? (
						<div className="flex flex-col gap-3">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="flex items-start gap-3">
									<Skeleton className="mt-0.5 h-8 w-8 rounded-full" />
									<div className="flex-1 space-y-1.5">
										<Skeleton className="h-3.5 w-3/4" />
										<Skeleton className="h-3 w-1/3" />
									</div>
								</div>
							))}
						</div>
					) : !activity || activity.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
								<Activity className="h-5 w-5 text-muted-foreground" />
							</div>
							<p className="text-sm font-medium">No activity yet</p>
							<p className="text-xs text-muted-foreground">
								Connect a source to get started
							</p>
						</div>
					) : (
						<div className="flex flex-col gap-1">
							{activity.map((item) => (
								<div
									key={item.id}
									className="flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-muted/50"
								>
									<div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
										<SourceIcon
											icon={item.source.provider}
											className="h-3.5 w-3.5"
										/>
									</div>
									<div className="min-w-0 flex-1">
										<div className="mb-0.5 flex items-center gap-2">
											<span
												className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium leading-none ${
													contentTypeBadgeColors[item.contentType] ??
													"bg-gray-100 text-gray-600"
												}`}
											>
												{item.contentType}
											</span>
											<span className="text-xs text-muted-foreground">
												{formatRelativeTime(item.importedAt)}
											</span>
										</div>
										<p className="line-clamp-2 text-xs text-muted-foreground">
											{getContentPreview(item)}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
