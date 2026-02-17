import { AiChat } from "@shared/components/chat/ai-chat";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chat | OneContext" };

export default function ChatPage() {
	return (
		<div className="flex flex-1 overflow-hidden">
			<AiChat />
		</div>
	);
}
