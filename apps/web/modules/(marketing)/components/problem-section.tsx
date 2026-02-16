"use client";

import { stagger } from "@ui/lib/animations";
import { motion } from "framer-motion";
import { Code2, RefreshCw, Terminal } from "lucide-react";
import { QuoteCard } from "./quote-card";
import { SectionHeader } from "./section-header";

const quotes = [
	{
		text: "I set up my context in ChatGPT. Then Claude. Then OpenClaw. Then Cursor. Now they're all out of date.",
		icon: RefreshCw,
	},
	{
		text: "I shipped a new feature yesterday—none of my AI tools know.",
		icon: Code2,
	},
	{
		text: "Copy-pasting my bio feels like 2009. Aren't we past this?",
		icon: Terminal,
	},
];

export function ProblemSection() {
	return (
		<section className="border-t border-border py-24 md:py-32">
			<div className="container">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={stagger}
					className="mx-auto max-w-3xl"
				>
					<SectionHeader
						eyebrow="The problem"
						title="Your context is scattered and stale"
						description="Every AI tool asks the same questions. You answer them, forget to update them, and your AI experiences get worse over time."
					/>
				</motion.div>

				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={stagger}
					className="mx-auto mt-16 grid max-w-3xl gap-4"
				>
					{quotes.map((quote) => (
						<QuoteCard key={quote.text} icon={quote.icon} text={quote.text} />
					))}
				</motion.div>
			</div>
		</section>
	);
}
