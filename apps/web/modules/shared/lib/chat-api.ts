import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api-client";

export interface ChatMessage {
	id: string;
	role: string;
	parts: Array<{ type: string; text: string }>;
	createdAt: string;
	chatId: string;
	parentId: string | null;
	data: unknown;
}

export interface Chat {
	id: string;
	title: string | null;
	createdAt: string;
	updatedAt: string;
	userId: string;
}

export interface ChatWithMessages extends Chat {
	messages: ChatMessage[];
}

export const chatKeys = {
	all: ["chats"] as const,
	detail: (id: string) => ["chats", id] as const,
};

export function useChats() {
	return useQuery({
		queryKey: chatKeys.all,
		queryFn: async (): Promise<Chat[]> => {
			const res = await apiClient.ai.chats.$get();
			if (!res.ok) throw new Error(`Failed to fetch chats: ${res.statusText}`);
			return (await res.json()) as unknown as Chat[];
		},
	});
}

export function useChat(id: string | undefined) {
	return useQuery({
		queryKey: chatKeys.detail(id ?? ""),
		queryFn: async (): Promise<ChatWithMessages> => {
			const res = await apiClient.ai.chats[":id"].$get({
				param: { id: id! },
			});
			if (!res.ok) throw new Error(`Failed to fetch chat: ${res.statusText}`);
			return (await res.json()) as unknown as ChatWithMessages;
		},
		enabled: !!id,
	});
}

export function useDeleteChat() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await apiClient.ai.chats[":id"].$delete({
				param: { id },
			});
			if (!res.ok) throw new Error(`Failed to delete chat: ${res.statusText}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.all });
		},
	});
}
