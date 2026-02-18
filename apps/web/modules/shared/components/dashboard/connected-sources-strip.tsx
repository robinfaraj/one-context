import { SourceIcon } from "@shared/components/sources/source-icon";
import { Card, CardContent } from "@ui/components/card";
import { Skeleton } from "@ui/components/skeleton";
import { cn } from "@ui/lib/utils";
import { Plug } from "lucide-react";
import Link from "next/link";
import type { DashboardSource } from "../../lib/dashboard-api";

interface ConnectedSourcesStripProps {
	sources?: DashboardSource[];
	isLoading: boolean;
}

const statusColors: Record<string, string> = {
	connected: "bg-primary",
	syncing: "bg-warning",
	error: "bg-destructive",
};

export function ConnectedSourcesStrip({
	sources,
	isLoading,
}: ConnectedSourcesStripProps) {
	if (isLoading) {
		return (
			<Card>
				<CardContent className="flex items-center gap-4 p-5">
					<Skeleton className="h-5 w-5" />
					<Skeleton className="h-4 w-32" />
					<div className="ml-auto flex gap-2">
						<Skeleton className="h-8 w-8 rounded-full" />
						<Skeleton className="h-8 w-8 rounded-full" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!sources || sources.length === 0) {
		return (
			<Card>
				<CardContent className="flex flex-wrap items-center gap-4 p-5">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
						<Plug className="h-4 w-4 text-muted-foreground" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-medium">No sources connected</p>
						<p className="text-xs text-muted-foreground">
							Connect a source to start building your AI identity
						</p>
					</div>
					<Link
						href="/sources"
						className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Connect
					</Link>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent className="flex flex-wrap items-center gap-4 p-5">
				<p className="text-sm font-medium text-muted-foreground">Connected</p>
				<div className="flex flex-wrap items-center gap-3">
					{sources.map((source) => (
						<div
							key={source.id}
							className="relative"
							title={source.displayName ?? undefined}
						>
							<div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background">
								<SourceIcon icon={source.provider} className="h-4 w-4" />
							</div>
							<span
								className={cn(
									"absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
									statusColors[source.status] ?? "bg-muted-foreground",
								)}
							/>
						</div>
					))}
				</div>
				<Link
					href="/sources"
					className="ml-auto text-xs font-medium text-primary transition-colors hover:text-primary/90"
				>
					Manage
				</Link>
			</CardContent>
		</Card>
	);
}
