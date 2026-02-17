import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";

export function ManualEntrySection() {
	return (
		<Card>
			<CardContent className="flex items-center justify-between gap-3 p-4">
				<div className="flex min-w-0 items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
						<MessageSquarePlus className="h-5 w-5 text-muted-foreground" />
					</div>
					<div className="min-w-0">
						<p className="font-medium truncate">Add Knowledge Manually</p>
						<p className="text-xs text-muted-foreground truncate">
							Add notes, projects, or any knowledge directly
						</p>
					</div>
				</div>
				<Button asChild variant="outline" size="sm" className="shrink-0">
					<Link href="/chat">Add via Chat</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
