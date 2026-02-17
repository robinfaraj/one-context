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

interface AiChatProps {
	id: string;
}

export function AiChat({ id }: AiChatProps) {
	const [chats, setChats] = useState<ChatListItem[]>([]);
	const [activeChatId, setActiveChatId] = useState<string>(id);
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

	// Check if the active chat is a known (existing) chat that needs loading.
	const isKnownChat = useMemo(
		() => chats.some((c) => c.id === activeChatId),
		[chats, activeChatId],
	);

	// Fetch messages only for known chats (ones that exist in the DB).
	// New chats (with a pre-generated UUID) won't be in the list yet.
	useEffect(() => {
		if (!isKnownChat) {
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
	}, [activeChatId, isKnownChat]);

	const handleNewChat = useCallback(() => {
		setActiveChatId(crypto.randomUUID());
		setChatData(null);
	}, []);

	const handleDeleteChat = useCallback(
		async (chatId: string) => {
			await fetch(`/api/ai/chats/${chatId}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (activeChatId === chatId) {
				setActiveChatId(crypto.randomUUID());
				setChatData(null);
			}
			fetchChats();
		},
		[activeChatId, fetchChats],
	);

	const handleSelectChat = useCallback((selectedId: string) => {
		setActiveChatId(selectedId);
	}, []);

	const messages = useMemo(() => {
		if (!chatData || chatData.id !== activeChatId) return [];
		return chatData.messages ?? [];
	}, [chatData, activeChatId]);

	// For known chats, wait until messages are loaded before mounting the
	// ChatRuntimeProvider so useChat gets the initial messages.
	const isReadyToRender =
		!isKnownChat || (chatData?.id === activeChatId && !isLoadingChat);

	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

	const handleSelectChatMobile = useCallback(
		(selectedId: string) => {
			handleSelectChat(selectedId);
			setMobileSidebarOpen(false);
		},
		[handleSelectChat],
	);

	const handleNewChatMobile = useCallback(() => {
		handleNewChat();
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
					onSelectChat={handleSelectChat}
					onDeleteChat={handleDeleteChat}
				/>
			</aside>
			<main className="flex flex-1 flex-col overflow-hidden">
				{isReadyToRender ? (
					<ChatRuntimeProvider
						key={activeChatId}
						chatId={activeChatId}
						messages={messages}
					>
						<Thread />
					</ChatRuntimeProvider>
				) : (
					<div className="flex flex-1 items-center justify-center">
						<div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					</div>
				)}
			</main>
		</div>
	);
}
