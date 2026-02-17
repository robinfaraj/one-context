"use client";

import { Button } from "@ui/components/button";
import { Skeleton } from "@ui/components/skeleton";
import { AlertTriangle, Brain } from "lucide-react";
import type { Memory } from "../../lib/memories-api";
import { MemoryCard } from "./memory-card";

interface MemoryListProps {
	memories: Memory[] | undefined;
	isLoading: boolean;
	isError: boolean;
	onRetry?: () => void;
}

function SkeletonCards() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={`skeleton-${i}`} className="rounded-lg border p-4 space-y-3">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-4 w-1/2" />
					<div className="flex items-center gap-2 pt-2">
						<Skeleton className="h-3 w-3 rounded-full" />
						<Skeleton className="h-3 w-20" />
					</div>
				</div>
			))}
		</div>
	);
}

export function MemoryList({
	memories,
	isLoading,
	isError,
	onRetry,
}: MemoryListProps) {
	if (isLoading) return <SkeletonCards />;

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center py-16 gap-3">
				<AlertTriangle className="h-8 w-8 text-muted-foreground" />
				<p className="text-sm text-muted-foreground">
					Failed to load memories.
				</p>
				<Button variant="outline" size="sm" onClick={onRetry}>
					Try again
				</Button>
			</div>
		);
	}

	if (!memories || memories.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
				<Brain className="h-8 w-8" />
				<p className="text-sm">No memories yet</p>
				<p className="text-xs">
					Chat with your AI assistant to start building memories.
				</p>
			</div>
		);
	}

	const pinned = memories.filter((m) => m.metadata?.pinned);
	const unpinned = memories.filter((m) => !m.metadata?.pinned);
	const sorted = [...pinned, ...unpinned];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{sorted.map((memory) => (
				<MemoryCard key={memory.id} memory={memory} />
			))}
		</div>
	);
}
