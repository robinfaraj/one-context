"use client";

import { config } from "@onecontext/config";
import { useCheckout } from "@shared/lib/billing-api";
import { Button } from "@ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@ui/components/dialog";
import { Brain, Lock, Plug, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";

interface UpgradeModalProps {
	open: boolean;
	onClose: () => void;
	trigger?: string;
}

const features = [
	{ icon: Plug, label: "Unlimited source connections" },
	{ icon: Brain, label: "Unlimited memories" },
	{ icon: RefreshCw, label: "Automatic daily sync" },
	{ icon: Zap, label: "10,000 API calls/day" },
];

export function UpgradeModal({ open, onClose, trigger }: UpgradeModalProps) {
	const [interval, setInterval] = useState<"month" | "year">("month");
	const checkout = useCheckout();

	const proPlan = config.payments.plans.pro;
	const price = proPlan?.prices?.find((p) => p.interval === interval);
	const monthlyPrice = proPlan?.prices?.find((p) => p.interval === "month");
	const annualPrice = proPlan?.prices?.find((p) => p.interval === "year");

	const handleUpgrade = () => {
		if (!price?.priceId) return;
		checkout.mutate(price.priceId);
	};

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent
				className="sm:max-w-md"
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				<DialogHeader className="items-center text-center">
					<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Lock className="h-6 w-6 text-primary" />
					</div>
					<DialogTitle className="text-xl">Upgrade to Pro</DialogTitle>
					<DialogDescription>
						Unlock the full power of OneContext
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-3">
						{features.map((f) => (
							<div key={f.label} className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
									<f.icon className="h-4 w-4 text-primary" />
								</div>
								<span className="text-sm">{f.label}</span>
							</div>
						))}
					</div>

					<div className="flex items-center justify-center gap-2 rounded-lg border p-1">
						<button
							type="button"
							onClick={() => setInterval("month")}
							className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
								interval === "month"
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Monthly — ${monthlyPrice?.amount}/mo
						</button>
						<button
							type="button"
							onClick={() => setInterval("year")}
							className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
								interval === "year"
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Annual — ${annualPrice?.amount}/yr
						</button>
					</div>

					{interval === "year" && (
						<p className="text-center text-xs font-medium text-primary">
							Save $
							{(monthlyPrice?.amount ?? 9) * 12 - (annualPrice?.amount ?? 99)}
							/year
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<Button
						onClick={handleUpgrade}
						disabled={checkout.isPending || !price?.priceId}
						className="bg-primary text-primary-foreground hover:bg-primary/90"
					>
						{checkout.isPending ? "Redirecting..." : "Upgrade to Pro"}
					</Button>
					<Button variant="ghost" onClick={onClose}>
						Maybe later
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
