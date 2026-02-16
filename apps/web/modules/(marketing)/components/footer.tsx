"use client";

import { config } from "@onecontext/config";
import { Github } from "lucide-react";
import { Logo } from "./logo";

function DiscordIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			role="img"
			aria-label="Discord"
		>
			<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
		</svg>
	);
}

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
	{
		href: config.links.discord,
		label: "Discord",
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
	{
		href: config.links.discord,
		icon: DiscordIcon,
		label: "Discord",
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
