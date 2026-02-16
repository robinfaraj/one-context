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
}

export function ChatRuntimeProvider({
	chatId,
	children,
	messages = [],
}: ChatRuntimeProviderProps) {
	const chatIdRef = useRef(chatId);
	chatIdRef.current = chatId;

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
					chatId: chatIdRef.current,
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

	const chat = useChat({
		id: chatId,
		transport,
		messages: uiMessages,
	});

	const runtime = useAISDKRuntime(chat);

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			{children}
		</AssistantRuntimeProvider>
	);
}
