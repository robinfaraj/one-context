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
					? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
					: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950"
			}`}
		>
			<div className="flex items-center gap-2">
				<AlertTriangle
					className={`h-4 w-4 ${isAtLimit ? "text-red-600" : "text-amber-600"}`}
				/>
				<p
					className={`text-sm ${isAtLimit ? "text-red-800 dark:text-red-200" : "text-amber-800 dark:text-amber-200"}`}
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
