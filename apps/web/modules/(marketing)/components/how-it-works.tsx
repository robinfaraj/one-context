"use client";

import { stagger } from "@ui/lib/animations";
import { motion } from "framer-motion";
import { Link2, RefreshCw, Zap } from "lucide-react";
import { SectionHeader } from "./section-header";
import { StepCard } from "./step-card";

const steps = [
	{
		number: "01",
		title: "Connect your accounts",
		description:
			"Link X, GitHub, and Notion via secure OAuth. Takes 30 seconds.",
		icon: Link2,
	},
	{
		number: "02",
		title: "We sync daily, automatically",
		description:
			"Your profile updates from connected accounts. Ship a feature, tweet an update—your AI identity stays current.",
		icon: RefreshCw,
	},
	{
		number: "03",
		title: "Use anywhere via CLI, MCP, or API",
		description:
			"Manage from the terminal with npx octx. Plug into Claude, OpenClaw, Cursor—any AI tool.",
		icon: Zap,
	},
];

export function HowItWorks() {
	return (
		<section
			id="how-it-works"
			className="border-t border-border bg-muted/50 py-24 md:py-32"
		>
			<div className="container">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={stagger}
					className="mx-auto max-w-3xl text-center"
				>
					<SectionHeader
						eyebrow="How it works"
						title="Three steps. Done forever."
					/>
				</motion.div>

				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={stagger}
					className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-3"
				>
					{steps.map((step) => (
						<StepCard
							key={step.number}
							number={step.number}
							icon={step.icon}
							title={step.title}
							description={step.description}
						/>
					))}
				</motion.div>
			</div>
		</section>
	);
}
