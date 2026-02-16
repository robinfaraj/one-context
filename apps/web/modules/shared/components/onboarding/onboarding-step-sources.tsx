"use client";

import { authClient } from "@onecontext/auth/client";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { Github, Twitter } from "lucide-react";

export function OnboardingStepSources() {
	const handleConnect = (provider: "github" | "twitter") => {
		authClient.signIn.social({ provider, callbackURL: "/onboarding" });
	};

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
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleConnect("github")}
						>
							Connect
						</Button>
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
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleConnect("twitter")}
						>
							Connect
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
