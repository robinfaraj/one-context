"use client";

import { authClient } from "@onecontext/auth/client";
import { useConnectSource, useSources } from "@shared/lib/sources-api";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { Check, Github, Loader2, Twitter } from "lucide-react";
import { useEffect, useRef } from "react";

export function OnboardingStepSources() {
	const { data } = useSources();
	const connectSource = useConnectSource();
	const connectingRef = useRef<Set<string>>(new Set());

	// Auto-connect any providers that completed OAuth but don't have a Source record yet
	useEffect(() => {
		if (!data?.pendingConnections?.length) return;

		for (const provider of data.pendingConnections) {
			if (connectingRef.current.has(provider)) continue;
			connectingRef.current.add(provider);
			connectSource.mutate(provider);
		}
	}, [data?.pendingConnections]);

	const handleConnect = (provider: "github" | "twitter") => {
		authClient.signIn.social({ provider, callbackURL: "/onboarding?step=1" });
	};

	const isConnected = (provider: string) =>
		data?.connectedSources.some((s) => s.provider === provider) ?? false;

	const isPending = (provider: string) =>
		data?.pendingConnections?.includes(provider) ?? false;

	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center gap-2">
				<h2 className="text-xl font-semibold">Connect your first source</h2>
				<p className="text-sm text-muted-foreground">
					Link your accounts to start building your AI identity
				</p>
			</div>

			<div className="space-y-3">
				<Card>
					<CardContent className="flex items-center justify-between p-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
								<Github className="h-5 w-5" />
							</div>
							<div>
								<p className="font-medium">GitHub</p>
								<p className="text-xs text-muted-foreground">
									Import repos, bio, and contributions
								</p>
							</div>
						</div>
						{isConnected("github") ? (
							<Button variant="outline" size="sm" disabled>
								<Check className="mr-1 h-4 w-4 text-primary" />
								Connected
							</Button>
						) : isPending("github") ? (
							<Button variant="outline" size="sm" disabled>
								<Loader2 className="mr-1 h-4 w-4 animate-spin" />
								Connecting…
							</Button>
						) : (
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleConnect("github")}
							>
								Connect
							</Button>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center justify-between p-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
								<Twitter className="h-5 w-5" />
							</div>
							<div>
								<p className="font-medium">X (Twitter)</p>
								<p className="text-xs text-muted-foreground">
									Import tweets and interactions
								</p>
							</div>
						</div>
						{isConnected("twitter") ? (
							<Button variant="outline" size="sm" disabled>
								<Check className="mr-1 h-4 w-4 text-primary" />
								Connected
							</Button>
						) : isPending("twitter") ? (
							<Button variant="outline" size="sm" disabled>
								<Loader2 className="mr-1 h-4 w-4 animate-spin" />
								Connecting…
							</Button>
						) : (
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleConnect("twitter")}
							>
								Connect
							</Button>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
