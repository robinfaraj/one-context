import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Chat {
	id: string;
	title: string | null;
	createdAt: string;
	updatedAt: string;
}

interface ChatWithMessages extends Chat {
	messages: Array<{
		id: string;
		chatId: string;
		role: string;
		parts: Array<{ type: string; text: string }>;
		createdAt: string;
	}>;
}

export const chatKeys = {
	all: ["chats"] as const,
	detail: (id: string) => ["chats", id] as const,
};

async function fetchApi<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, {
		credentials: "include",
		...init,
	});
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
	if (res.status === 204) return undefined as T;
	return res.json();
}

export function useChats() {
	return useQuery({
		queryKey: chatKeys.all,
		queryFn: () => fetchApi<Chat[]>("/api/ai/chats"),
	});
}

export function useChat(id: string | undefined) {
	return useQuery({
		queryKey: chatKeys.detail(id ?? ""),
		queryFn: () => fetchApi<ChatWithMessages>(`/api/ai/chats/${id}`),
		enabled: !!id,
	});
}

export function useDeleteChat() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) =>
			fetchApi(`/api/ai/chats/${id}`, { method: "DELETE" }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.all });
		},
	});
}
