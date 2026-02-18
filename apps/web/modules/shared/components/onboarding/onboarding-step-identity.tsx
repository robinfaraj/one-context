"use client";

import { authClient } from "@shared/lib/api";
import { apiClient } from "@shared/lib/api-client";
import { useDashboard } from "@shared/lib/dashboard-api";
import { useSources } from "@shared/lib/sources-api";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { Skeleton } from "@ui/components/skeleton";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface OnboardingStepIdentityProps {
	onContinue: () => void;
}

const knownProviders: Record<string, string> = {
	github: "GitHub",
	twitter: "X",
};

const fadeIn = {
	hidden: { opacity: 0, y: 12 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" },
	}),
};

export function OnboardingStepIdentity({
	onContinue,
}: OnboardingStepIdentityProps) {
	const { data: session } = authClient.useSession();
	const { data: dashboard } = useDashboard();
	const { data: sources } = useSources();

	const { data: summaryData, isLoading: summaryLoading } = useQuery({
		queryKey: ["identity-summary"],
		queryFn: async () => {
			const res = await apiClient.ai["identity-summary"].$get();
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			return res.json();
		},
		staleTime: 60_000,
		retry: 1,
	});

	const user = dashboard?.user ?? session?.user;
	const connectedSources = (sources?.connectedSources ?? []).filter(
		(s) => s.provider in knownProviders,
	);

	const summary = summaryData?.summary;
	const hasSummary = summary && summary.length > 0;

	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
			<div className="w-full max-w-md space-y-8">
				{/* Header */}
				<motion.div
					className="space-y-2 text-center"
					variants={fadeIn}
					initial="hidden"
					animate="visible"
					custom={0}
				>
					<div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
						<Sparkles className="h-7 w-7 text-primary" />
					</div>
					<h2 className="text-2xl font-semibold tracking-tight">
						Here's what we know about you
					</h2>
				</motion.div>

				{/* Profile + AI Summary Card */}
				<motion.div
					variants={fadeIn}
					initial="hidden"
					animate="visible"
					custom={1}
				>
					<Card>
						<CardContent className="p-6">
							{/* User info */}
							<div className="flex items-center gap-4">
								<Avatar className="h-14 w-14">
									<AvatarImage
										src={user?.image ?? undefined}
										alt={user?.name ?? "User"}
									/>
									<AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
										{user?.name?.charAt(0)?.toUpperCase() ?? "U"}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0 flex-1">
									<p className="truncate text-lg font-medium">
										{user?.name ?? "Anonymous"}
									</p>
									{connectedSources.length > 0 && (
										<div className="mt-1.5 flex flex-wrap gap-1.5">
											{connectedSources.map((s) => (
												<span
													key={s.id}
													className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
												>
													{knownProviders[s.provider] ?? s.provider}
												</span>
											))}
										</div>
									)}
								</div>
							</div>

							{/* AI Summary */}
							<div className="mt-5 border-t pt-5">
								{summaryLoading ? (
									<div className="space-y-2.5">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-5/6" />
										<Skeleton className="h-4 w-4/6" />
									</div>
								) : hasSummary ? (
									<p className="text-sm leading-relaxed text-muted-foreground">
										{summary}
									</p>
								) : (
									<p className="text-sm text-muted-foreground">
										Connect more sources and chat with the assistant to build a
										richer identity. The more data we have, the better AI tools
										can understand you.
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.p
					className="text-center text-xs text-muted-foreground"
					variants={fadeIn}
					initial="hidden"
					animate="visible"
					custom={2}
				>
					This auto-updates weekly (daily with Pro).
				</motion.p>

				{/* Continue */}
				<motion.div
					variants={fadeIn}
					initial="hidden"
					animate="visible"
					custom={3}
				>
					<Button onClick={onContinue} className="w-full">
						Continue
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</motion.div>
			</div>
		</div>
	);
}
