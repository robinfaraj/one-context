import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";

export default function ChatPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
			<Card>
				<CardHeader>
					<CardTitle>Chat</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Talk to your AI assistant to add knowledge and explore your
						identity. Coming soon.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
