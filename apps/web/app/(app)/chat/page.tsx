"use client";

import { AiChat } from "@shared/components/chat/ai-chat";

export default function ChatPage() {
	return (
		<div className="flex flex-1 overflow-hidden">
			<title>Chat | OneContext</title>
			<AiChat />
		</div>
	);
}
