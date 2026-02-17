"use client";

import type { Source } from "@shared/lib/sources-api";
import { useDisconnectSource, useSyncSource } from "@shared/lib/sources-api";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { cn } from "@ui/lib/utils";
import { Loader2, RefreshCw, Unplug } from "lucide-react";
import { useState } from "react";
import { SourceIcon } from "./source-icon";

function formatRelativeTime(dateStr: string | null): string {
	if (!dateStr) return "Never";
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	if (diffMin < 1) return "Just now";
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	const diffDays = Math.floor(diffHr / 24);
	return `${diffDays}d ago`;
}

interface SourceCardProps {
	source: Source;
	icon: string;
}

export function SourceCard({ source, icon }: SourceCardProps) {
	const [showConfirm, setShowConfirm] = useState(false);
	const syncMutation = useSyncSource();
	const disconnectMutation = useDisconnectSource();
	const isSyncing =
		source.status === "syncing" ||
		(syncMutation.isPending && syncMutation.variables === source.provider);

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-start justify-between gap-3">
					<div className="flex min-w-0 items-center gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
							<SourceIcon icon={icon} className="h-5 w-5" />
						</div>
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<p className="font-medium truncate">{source.displayName}</p>
								<span
									className={cn(
										"inline-flex h-2 w-2 rounded-full",
										source.status === "error"
											? "bg-red-500"
											: isSyncing
												? "bg-yellow-500"
												: "bg-primary",
									)}
								/>
							</div>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span>
									{source.itemCount} item{source.itemCount !== 1 ? "s" : ""}
								</span>
								<span>·</span>
								<span>Synced {formatRelativeTime(source.lastSyncAt)}</span>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-3 flex flex-wrap items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={isSyncing}
						onClick={() => syncMutation.mutate(source.provider)}
					>
						{isSyncing ? (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						) : (
							<RefreshCw className="mr-1.5 h-3.5 w-3.5" />
						)}
						{isSyncing ? "Syncing..." : "Sync Now"}
					</Button>
					{showConfirm ? (
						<div className="flex items-center gap-1.5">
							<Button
								variant="destructive"
								size="sm"
								disabled={disconnectMutation.isPending}
								onClick={() => {
									disconnectMutation.mutate(source.provider);
									setShowConfirm(false);
								}}
							>
								Confirm
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowConfirm(false)}
							>
								Cancel
							</Button>
						</div>
					) : (
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground"
							onClick={() => setShowConfirm(true)}
						>
							<Unplug className="mr-1.5 h-3.5 w-3.5" />
							Disconnect
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
