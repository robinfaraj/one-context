"use client";

import { fadeUp } from "@ui/lib/animations";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface QuoteCardProps {
	icon: LucideIcon;
	text: string;
}

export function QuoteCard({ icon: Icon, text }: QuoteCardProps) {
	return (
		<motion.div
			variants={fadeUp}
			custom={0}
			className="flex items-start gap-4 rounded-xl border border-border bg-card p-6"
		>
			<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
				<Icon className="h-5 w-5 text-muted-foreground" />
			</div>
			<p className="text-[15px] leading-relaxed text-foreground/80 italic">
				"{text}"
			</p>
		</motion.div>
	);
}
