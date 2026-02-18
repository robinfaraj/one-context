"use client";

import { McpSetupGuide } from "@shared/components/api/mcp-setup-guide";
import { Button } from "@ui/components/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface OnboardingStepIntegrateProps {
	onFinish: () => void;
	isSubmitting: boolean;
}

const fadeIn = {
	hidden: { opacity: 0, y: 12 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.12, duration: 0.4, ease: "easeOut" },
	}),
};

export function OnboardingStepIntegrate({
	onFinish,
	isSubmitting,
}: OnboardingStepIntegrateProps) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
			<div className="w-full max-w-lg space-y-6">
				{/* Header */}
				<motion.div
					className="space-y-2 text-center"
					variants={fadeIn}
					initial="hidden"
					animate="visible"
					custom={0}
				>
					<h2 className="text-2xl font-semibold tracking-tight">
						Connect to your AI tools
					</h2>
					<p className="text-sm text-muted-foreground">
						Add OneContext to any MCP-compatible client.
					</p>
				</motion.div>

				{/* Reuse the MCP setup guide */}
				<motion.div
					variants={fadeIn}
					initial="hidden"
					animate="visible"
					custom={1}
				>
					<McpSetupGuide />
				</motion.div>

				{/* Actions */}
				<motion.div
					className="flex flex-col gap-3"
					variants={fadeIn}
					initial="hidden"
					animate="visible"
					custom={2}
				>
					<Button onClick={onFinish} disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							"Setting up…"
						) : (
							<>
								Go to Dashboard
								<ArrowRight className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
					<button
						type="button"
						onClick={onFinish}
						disabled={isSubmitting}
						className="text-xs text-muted-foreground/70 underline-offset-4 hover:underline"
					>
						Skip, I'll set this up later
					</button>
				</motion.div>
			</div>
		</div>
	);
}
