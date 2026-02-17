"use client";

import { Thread } from "@ui/components/assistant-ui/thread";
import { Button } from "@ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@ui/components/sheet";
import { PanelLeftIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatRuntimeProvider } from "./chat-runtime-provider";
import { ChatSidebar } from "./chat-sidebar";

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

	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

	const handleSelectChatMobile = useCallback((id: string) => {
		setActiveChatId(id);
		setMobileSidebarOpen(false);
	}, []);

	const handleNewChatMobile = useCallback(async () => {
		await handleNewChat();
		setMobileSidebarOpen(false);
	}, [handleNewChat]);

	return (
		<div className="flex h-full w-full">
			{/* Mobile sidebar toggle */}
			<div className="absolute top-3 right-3 z-10 md:hidden">
				<Button
					variant="ghost"
					size="icon"
					className="size-8"
					onClick={() => setMobileSidebarOpen(true)}
					aria-label="Open chat history"
				>
					<PanelLeftIcon className="size-4" />
				</Button>
			</div>

			{/* Mobile sidebar sheet */}
			<Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
				<SheetContent side="left" className="w-72 p-3 pt-10">
					<SheetHeader className="sr-only">
						<SheetTitle>Chat History</SheetTitle>
					</SheetHeader>
					<ChatSidebar
						chats={chats}
						activeChatId={activeChatId}
						isLoading={isLoadingList}
						onNewChat={handleNewChatMobile}
						onSelectChat={handleSelectChatMobile}
						onDeleteChat={handleDeleteChat}
					/>
				</SheetContent>
			</Sheet>

			{/* Desktop sidebar */}
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
