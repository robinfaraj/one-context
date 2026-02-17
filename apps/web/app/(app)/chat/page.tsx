import { randomUUID } from "node:crypto";
import { AiChat } from "@shared/components/chat/ai-chat";

export default function ChatPage() {
	const id = randomUUID();

	return (
		<div className="flex flex-1 overflow-hidden">
			<title>Chat | OneContext</title>
			<AiChat id={id} />
		</div>
	);
}
