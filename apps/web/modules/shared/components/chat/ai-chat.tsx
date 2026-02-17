"use client";

import {
	chatKeys,
	useChat,
	useChats,
	useDeleteChat,
} from "@shared/lib/chat-api";
import { useQueryClient } from "@tanstack/react-query";
import { Thread } from "@ui/components/assistant-ui/thread";
import { Button } from "@ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@ui/components/sheet";
import { PanelLeftIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ChatRuntimeProvider } from "./chat-runtime-provider";
import { ChatSidebar } from "./chat-sidebar";

export function AiChat() {
	const [activeChatId, setActiveChatId] = useState<string>(() =>
		crypto.randomUUID(),
	);

	const queryClient = useQueryClient();
	const { data: rawChats = [], isLoading: isLoadingList } = useChats();
	const chats = useMemo(
		() =>
			rawChats.map((c) => ({
				...c,
				title: c.title ?? "Untitled",
			})),
		[rawChats],
	);
	const deleteChatMutation = useDeleteChat();

	// Check if the active chat is a known (existing) chat that needs loading.
	const isKnownChat = useMemo(
		() => chats.some((c) => c.id === activeChatId),
		[chats, activeChatId],
	);

	// Fetch messages only for known chats (ones that exist in the DB).
	// New chats (with a pre-generated UUID) won't be in the list yet.
	const { data: chatData, isLoading: isLoadingChat } = useChat(
		isKnownChat ? activeChatId : undefined,
	);

	const handleChatFinish = useCallback(() => {
		// Invalidate immediately to show the new chat in the sidebar.
		queryClient.invalidateQueries({ queryKey: chatKeys.all });

		// Title generation runs async server-side after the stream ends.
		// Poll a few times to pick it up once it's written to the DB.
		let attempts = 0;
		const poll = setInterval(() => {
			attempts++;
			queryClient.invalidateQueries({ queryKey: chatKeys.all });
			if (attempts >= 3) clearInterval(poll);
		}, 2000);
	}, [queryClient]);

	const handleNewChat = useCallback(() => {
		setActiveChatId(crypto.randomUUID());
	}, []);

	const handleDeleteChat = useCallback(
		(chatId: string) => {
			deleteChatMutation.mutate(chatId, {
				onSuccess: () => {
					if (activeChatId === chatId) {
						setActiveChatId(crypto.randomUUID());
					}
				},
			});
		},
		[activeChatId, deleteChatMutation],
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
						onFinish={handleChatFinish}
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
