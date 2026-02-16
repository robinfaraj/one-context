"use client";

import { authClient } from "@onecontext/auth/client";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { cn } from "@ui/lib/utils";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { OnboardingStepProfile } from "./onboarding-step-profile";
import { OnboardingStepSources } from "./onboarding-step-sources";

interface OnboardingWizardProps {
	user: { name?: string | null; email: string };
}

function OnboardingStepReady() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center gap-2">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700/10">
					<Sparkles className="h-6 w-6 text-emerald-700" />
				</div>
				<h2 className="text-xl font-semibold">You're all set!</h2>
				<p className="text-sm text-muted-foreground">
					Your AI identity is ready
				</p>
			</div>

			<p className="text-center text-sm text-muted-foreground">
				Start chatting with your AI assistant to add knowledge, or connect more
				sources from your dashboard.
			</p>

			<div className="rounded-lg bg-muted p-4">
				<p className="mb-2 text-xs font-medium text-muted-foreground">
					MCP Configuration
				</p>
				<pre className="overflow-x-auto text-xs">
					<code>
						{JSON.stringify(
							{
								mcpServers: {
									onecontext: {
										command: "npx",
										args: ["-y", "@onecontext/mcp-server"],
										env: { ONECONTEXT_API_KEY: "octx_..." },
									},
								},
							},
							null,
							2,
						)}
					</code>
				</pre>
			</div>
		</div>
	);
}

const STEPS = ["Profile", "Sources", "Ready"] as const;

export function OnboardingWizard({ user }: OnboardingWizardProps) {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFinish = async () => {
		setIsSubmitting(true);
		try {
			await authClient.updateUser({ onboardingComplete: true });
			router.push("/dashboard");
		} catch {
			toast.error("Something went wrong");
			setIsSubmitting(false);
		}
	};

	const isLastStep = currentStep === STEPS.length - 1;

	return (
		<Card className="w-full max-w-lg">
			<CardContent className="p-6">
				{/* Step indicator */}
				<div className="mb-8 flex items-center justify-center gap-2">
					{STEPS.map((label, i) => (
						<div key={label} className="flex items-center gap-2">
							<div
								className={cn(
									"h-2 w-2 rounded-full transition-colors",
									i <= currentStep
										? "bg-emerald-700"
										: "bg-muted-foreground/25",
								)}
							/>
						</div>
					))}
				</div>

				{/* Step content */}
				<div className="min-h-[320px]">
					{currentStep === 0 && <OnboardingStepProfile user={user} />}
					{currentStep === 1 && <OnboardingStepSources />}
					{currentStep === 2 && <OnboardingStepReady />}
				</div>

				{/* Navigation */}
				<div className="mt-8 flex items-center justify-between">
					<Button
						variant="ghost"
						onClick={() => setCurrentStep((s) => s - 1)}
						disabled={currentStep === 0}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>

					{currentStep === 1 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setCurrentStep(2)}
							className="text-muted-foreground"
						>
							Skip for now
						</Button>
					)}

					{isLastStep ? (
						<Button
							onClick={handleFinish}
							disabled={isSubmitting}
							className="bg-emerald-700 hover:bg-emerald-800"
						>
							{isSubmitting ? (
								<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
							) : (
								<Check className="mr-2 h-4 w-4" />
							)}
							Go to Dashboard
						</Button>
					) : (
						<Button
							onClick={() => setCurrentStep((s) => s + 1)}
							className="bg-emerald-700 hover:bg-emerald-800"
						>
							Next
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
