import { randomUUID } from "node:crypto";
import { AiChat } from "@shared/components/chat/ai-chat";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chat | OneContext" };

export default function ChatPage() {
	const id = randomUUID();

	return (
		<div className="flex flex-1 overflow-hidden">
			<AiChat id={id} />
		</div>
	);
}
