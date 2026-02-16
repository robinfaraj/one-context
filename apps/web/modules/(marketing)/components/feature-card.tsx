"use client";

import { fadeUp } from "@ui/lib/animations";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
	icon: LucideIcon;
	title: string;
	description: string;
}

export function FeatureCard({
	icon: Icon,
	title,
	description,
}: FeatureCardProps) {
	return (
		<motion.div variants={fadeUp} custom={0} className="bg-card p-8">
			<Icon className="h-5 w-5 text-primary" />
			<h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
			<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
				{description}
			</p>
		</motion.div>
	);
}
