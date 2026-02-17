"use client";

import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface NearLimitBannerProps {
	current: number;
	limit: number;
	resource: string;
}

export function NearLimitBanner({
	current,
	limit,
	resource,
}: NearLimitBannerProps) {
	const [dismissed, setDismissed] = useState(false);
	const percentage = (current / limit) * 100;

	if (dismissed || percentage < 80) return null;

	const isAtLimit = current >= limit;

	return (
		<div
			className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
				isAtLimit
					? "border-destructive/20 bg-destructive/5 dark:border-destructive/30 dark:bg-destructive/10"
					: "border-warning/20 bg-warning/5 dark:border-warning/30 dark:bg-warning/10"
			}`}
		>
			<div className="flex items-center gap-2">
				<AlertTriangle
					className={`h-4 w-4 ${isAtLimit ? "text-destructive" : "text-warning"}`}
				/>
				<p
					className={`text-sm ${isAtLimit ? "text-destructive" : "text-warning"}`}
				>
					{isAtLimit
						? `You've reached the ${resource} limit (${current}/${limit}).`
						: `You're approaching the ${resource} limit (${current}/${limit}).`}{" "}
					<Link
						href="/settings/billing"
						className="font-medium underline underline-offset-2"
					>
						Upgrade to Pro
					</Link>
				</p>
			</div>
			<button
				type="button"
				onClick={() => setDismissed(true)}
				className="shrink-0 text-muted-foreground hover:text-foreground"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}
