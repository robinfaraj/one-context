"use client";

import { OnboardingWizard } from "@shared/components/onboarding/onboarding-wizard";
import { authClient } from "@shared/lib/api";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function OnboardingContent() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!isPending && !session) {
			router.push("/login");
		}
		if (!isPending && session?.user?.onboardingComplete) {
			router.push("/dashboard");
		}
	}, [session, isPending, router]);

	if (isPending) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		);
	}

	if (!session) return null;

	return (
		<>
			<title>Get Started | OneContext</title>
			<OnboardingWizard />
		</>
	);
}

export default function OnboardingPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-svh items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
				</div>
			}
		>
			<OnboardingContent />
		</Suspense>
	);
}
