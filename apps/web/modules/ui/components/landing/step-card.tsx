"use client";

import { fadeUp } from "@ui/lib/animations";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StepCardProps {
	number: string;
	icon: LucideIcon;
	title: string;
	description: string;
}

export function StepCard({
	number,
	icon: Icon,
	title,
	description,
}: StepCardProps) {
	return (
		<motion.div
			variants={fadeUp}
			custom={0}
			className="relative rounded-xl border border-border bg-card p-8"
		>
			<span className="font-mono text-xs text-primary">{number}</span>
			<div className="mt-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
				<Icon className="h-6 w-6 text-primary" />
			</div>
			<h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
			<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
				{description}
			</p>
		</motion.div>
	);
}
