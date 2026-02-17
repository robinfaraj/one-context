"use client";

import { authClient } from "@onecontext/auth/client";
import { config } from "@onecontext/config";
import { fadeUp, stagger } from "@ui/lib/animations";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "./button";
import { TerminalWindow } from "./terminal-window";

export function Hero() {
	const { data: session } = authClient.useSession();
	const ctaHref = session ? "/dashboard" : "/signup";
	const ctaLabel = session ? "Go to Dashboard" : "Get Started Free";

	return (
		<section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
			{/* Grid background */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					opacity: "var(--grid-opacity)",
					backgroundImage:
						"linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
				}}
			/>
			{/* Gradient glows — two offset blobs for an abstract, asymmetric feel */}
			<div
				className="pointer-events-none absolute -top-24 -left-20 h-[600px] w-[700px] rotate-12 rounded-full opacity-[0.12] blur-[100px]"
				style={{
					background:
						"radial-gradient(ellipse at 60% 40%, var(--primary) 0%, transparent 70%)",
				}}
			/>
			<div
				className="pointer-events-none absolute top-16 -right-16 h-[500px] w-[600px] -rotate-6 rounded-full opacity-[0.08] blur-[100px]"
				style={{
					background:
						"radial-gradient(ellipse at 40% 50%, var(--primary) 0%, transparent 70%)",
				}}
			/>

			<div className="container relative">
				<motion.div
					initial="hidden"
					animate="visible"
					variants={stagger}
					className="mx-auto max-w-3xl text-center"
				>
					<motion.div variants={fadeUp} custom={0}>
						<span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3.5 py-1.5 text-xs font-medium text-primary">
							<span className="h-1.5 w-1.5 rounded-full bg-primary" />
							Open source & free
						</span>
					</motion.div>

					<motion.h1
						variants={fadeUp}
						custom={1}
						className="mt-8 font-display text-5xl leading-[1.1] tracking-tight md:text-7xl"
					>
						Stop repeating yourself to{" "}
						<span className="text-primary">every AI tool</span>
					</motion.h1>

					<motion.p
						variants={fadeUp}
						custom={2}
						className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl"
					>
						Set up your AI identity once. Auto-sync from X, GitHub, Notion. Use
						everywhere via MCP or API.
					</motion.p>

					<motion.div
						variants={fadeUp}
						custom={3}
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
							View on GitHub
						</Button>
					</motion.div>

					{/* Terminal preview */}
					<motion.div
						variants={fadeUp}
						custom={4}
						className="mx-auto mt-16 max-w-xl"
					>
						<TerminalWindow>
							<p className="text-[var(--terminal-text-dim)]">
								<span className="text-[var(--terminal-success)]">$</span> npx
								@onecontext/mcp-server init
							</p>
							<p className="mt-2 text-[var(--terminal-text)]">
								<span className="text-[var(--terminal-success)]">✓</span>{" "}
								Connected to OneContext
							</p>
							<p className="text-[var(--terminal-text)]">
								<span className="text-[var(--terminal-success)]">✓</span>{" "}
								Profile synced (3 integrations)
							</p>
							<p className="text-[var(--terminal-text)]">
								<span className="text-[var(--terminal-success)]">✓</span> MCP
								server running on localhost:3100
							</p>
							<p className="mt-2 text-[var(--terminal-text-muted)]">
								Ready. Your AI identity is now available to any MCP client.
							</p>
						</TerminalWindow>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
