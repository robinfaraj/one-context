"use client";

import { fadeUp } from "@ui/lib/animations";
import { motion } from "framer-motion";

interface SectionHeaderProps {
	eyebrow: string;
	title: string;
	description?: string;
	align?: "left" | "center";
}

export function SectionHeader({
	eyebrow,
	title,
	description,
	align = "center",
}: SectionHeaderProps) {
	const alignClass = align === "center" ? "text-center" : "";
	const containerClass = align === "center" ? "mx-auto max-w-3xl" : "";

	return (
		<div className={containerClass}>
			<motion.p
				variants={fadeUp}
				custom={0}
				className={`text-sm font-medium uppercase tracking-widest text-muted-foreground ${alignClass}`}
			>
				{eyebrow}
			</motion.p>
			<motion.h2
				variants={fadeUp}
				custom={1}
				className={`mt-4 font-display text-3xl tracking-tight md:text-5xl ${alignClass}`}
			>
				{title}
			</motion.h2>
			{description && (
				<motion.p
					variants={fadeUp}
					custom={2}
					className={`mt-4 text-lg text-muted-foreground ${alignClass}`}
				>
					{description}
				</motion.p>
			)}
		</div>
	);
}
