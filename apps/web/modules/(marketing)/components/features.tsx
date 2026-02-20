"use client";

import { stagger } from "@ui/lib/animations";
import { motion } from "framer-motion";
import { Code2, Globe, Key, RefreshCw, Shield, Terminal } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { SectionHeader } from "./section-header";

const features = [
	{
		icon: RefreshCw,
		title: "Auto-sync",
		description:
			"Your profile updates daily from connected accounts. No manual work.",
	},
	{
		icon: Globe,
		title: "Works everywhere",
		description: "MCP for Claude & OpenClaw. REST API for everything else.",
	},
	{
		icon: Code2,
		title: "Open source",
		description:
			"Inspect the code. Self-host if you want. Your data, your control.",
	},
	{
		icon: Shield,
		title: "Privacy-first",
		description: "Encrypted tokens. Row-level security. Delete anytime.",
	},
	{
		icon: Key,
		title: "API keys",
		description:
			"Generate keys from the dashboard. Integrate in minutes, not hours.",
	},
	{
		icon: Terminal,
		title: "Developer-first",
		description:
			"npx octx to manage from the terminal. MCP and REST API for everything else.",
	},
];

export function Features() {
	return (
		<section id="features" className="border-t border-border py-24 md:py-32">
			<div className="container">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={stagger}
					className="mx-auto max-w-3xl text-center"
				>
					<SectionHeader
						eyebrow="Features"
						title="Everything you need. Nothing you don't."
					/>
				</motion.div>

				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={stagger}
					className="mx-auto mt-16 grid max-w-4xl gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3"
				>
					{features.map((feature) => (
						<FeatureCard
							key={feature.title}
							icon={feature.icon}
							title={feature.title}
							description={feature.description}
						/>
					))}
				</motion.div>
			</div>
		</section>
	);
}
