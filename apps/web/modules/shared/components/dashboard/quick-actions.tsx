import { Card, CardContent } from "@ui/components/card";
import { Brain, MessageSquare, Plug } from "lucide-react";
import Link from "next/link";

const actions = [
	{
		label: "Chat with AI",
		description: "Ask questions about your data",
		href: "/chat",
		icon: MessageSquare,
	},
	{
		label: "Connect Source",
		description: "Import from X, GitHub, Notion",
		href: "/sources",
		icon: Plug,
	},
	{
		label: "View Memories",
		description: "Browse your AI knowledge",
		href: "/memories",
		icon: Brain,
	},
];

export function QuickActions() {
	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-sm font-medium text-muted-foreground">
				Quick Actions
			</h3>
			<div className="flex flex-col gap-2">
				{actions.map((action) => {
					const Icon = action.icon;
					return (
						<Link key={action.href} href={action.href}>
							<Card className="transition-colors hover:border-primary/30 hover:bg-muted/30">
								<CardContent className="flex items-center gap-3 p-4">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
										<Icon className="h-4 w-4 text-primary" />
									</div>
									<div className="min-w-0">
										<p className="text-sm font-medium">{action.label}</p>
										<p className="text-xs text-muted-foreground">
											{action.description}
										</p>
									</div>
								</CardContent>
							</Card>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
