"use client";

import { config } from "@onecontext/config";
import {
	useCancelSubscription,
	useCheckout,
	useCreatePortalSession,
	useSubscription,
} from "@shared/lib/billing-api";
import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Skeleton } from "@ui/components/skeleton";
import { Check, CreditCard } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function BillingPage() {
	const { data: sub, isLoading } = useSubscription();
	const checkout = useCheckout();
	const portal = useCreatePortalSession();
	const cancel = useCancelSubscription();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (searchParams.get("success") === "true") {
			toast.success("Welcome to Pro! All limits have been removed.");
		}
	}, [searchParams]);

	if (isLoading) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<title>Billing | OneContext</title>
				<h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
				<Skeleton className="h-48 w-full rounded-lg" />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Skeleton className="h-64 rounded-lg" />
					<Skeleton className="h-64 rounded-lg" />
				</div>
			</div>
		);
	}

	if (!sub) return null;

	const proPlan = config.payments.plans.pro;
	const monthlyPrice = proPlan?.prices?.find((p) => p.interval === "month");
	const annualPrice = proPlan?.prices?.find((p) => p.interval === "year");

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<title>Billing | OneContext</title>
			<h1 className="text-2xl font-semibold tracking-tight">Billing</h1>

			{/* Current Plan Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<CreditCard className="h-5 w-5" />
						Current Plan
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div>
							<div className="flex items-center gap-2">
								<span className="text-2xl font-bold">
									{sub.isPro ? "Pro" : "Free"}
								</span>
								<span
									className={`rounded-full px-2 py-0.5 text-xs font-medium ${sub.isPro ? "bg-emerald-700/10 text-emerald-700" : "bg-muted text-muted-foreground"}`}
								>
									{sub.isPro ? "Active" : "Current"}
								</span>
							</div>
							{sub.subscription && (
								<p className="mt-1 text-sm text-muted-foreground">
									{sub.subscription.cancelAtPeriodEnd
										? `Cancels on ${new Date(sub.subscription.currentPeriodEnd).toLocaleDateString()}`
										: `Renews on ${new Date(sub.subscription.currentPeriodEnd).toLocaleDateString()}`}
								</p>
							)}
						</div>
						<div className="text-right text-sm text-muted-foreground">
							<p>
								Sources: {sub.usage.sources}
								{sub.limits.sources !== "unlimited"
									? `/${sub.limits.sources}`
									: ""}
							</p>
							<p>
								Memories: {sub.usage.memories}
								{sub.limits.memories !== "unlimited"
									? `/${sub.limits.memories}`
									: ""}
							</p>
							<p>
								API calls today: {sub.usage.apiCallsToday}
								{sub.limits.apiCallsPerDay !== "unlimited"
									? `/${sub.limits.apiCallsPerDay}`
									: ""}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Pro user management */}
			{sub.isPro && (
				<div className="flex gap-2">
					<Button onClick={() => portal.mutate()} disabled={portal.isPending}>
						{portal.isPending ? "Opening..." : "Manage Subscription"}
					</Button>
					{!sub.subscription?.cancelAtPeriodEnd && (
						<Button
							variant="outline"
							onClick={() => {
								if (
									confirm(
										"Are you sure you want to cancel? Your plan will remain active until the end of the billing period.",
									)
								) {
									cancel.mutate();
								}
							}}
							disabled={cancel.isPending}
						>
							{cancel.isPending ? "Canceling..." : "Cancel Plan"}
						</Button>
					)}
				</div>
			)}

			{/* Free user upgrade cards */}
			{!sub.isPro && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{/* Monthly */}
					<Card className="relative flex h-full flex-col border-2">
						<CardHeader>
							<CardTitle className="text-lg">Monthly</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-1 flex-col gap-4">
							<div>
								<span className="text-3xl font-bold">
									${monthlyPrice?.amount}
								</span>
								<span className="text-muted-foreground">/month</span>
							</div>
							<ul className="space-y-2 text-sm">
								<li className="flex items-center gap-2">
									<Check className="h-4 w-4 text-emerald-700" /> Unlimited
									sources
								</li>
								<li className="flex items-center gap-2">
									<Check className="h-4 w-4 text-emerald-700" /> Unlimited
									memories
								</li>
								<li className="flex items-center gap-2">
									<Check className="h-4 w-4 text-emerald-700" /> Auto daily sync
								</li>
								<li className="flex items-center gap-2">
									<Check className="h-4 w-4 text-emerald-700" /> 10,000 API
									calls/day
								</li>
							</ul>
							<Button
								className="mt-auto w-full bg-emerald-700 text-white hover:bg-emerald-800"
								onClick={() =>
									monthlyPrice?.priceId && checkout.mutate(monthlyPrice.priceId)
								}
								disabled={checkout.isPending}
							>
								{checkout.isPending ? "Redirecting..." : "Subscribe Monthly"}
							</Button>
						</CardContent>
					</Card>

					{/* Annual */}
					<Card className="relative flex h-full flex-col border-2 border-emerald-700">
						<div className="absolute -top-3 left-4 rounded-full bg-emerald-700 px-3 py-0.5 text-xs font-medium text-white">
							Best value
						</div>
						<CardHeader>
							<CardTitle className="text-lg">Annual</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-1 flex-col gap-4">
							<div>
								<span className="text-3xl font-bold">
									${annualPrice?.amount}
								</span>
								<span className="text-muted-foreground">/year</span>
							</div>
							<ul className="space-y-2 text-sm">
								<li className="flex items-center gap-2">
									<Check className="h-4 w-4 text-emerald-700" /> Everything in
									Monthly
								</li>
								<li className="flex items-center gap-2">
									<Check className="h-4 w-4 text-emerald-700" /> Save $
									{(monthlyPrice?.amount ?? 9) * 12 -
										(annualPrice?.amount ?? 99)}
									/year
								</li>
							</ul>
							<Button
								className="mt-auto w-full bg-emerald-700 text-white hover:bg-emerald-800"
								onClick={() =>
									annualPrice?.priceId && checkout.mutate(annualPrice.priceId)
								}
								disabled={checkout.isPending}
							>
								{checkout.isPending ? "Redirecting..." : "Subscribe Annually"}
							</Button>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
