"use client";

import { config } from "@onecontext/config";
import { useCheckout } from "@shared/lib/billing-api";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { Sparkles } from "lucide-react";

export function UpgradeCard() {
	const checkout = useCheckout();
	const monthlyPrice = config.payments.plans.pro?.prices?.find(
		(p) => p.interval === "month",
	);

	return (
		<Card className="border-primary/30 bg-primary/5">
			<CardContent className="p-4">
				<div className="flex items-start gap-3">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
						<Sparkles className="h-4 w-4 text-primary" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium">Upgrade to Pro</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							Unlimited sources, memories, and auto-sync
						</p>
						<Button
							size="sm"
							className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
							onClick={() =>
								monthlyPrice?.priceId && checkout.mutate(monthlyPrice.priceId)
							}
							disabled={checkout.isPending}
						>
							From ${monthlyPrice?.amount}/mo
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
