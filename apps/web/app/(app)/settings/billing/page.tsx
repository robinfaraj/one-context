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
import { AlertTriangle, Check, CreditCard } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function BillingPage() {
	const { data: sub, isLoading, isError, refetch } = useSubscription();
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

	if (isError || !sub) {
		return (
			<div className="flex flex-col items-center justify-center py-16 gap-3">
				<AlertTriangle className="h-8 w-8 text-muted-foreground" />
				<p className="text-sm text-muted-foreground">
					Failed to load billing information
				</p>
				<Button variant="outline" size="sm" onClick={() => refetch()}>
					Try again
				</Button>
			</div>
		);
	}

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
									className={`rounded-full px-2 py-0.5 text-xs font-medium ${sub.isPro ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
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
									<Check className="h-4 w-4 text-primary" /> Unlimited sources
								</li>
								<li className="flex items-center gap-2">
									<Check className="h-4 w-4 text-primary" /> Unlimited memories
								</li>
								<li className="flex items-center gap-2">
									<Check className="h-4 w-4 text-primary" /> Auto daily sync
								</li>
								<li className="flex items-center gap-2">
									<Check className="h-4 w-4 text-primary" /> 10,000 API
									calls/day
								</li>
							</ul>
							<Button
								className="mt-auto w-full bg-primary text-primary-foreground hover:bg-primary/90"
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
					<Card className="relative flex h-full flex-col border-2 border-primary">
						<div className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
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
									<Check className="h-4 w-4 text-primary" /> Everything in
									Monthly
								</li>
								<li className="flex items-center gap-2">
									<Check className="h-4 w-4 text-primary" /> Save $
									{(monthlyPrice?.amount ?? 9) * 12 -
										(annualPrice?.amount ?? 99)}
									/year
								</li>
							</ul>
							<Button
								className="mt-auto w-full bg-primary text-primary-foreground hover:bg-primary/90"
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
