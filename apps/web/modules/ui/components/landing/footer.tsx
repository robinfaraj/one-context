"use client";

import { Github, Twitter } from "lucide-react";
import { Logo } from "./logo";

const footerLinks = [
	{ href: "/docs", label: "Docs" },
	{
		href: "https://github.com/onecontext",
		label: "GitHub",
		external: true,
	},
	{
		href: "https://twitter.com/onecontext",
		label: "Twitter",
		external: true,
	},
	{ href: "/privacy", label: "Privacy" },
];

const socialLinks = [
	{
		href: "https://github.com/onecontext",
		icon: Github,
		label: "GitHub",
	},
	{
		href: "https://twitter.com/onecontext",
		icon: Twitter,
		label: "Twitter",
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
