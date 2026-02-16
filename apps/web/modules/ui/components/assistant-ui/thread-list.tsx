"use client";

import {
	AuiIf,
	ThreadListItemPrimitive,
	ThreadListPrimitive,
} from "@assistant-ui/react";
import { TooltipIconButton } from "@ui/components/assistant-ui/tooltip-icon-button";
import { Button } from "@ui/components/button";
import { Skeleton } from "@ui/components/skeleton";
import { PlusIcon, Trash2Icon } from "lucide-react";
import type { FC } from "react";

export const ThreadList: FC = () => {
	return (
		<ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col gap-1">
			<ThreadListNew />
			<AuiIf condition={({ threads }) => threads.isLoading}>
				<ThreadListSkeleton />
			</AuiIf>
			<AuiIf condition={({ threads }) => !threads.isLoading}>
				<ThreadListPrimitive.Items components={{ ThreadListItem }} />
			</AuiIf>
		</ThreadListPrimitive.Root>
	);
};

const ThreadListNew: FC = () => {
	return (
		<ThreadListPrimitive.New asChild>
			<Button
				variant="outline"
				className="aui-thread-list-new h-9 justify-start gap-2 rounded-lg border-dashed px-3 text-sm hover:border-emerald-700/30 hover:bg-emerald-700/5 data-active:bg-emerald-700/10"
			>
				<PlusIcon className="size-4" />
				New Chat
			</Button>
		</ThreadListPrimitive.New>
	);
};

const ThreadListSkeleton: FC = () => {
	return (
		<div className="flex flex-col gap-1">
			{Array.from({ length: 5 }, (_, i) => (
				<output
					key={`skeleton-${i}`}
					aria-label="Loading threads"
					className="aui-thread-list-skeleton-wrapper flex h-9 items-center px-3"
				>
					<Skeleton className="aui-thread-list-skeleton h-4 w-full" />
				</output>
			))}
		</div>
	);
};

const ThreadListItem: FC = () => {
	return (
		<ThreadListItemPrimitive.Root className="aui-thread-list-item group flex h-9 items-center rounded-lg transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none data-active:bg-emerald-700/10">
			<ThreadListItemPrimitive.Trigger className="aui-thread-list-item-trigger flex h-full flex-1 items-center truncate px-3 text-start text-sm">
				<ThreadListItemPrimitive.Title fallback="New Chat" />
			</ThreadListItemPrimitive.Trigger>
			<ThreadListItemDelete />
		</ThreadListItemPrimitive.Root>
	);
};

const ThreadListItemDelete: FC = () => {
	return (
		<ThreadListItemPrimitive.Delete asChild>
			<TooltipIconButton
				variant="ghost"
				tooltip="Delete chat"
				className="aui-thread-list-item-delete mr-2 size-7 p-0 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<Trash2Icon className="size-4" />
			</TooltipIconButton>
		</ThreadListItemPrimitive.Delete>
	);
};
