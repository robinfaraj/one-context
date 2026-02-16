"use client";

import { config } from "@onecontext/config";
import { Github } from "lucide-react";
import { Logo } from "./logo";

function XIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			role="img"
			aria-label="X"
		>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

const footerLinks = [
	{ href: "/docs", label: "Docs" },
	{
		href: config.links.github,
		label: "GitHub",
		external: true,
	},
	{
		href: config.links.twitter,
		label: "X",
		external: true,
	},
	{ href: "/privacy", label: "Privacy" },
];

const socialLinks = [
	{
		href: config.links.github,
		icon: Github,
		label: "GitHub",
	},
	{
		href: config.links.twitter,
		icon: XIcon,
		label: "X",
	},
];

export function Footer() {
	return (
		<footer className="border-t border-border py-12">
			<div className="container">
				<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
					<Logo size="sm" />

					<div className="flex items-center gap-6 text-sm text-muted-foreground">
						{footerLinks.map((link) => (
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
						{socialLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
								aria-label={link.label}
							>
								<link.icon className="h-4 w-4" />
							</a>
						))}
					</div>
				</div>
				<div className="mt-8 text-center text-xs text-muted-foreground">
					Built by developers, for developers.
				</div>
			</div>
		</footer>
	);
}
