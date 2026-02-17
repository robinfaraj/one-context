import type { UIMessage } from "ai";

export interface ChatMetadata {
	chatId: string;
	userId: string;
}

export interface ChatStreamOptions {
	chatId?: string;
	messages: UIMessage[];
	userId: string;
}
