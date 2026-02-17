"use client";

import { UpgradeModal } from "@shared/components/billing/upgrade-modal";
import { authClient } from "@shared/lib/api";
import type { Integration } from "@shared/lib/sources-api";
import { useConnectSource } from "@shared/lib/sources-api";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { cn } from "@ui/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { SourceIcon } from "./source-icon";

interface AvailableSourceCardProps {
	integration: Integration;
	isDisconnected?: boolean;
	atSourceLimit?: boolean;
}

export function AvailableSourceCard({
	integration,
	isDisconnected,
	atSourceLimit,
}: AvailableSourceCardProps) {
	const reconnect = useConnectSource();
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);

	const handleConnect = () => {
		if (integration.comingSoon || !integration.available) return;
		if (isLimited) {
			setShowUpgradeModal(true);
			return;
		}

		if (isDisconnected) {
			// OAuth account still exists — reconnect directly via API
			reconnect.mutate(integration.provider);
			return;
		}

		// First-time connection — need OAuth flow
		authClient.signIn.social({
			provider: integration.provider as "github" | "twitter",
			callbackURL: "/sources",
		});
	};

	const isPending = reconnect.isPending;
	const isLimited = atSourceLimit && !integration.comingSoon && !isDisconnected;
	const label = integration.comingSoon
		? "Coming Soon"
		: isDisconnected
			? "Reconnect"
			: "Connect";

	return (
		<Card className={cn(integration.comingSoon && "opacity-60")}>
			<CardContent className="p-4">
				<div className="flex items-center justify-between gap-3">
					<div className="flex min-w-0 items-center gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
							<SourceIcon icon={integration.icon} className="h-5 w-5" />
						</div>
						<div className="min-w-0">
							<p className="font-medium truncate">{integration.displayName}</p>
							<p className="text-xs text-muted-foreground truncate">
								{integration.description}
							</p>
						</div>
					</div>
					<div className="flex shrink-0 flex-col items-end gap-1">
						<Button
							size="sm"
							disabled={
								integration.comingSoon || !integration.available || isPending
							}
							onClick={handleConnect}
							className={cn(
								"shrink-0",
								!integration.comingSoon &&
									!isLimited &&
									"bg-primary hover:bg-primary/90 text-primary-foreground",
							)}
						>
							{isPending && (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							)}
							{label}
						</Button>
					</div>
				</div>
			</CardContent>
			<UpgradeModal
				open={showUpgradeModal}
				onClose={() => setShowUpgradeModal(false)}
				trigger={`sources:${integration.provider}`}
			/>
		</Card>
	);
}
