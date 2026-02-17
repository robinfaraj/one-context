"use client";

import { useChat } from "@ai-sdk/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useAISDKRuntime } from "@assistant-ui/react-ai-sdk";
import { DefaultChatTransport } from "ai";
import type { ReactNode } from "react";
import { useMemo, useRef } from "react";

interface ChatMessage {
	id: string;
	role: string;
	parts: Array<{ type: string; text: string }>;
	createdAt: string;
}

interface ChatRuntimeProviderProps {
	chatId: string;
	children: ReactNode;
	messages?: ChatMessage[];
	onFinish?: () => void;
}

export function ChatRuntimeProvider({
	chatId,
	children,
	messages = [],
	onFinish,
}: ChatRuntimeProviderProps) {
	const metadataRef = useRef({ chatId });
	metadataRef.current = { chatId };

	const transport = useMemo(() => {
		return new DefaultChatTransport({
			api: "/api/ai/chat",
			credentials: "include",
			prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => ({
				body: {
					id,
					messages,
					trigger,
					messageId,
					chatId: metadataRef.current.chatId,
				},
			}),
		});
	}, []);

	const uiMessages = useMemo(() => {
		return messages.map((msg) => ({
			id: msg.id,
			role: msg.role as "user" | "assistant",
			parts: msg.parts as Array<{ type: "text"; text: string }>,
			createdAt: new Date(msg.createdAt),
		}));
	}, [messages]);

	const onFinishRef = useRef(onFinish);
	onFinishRef.current = onFinish;

	const chat = useChat({
		id: chatId,
		transport,
		messages: uiMessages,
		onFinish: () => {
			onFinishRef.current?.();
		},
	});

	const runtime = useAISDKRuntime(chat);

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			{children}
		</AssistantRuntimeProvider>
	);
}
