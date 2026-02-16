"use client";

import { Thread } from "@ui/components/assistant-ui/thread";
import { Button } from "@ui/components/button";
import { Skeleton } from "@ui/components/skeleton";
import { cn } from "@ui/lib/utils";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatRuntimeProvider } from "./chat-runtime-provider";

interface ChatListItem {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
}

interface ChatDetail {
	id: string;
	title: string;
	messages: Array<{
		id: string;
		role: string;
		parts: Array<{ type: string; text: string }>;
		createdAt: string;
	}>;
}

export function AiChat() {
	const [chats, setChats] = useState<ChatListItem[]>([]);
	const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [chatData, setChatData] = useState<ChatDetail | null>(null);
	const [isLoadingList, setIsLoadingList] = useState(true);
	const [isLoadingChat, setIsLoadingChat] = useState(false);

	// Fetch chat list
	const fetchChats = useCallback(async () => {
		try {
			const res = await fetch("/api/ai/chats", { credentials: "include" });
			if (res.ok) {
				const data = (await res.json()) as ChatListItem[];
				setChats(data);
			}
		} finally {
			setIsLoadingList(false);
		}
	}, []);

	useEffect(() => {
		fetchChats();
	}, [fetchChats]);

	// Fetch chat detail when active chat changes
	useEffect(() => {
		if (!activeChatId) {
			setChatData(null);
			return;
		}

		let cancelled = false;
		setIsLoadingChat(true);

		fetch(`/api/ai/chats/${activeChatId}`, { credentials: "include" })
			.then(async (res) => {
				if (cancelled) return;
				if (res.ok) {
					const data = (await res.json()) as ChatDetail;
					setChatData(data);
				}
			})
			.finally(() => {
				if (!cancelled) setIsLoadingChat(false);
			});

		return () => {
			cancelled = true;
		};
	}, [activeChatId]);

	const handleNewChat = useCallback(async () => {
		const res = await fetch("/api/ai/chats", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({}),
		});
		if (res.ok) {
			const chat = (await res.json()) as { id: string };
			setActiveChatId(chat.id);
			fetchChats();
		}
	}, [fetchChats]);

	const handleDeleteChat = useCallback(
		async (chatId: string) => {
			await fetch(`/api/ai/chats/${chatId}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (activeChatId === chatId) {
				setActiveChatId(null);
				setChatData(null);
			}
			fetchChats();
		},
		[activeChatId, fetchChats],
	);

	const effectiveChatId = activeChatId ?? "new";
	const messages = useMemo(() => {
		if (!chatData || chatData.id !== activeChatId) return [];
		return chatData.messages ?? [];
	}, [chatData, activeChatId]);

	// For existing chats, wait until messages are loaded before mounting the
	// ChatRuntimeProvider. useChat only reads initial messages at creation time,
	// so we must have them ready before the provider mounts.
	const isReadyToRender =
		!activeChatId || (chatData?.id === activeChatId && !isLoadingChat);

	return (
		<div className="flex h-full w-full">
			<aside className="hidden w-64 shrink-0 flex-col border-r p-3 md:flex">
				<ChatSidebar
					chats={chats}
					activeChatId={activeChatId}
					isLoading={isLoadingList}
					onNewChat={handleNewChat}
					onSelectChat={setActiveChatId}
					onDeleteChat={handleDeleteChat}
				/>
			</aside>
			<main className="flex flex-1 flex-col overflow-hidden">
				{isReadyToRender ? (
					<ChatRuntimeProvider
						key={effectiveChatId}
						chatId={effectiveChatId}
						messages={messages}
					>
						<Thread />
					</ChatRuntimeProvider>
				) : (
					<div className="flex flex-1 items-center justify-center">
						<div className="size-6 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
					</div>
				)}
			</main>
		</div>
	);
}

function ChatSidebar({
	chats,
	activeChatId,
	isLoading,
	onNewChat,
	onSelectChat,
	onDeleteChat,
}: {
	chats: ChatListItem[];
	activeChatId: string | null;
	isLoading: boolean;
	onNewChat: () => void;
	onSelectChat: (id: string) => void;
	onDeleteChat: (id: string) => void;
}) {
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

function ChatSidebarItem({
	chat,
	isActive,
	onSelect,
	onDelete,
}: {
	chat: ChatListItem;
	isActive: boolean;
	onSelect: () => void;
	onDelete: () => void;
}) {
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
			<button
				type="button"
				className="mr-2 flex size-7 items-center justify-center rounded p-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
				aria-label="Delete chat"
			>
				<Trash2Icon className="size-4" />
			</button>
		</div>
	);
}
