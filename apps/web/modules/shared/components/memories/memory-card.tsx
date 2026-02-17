"use client";

import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { cn } from "@ui/lib/utils";
import {
	Brain,
	Check,
	Github,
	Pencil,
	Star,
	Trash2,
	Twitter,
	X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { Memory } from "../../lib/memories-api";
import {
	useDeleteMemory,
	usePinMemory,
	useUnpinMemory,
	useUpdateMemory,
} from "../../lib/memories-api";

function formatRelativeTime(dateStr: string): string {
	const diff = Date.now() - new Date(dateStr).getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
	if (days > 0) return rtf.format(-days, "day");
	if (hours > 0) return rtf.format(-hours, "hour");
	if (minutes > 0) return rtf.format(-minutes, "minute");
	return rtf.format(-seconds, "second");
}

function SourceIcon({ source }: { source?: string }) {
	switch (source) {
		case "twitter":
			return <Twitter className="h-3.5 w-3.5 text-muted-foreground" />;
		case "github":
			return <Github className="h-3.5 w-3.5 text-muted-foreground" />;
		default:
			return <Brain className="h-3.5 w-3.5 text-muted-foreground" />;
	}
}

interface MemoryCardProps {
	memory: Memory;
}

export function MemoryCard({ memory }: MemoryCardProps) {
	const [expanded, setExpanded] = useState(false);
	const [editing, setEditing] = useState(false);
	const [editValue, setEditValue] = useState(memory.memory);

	const pinned = memory.metadata?.pinned === true;
	const updateMemory = useUpdateMemory();
	const deleteMemory = useDeleteMemory();
	const pinMemory = usePinMemory();
	const unpinMemory = useUnpinMemory();

	const handleSave = () => {
		updateMemory.mutate(
			{ id: memory.id, content: editValue },
			{
				onSuccess: () => {
					setEditing(false);
					toast.success("Memory updated");
				},
			},
		);
	};

	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

	const handleDelete = useCallback(() => {
		if (!confirmingDelete) {
			setConfirmingDelete(true);
			deleteTimeoutRef.current = setTimeout(
				() => setConfirmingDelete(false),
				3000,
			);
			return;
		}
		if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
		deleteMemory.mutate(memory.id, {
			onSuccess: () => toast.success("Memory deleted"),
		});
	}, [confirmingDelete, deleteMemory, memory.id]);

	const pinPending = pinMemory.isPending || unpinMemory.isPending;

	const handleTogglePin = () => {
		if (pinPending) return;
		if (pinned) {
			unpinMemory.mutate(memory.id);
		} else {
			pinMemory.mutate(memory.id);
		}
	};

	const isLong = memory.memory.length > 200;

	return (
		<Card
			className={cn(
				"transition-colors",
				pinned && "border-primary/20 dark:border-primary/50",
			)}
		>
			<CardContent className="p-4">
				{editing ? (
					<div className="space-y-2">
						<textarea
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
							className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
							rows={4}
						/>
						<div className="flex gap-1.5">
							<Button size="sm" className="h-7" onClick={handleSave}>
								<Check className="mr-1 h-3 w-3" />
								Save
							</Button>
							<Button
								size="sm"
								variant="ghost"
								className="h-7"
								onClick={() => {
									setEditing(false);
									setEditValue(memory.memory);
								}}
							>
								<X className="mr-1 h-3 w-3" />
								Cancel
							</Button>
						</div>
					</div>
				) : (
					<>
						<p
							className={cn(
								"text-sm leading-relaxed",
								!expanded && isLong && "line-clamp-3",
							)}
						>
							{memory.memory}
						</p>
						{isLong && (
							<button
								type="button"
								onClick={() => setExpanded(!expanded)}
								className="mt-1 text-xs text-muted-foreground hover:text-foreground"
							>
								{expanded ? "Show less" : "Show more"}
							</button>
						)}
					</>
				)}

				<div className="mt-3 flex flex-wrap items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<SourceIcon source={memory.metadata?.source as string} />
						<span className="text-xs text-muted-foreground">
							{formatRelativeTime(memory.updated_at)}
						</span>
						{memory.categories?.map((cat) => (
							<span
								key={cat}
								className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-primary dark:bg-accent/40 dark:text-primary"
							>
								{cat}
							</span>
						))}
					</div>
					<div className="flex items-center gap-0.5">
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							onClick={handleTogglePin}
							disabled={pinPending}
						>
							<Star
								className={cn(
									"h-3.5 w-3.5",
									pinPending && "animate-pulse",
									pinned
										? "fill-warning text-warning"
										: "text-muted-foreground",
								)}
							/>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							onClick={() => setEditing(true)}
						>
							<Pencil className="h-3.5 w-3.5 text-muted-foreground" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								"h-7 w-7",
								confirmingDelete && "text-destructive hover:text-destructive",
							)}
							onClick={handleDelete}
						>
							{confirmingDelete ? (
								<Check className="h-3.5 w-3.5" />
							) : (
								<Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
							)}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
