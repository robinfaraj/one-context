"use client";

import { Button } from "@ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
import { ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ClientInfo {
	clientId: string;
	name: string;
	icon: string | null;
}

const SCOPE_LABELS: Record<string, { label: string; description: string }> = {
	openid: {
		label: "Identity",
		description: "Verify your identity",
	},
	profile: {
		label: "Profile",
		description: "Access your name and avatar",
	},
	email: {
		label: "Email",
		description: "Access your email address",
	},
	offline_access: {
		label: "Offline access",
		description: "Stay connected when you're not using the app",
	},
};

export function OAuthConsentForm() {
	const searchParams = useSearchParams();
	const consentCode = searchParams.get("consent_code");
	const clientId = searchParams.get("client_id");
	const scope = searchParams.get("scope");
	const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const scopes = scope?.split(" ") ?? ["openid"];

	useEffect(() => {
		async function fetchClient() {
			if (!clientId) {
				setLoading(false);
				return;
			}
			try {
				const response = await fetch(`/api/auth/oauth2/client/${clientId}`, {
					credentials: "include",
				});
				if (response.ok) {
					const data = await response.json();
					setClientInfo(data);
				}
			} catch (err) {
				console.warn("Failed to fetch client info", err);
			} finally {
				setLoading(false);
			}
		}
		fetchClient();
	}, [clientId]);

	const handleConsent = async (accept: boolean) => {
		setSubmitting(true);
		setError(null);
		try {
			const response = await fetch("/api/auth/oauth2/consent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					accept,
					consent_code: consentCode,
				}),
			});

			const data = await response.json();

			if (data.redirectURI) {
				window.location.href = data.redirectURI;
			} else if (data.error) {
				setError(data.error_description || "Consent failed");
			}
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center gap-4 py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		);
	}

	const appName = clientInfo?.name ?? "An application";

	return (
		<Card>
			<CardHeader className="text-center">
				<div className="flex justify-center mb-3">
					{clientInfo?.icon ? (
						<img
							src={clientInfo.icon}
							alt={clientInfo.name}
							className="size-12 rounded-lg"
						/>
					) : (
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<ShieldCheck className="size-6 text-primary" />
						</div>
					)}
				</div>
				<CardTitle>Authorize {appName}</CardTitle>
				<CardDescription>
					{appName} wants to access your OneContext account
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="rounded-lg border p-4">
					<p className="mb-3 font-medium text-sm">
						This will allow {appName} to:
					</p>
					<ul className="flex flex-col gap-2">
						{scopes.map((s) => {
							const info = SCOPE_LABELS[s];
							if (!info) return null;
							return (
								<li key={s} className="flex items-start gap-2 text-sm">
									<ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
									<span className="text-muted-foreground">
										{info.description}
									</span>
								</li>
							);
						})}
					</ul>
				</div>

				{error && (
					<p className="text-center text-destructive text-sm">{error}</p>
				)}

				<div className="flex gap-3">
					<Button
						variant="outline"
						className="flex-1"
						onClick={() => handleConsent(false)}
						disabled={submitting}
					>
						Deny
					</Button>
					<Button
						className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
						onClick={() => handleConsent(true)}
						disabled={submitting}
					>
						{submitting ? "Authorizing..." : "Authorize"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
