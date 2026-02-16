"use client";

import { config } from "@onecontext/config";
import { Github } from "lucide-react";
import { Logo } from "./logo";

const navLinks = [
	{ href: "#how-it-works", label: "How it works" },
	{ href: "#features", label: "Features" },
	{ href: config.links.github, label: "GitHub", external: true },
	{ href: "/docs", label: "Docs" },
];

export function Navbar() {
	return (
		<nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
			<div className="container flex h-16 items-center justify-between">
				<Logo />
				<div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							{...(link.external && {
								target: "_blank",
								rel: "noopener noreferrer",
							})}
							className="transition-colors hover:text-foreground"
						>
							{link.label}
						</a>
					))}
				</div>
				<div className="flex items-center gap-3">
					<a
						href={config.links.github}
						target="_blank"
						rel="noopener noreferrer"
						className="hidden rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
						aria-label="GitHub"
					>
						<Github className="h-5 w-5" />
					</a>
					<a
						href="/login"
						className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Get Early Access
					</a>
				</div>
			</div>
		</nav>
	);
}
