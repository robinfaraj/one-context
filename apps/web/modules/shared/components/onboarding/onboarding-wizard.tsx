"use client";

import { authClient } from "@shared/lib/api";
import { cn } from "@ui/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { OnboardingStepIdentity } from "./onboarding-step-identity";
import { OnboardingStepImport } from "./onboarding-step-import";
import { OnboardingStepIntegrate } from "./onboarding-step-integrate";
import { OnboardingStepSources } from "./onboarding-step-sources";

const STEPS = ["Sources", "Import", "Identity", "Integrate"] as const;

export function OnboardingWizard() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialStep = Number(searchParams.get("step")) || 0;
	const [currentStep, setCurrentStep] = useState(initialStep);
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

	const goToStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<div className="flex min-h-svh flex-col bg-background">
			{/* Step indicator */}
			<div className="flex items-center justify-center gap-2 pt-8 pb-4">
				{STEPS.map((label, i) => (
					<div key={label} className="flex items-center gap-2">
						{i > 0 && (
							<div
								className={cn(
									"h-px w-6 transition-colors",
									i <= currentStep ? "bg-primary" : "bg-border",
								)}
							/>
						)}
						<div
							className={cn(
								"h-2 w-2 rounded-full transition-colors",
								i <= currentStep ? "bg-primary" : "bg-muted-foreground/25",
							)}
						/>
					</div>
				))}
			</div>

			{/* Step content */}
			<div className="flex flex-1 items-center justify-center">
				{currentStep === 0 && (
					<OnboardingStepSources
						onContinue={() => goToStep(1)}
						onSkip={() => goToStep(2)}
					/>
				)}
				{currentStep === 1 && (
					<OnboardingStepImport
						onComplete={() => goToStep(2)}
						onSkip={() => goToStep(2)}
					/>
				)}
				{currentStep === 2 && (
					<OnboardingStepIdentity onContinue={() => goToStep(3)} />
				)}
				{currentStep === 3 && (
					<OnboardingStepIntegrate
						onFinish={handleFinish}
						isSubmitting={isSubmitting}
					/>
				)}
			</div>
		</div>
	);
}
