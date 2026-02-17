"use client";

import { authClient } from "@onecontext/auth/client";
import { config } from "@onecontext/config";
import { fadeUp, stagger } from "@ui/lib/animations";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "./button";

export function CTASection() {
	const { data: session } = authClient.useSession();
	const ctaHref = session ? "/dashboard" : "/signup";
	const ctaLabel = session ? "Go to Dashboard" : "Get Started Free";

	return (
		<section className="border-t border-border py-24 md:py-32">
			<div className="container">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={stagger}
					className="mx-auto max-w-2xl text-center"
				>
					<motion.h2
						variants={fadeUp}
						custom={0}
						className="font-display text-3xl tracking-tight md:text-5xl"
					>
						Your AI identity, <span className="text-primary">everywhere</span>
					</motion.h2>
					<motion.p
						variants={fadeUp}
						custom={1}
						className="mt-4 text-lg text-muted-foreground"
					>
						Join developers building the identity layer for AI. Set up once, use
						everywhere.
					</motion.p>
					<motion.div
						variants={fadeUp}
						custom={2}
						className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
					>
						<Button href={ctaHref} icon={<ArrowRight className="h-4 w-4" />}>
							{ctaLabel}
						</Button>
						<Button
							href={config.links.github}
							variant="secondary"
							icon={<Github className="h-4 w-4" />}
							iconPosition="left"
							external
						>
							Star on GitHub
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
