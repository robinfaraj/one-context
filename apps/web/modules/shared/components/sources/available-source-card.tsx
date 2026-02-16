"use client";

import { authClient } from "@onecontext/auth/client";
import type { Integration } from "@shared/lib/sources-api";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { cn } from "@ui/lib/utils";
import { SourceIcon } from "./source-icon";

interface AvailableSourceCardProps {
	integration: Integration;
}

export function AvailableSourceCard({ integration }: AvailableSourceCardProps) {
	const handleConnect = () => {
		if (integration.comingSoon || !integration.available) return;
		authClient.signIn.social({
			provider: integration.provider as "github" | "twitter",
			callbackURL: "/sources",
		});
	};

	return (
		<Card className={cn(integration.comingSoon && "opacity-60")}>
			<CardContent className="p-4">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
							<SourceIcon icon={integration.icon} className="h-5 w-5" />
						</div>
						<div>
							<p className="font-medium">{integration.displayName}</p>
							<p className="text-xs text-muted-foreground">
								{integration.description}
							</p>
						</div>
					</div>
					<Button
						size="sm"
						disabled={integration.comingSoon || !integration.available}
						onClick={handleConnect}
						className={cn(
							!integration.comingSoon &&
								"bg-emerald-700 hover:bg-emerald-800 text-white",
						)}
					>
						{integration.comingSoon ? "Coming Soon" : "Connect"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
