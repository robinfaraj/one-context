"use client";

import { Button } from "@ui/components/button";
import { Skeleton } from "@ui/components/skeleton";
import { cn } from "@ui/lib/utils";
import { CheckIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ChatListItem {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
}

interface ChatSidebarProps {
	chats: ChatListItem[];
	activeChatId: string | null;
	isLoading: boolean;
	onNewChat: () => void;
	onSelectChat: (id: string) => void;
	onDeleteChat: (id: string) => void;
}

export function ChatSidebar({
	chats,
	activeChatId,
	isLoading,
	onNewChat,
	onSelectChat,
	onDeleteChat,
}: ChatSidebarProps) {
	return (
		<div className="flex flex-col gap-1">
			<Button
				variant="outline"
				className="h-9 justify-start gap-2 rounded-lg border-dashed px-3 text-sm hover:border-emerald-700/30 hover:bg-emerald-700/5"
				onClick={onNewChat}
			>
				<PlusIcon className="size-4" />
				New Chat
			</Button>

			{isLoading ? (
				<div className="flex flex-col gap-1">
					{Array.from({ length: 3 }, (_, i) => (
						<div key={`skeleton-${i}`} className="flex h-9 items-center px-3">
							<Skeleton className="h-4 w-full" />
						</div>
					))}
				</div>
			) : (
				chats.map((chat) => (
					<ChatSidebarItem
						key={chat.id}
						chat={chat}
						isActive={chat.id === activeChatId}
						onSelect={() => onSelectChat(chat.id)}
						onDelete={() => onDeleteChat(chat.id)}
					/>
				))
			)}
		</div>
	);
}

interface ChatSidebarItemProps {
	chat: ChatListItem;
	isActive: boolean;
	onSelect: () => void;
	onDelete: () => void;
}

function ChatSidebarItem({
	chat,
	isActive,
	onSelect,
	onDelete,
}: ChatSidebarItemProps) {
	return (
		<div
			className={cn(
				"group flex h-9 items-center rounded-lg transition-colors hover:bg-muted",
				isActive && "bg-emerald-700/10",
			)}
		>
			<button
				type="button"
				className="flex h-full flex-1 items-center truncate px-3 text-start text-sm"
				onClick={onSelect}
			>
				{chat.title || "New Chat"}
			</button>
			<ConfirmDeleteButton onDelete={onDelete} />
		</div>
	);
}

interface ConfirmDeleteButtonProps {
	onDelete: () => void;
}

function ConfirmDeleteButton({ onDelete }: ConfirmDeleteButtonProps) {
	const [confirming, setConfirming] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			if (!confirming) {
				setConfirming(true);
				timeoutRef.current = setTimeout(() => setConfirming(false), 3000);
				return;
			}
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			onDelete();
		},
		[confirming, onDelete],
	);

	const Icon = confirming ? CheckIcon : Trash2Icon;

	return (
		<button
			type="button"
			className={cn(
				"mr-2 flex size-7 items-center justify-center rounded p-0 transition-opacity",
				confirming
					? "text-red-500 opacity-100"
					: "text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100",
			)}
			onClick={handleClick}
			aria-label={confirming ? "Confirm delete" : "Delete chat"}
		>
			<Icon className="size-4" />
		</button>
	);
}
