"use client";

import { authClient } from "@shared/lib/api";
import { useConnectSource, useSources } from "@shared/lib/sources-api";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { cn } from "@ui/lib/utils";
import { Check, Github, Linkedin, Loader2, Twitter } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

interface OnboardingStepSourcesProps {
	onContinue: () => void;
	onSkip: () => void;
}

const sources = [
	{
		provider: "github" as const,
		label: "GitHub",
		description: "Import repos, bio, and contributions",
		icon: Github,
		comingSoon: false,
	},
	{
		provider: "twitter" as const,
		label: "X (Twitter)",
		description: "Import posts and profile data",
		icon: Twitter,
		comingSoon: false,
	},
	{
		provider: "linkedin" as const,
		label: "LinkedIn",
		description: "Import work history and connections",
		icon: Linkedin,
		comingSoon: true,
	},
];

export function OnboardingStepSources({
	onContinue,
	onSkip,
}: OnboardingStepSourcesProps) {
	const { data } = useSources();
	const connectSource = useConnectSource();
	const connectingRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (!data?.pendingConnections?.length) return;

		for (const provider of data.pendingConnections) {
			if (connectingRef.current.has(provider)) continue;
			connectingRef.current.add(provider);
			connectSource.mutate(provider);
		}
	}, [data?.pendingConnections]);

	const handleConnect = (provider: "github" | "twitter") => {
		authClient.signIn.social({ provider, callbackURL: "/onboarding?step=0" });
	};

	const isConnected = (provider: string) =>
		data?.connectedSources.some((s) => s.provider === provider) ?? false;

	const isPending = (provider: string) =>
		data?.pendingConnections?.includes(provider) ?? false;

	const connectedCount = useMemo(
		() =>
			sources.filter((s) => !s.comingSoon && isConnected(s.provider)).length,
		[data?.connectedSources],
	);

	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
			<div className="w-full max-w-md space-y-8">
				<div className="space-y-2 text-center">
					<h2 className="text-2xl font-semibold tracking-tight">
						Connect your sources
					</h2>
					<p className="text-sm text-muted-foreground">
						We'll import automatically to build your AI identity.
					</p>
				</div>

				<div className="space-y-3">
					{sources.map((source) => {
						const Icon = source.icon;
						const connected = isConnected(source.provider);
						const pending = isPending(source.provider);

						return (
							<Card
								key={source.provider}
								className={cn(
									"transition-colors",
									source.comingSoon && "opacity-50",
									connected && "border-primary/30",
								)}
							>
								<CardContent className="flex items-center justify-between px-5 py-4">
									<div className="flex items-center gap-3">
										<div
											className={cn(
												"flex h-10 w-10 items-center justify-center rounded-lg",
												connected ? "bg-primary/10 text-primary" : "bg-muted",
											)}
										>
											<Icon className="h-5 w-5" />
										</div>
										<div>
											<p className="font-medium">{source.label}</p>
											<p className="text-xs text-muted-foreground">
												{source.description}
											</p>
										</div>
									</div>

									{source.comingSoon ? (
										<span className="text-xs text-muted-foreground">
											Coming soon
										</span>
									) : connected ? (
										<Button variant="outline" size="sm" disabled>
											<Check className="mr-1 h-4 w-4 text-primary" />
											Connected
										</Button>
									) : pending ? (
										<Button variant="outline" size="sm" disabled>
											<Loader2 className="mr-1 h-4 w-4 animate-spin" />
											Connecting…
										</Button>
									) : (
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												handleConnect(source.provider as "github" | "twitter")
											}
										>
											Connect
										</Button>
									)}
								</CardContent>
							</Card>
						);
					})}
				</div>

				<div className="space-y-2 text-center">
					<p className="text-sm text-muted-foreground">
						Connected: {connectedCount} source{connectedCount !== 1 ? "s" : ""}
					</p>
					<p className="text-xs text-muted-foreground/70">
						(Free plan: 2 sources max)
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<Button
						onClick={onContinue}
						disabled={connectedCount < 1}
						className="w-full"
					>
						Continue
					</Button>
					<Button
						variant="ghost"
						onClick={onSkip}
						className="w-full text-muted-foreground"
					>
						Skip for now
					</Button>
				</div>
			</div>
		</div>
	);
}
