"use client";

import { useSources, useSyncSource } from "@shared/lib/sources-api";
import { cn } from "@ui/lib/utils";
import { motion } from "framer-motion";
import { Github, Loader2, Twitter } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface OnboardingStepImportProps {
	onComplete: () => void;
	onSkip: () => void;
}

const PROGRESS_DURATION = 12000;
const PROGRESS_INTERVAL = 100;

const providerIcons: Record<string, typeof Github> = {
	github: Github,
	twitter: Twitter,
};

const providerLabels: Record<string, string> = {
	github: "GitHub",
	twitter: "X (Twitter)",
};

interface StatusItem {
	label: string;
	done: boolean;
}

function getStatusItems(provider: string, progress: number): StatusItem[] {
	const items: StatusItem[] = [];

	if (progress >= 15) {
		items.push({ label: "Imported profile", done: true });
	}

	if (progress >= 40) {
		const noun = provider === "twitter" ? "posts" : "repos";
		items.push({ label: `Scanning ${noun}...`, done: true });
	}

	if (progress >= 65 && progress < 100) {
		const action =
			provider === "twitter" ? "Extracting topics..." : "Analyzing repos...";
		items.push({ label: action, done: false });
	}

	if (progress >= 100) {
		items.push({ label: "Complete", done: true });
	}

	return items;
}

export function OnboardingStepImport({
	onComplete,
	onSkip,
}: OnboardingStepImportProps) {
	const { data } = useSources();
	const syncSource = useSyncSource();
	const [progress, setProgress] = useState(0);
	const syncedRef = useRef(false);
	const completedRef = useRef(false);

	const knownProviders = new Set(Object.keys(providerIcons));
	const connectedSources = (data?.connectedSources ?? []).filter((s) =>
		knownProviders.has(s.provider),
	);

	// Trigger sync for each connected source on mount
	useEffect(() => {
		if (syncedRef.current || connectedSources.length === 0) return;
		syncedRef.current = true;

		for (const source of connectedSources) {
			syncSource.mutate(source.provider);
		}
	}, [connectedSources]);

	// Simulate progress
	useEffect(() => {
		const steps = PROGRESS_DURATION / PROGRESS_INTERVAL;
		let current = 0;

		const timer = setInterval(() => {
			current += 1;
			const pct = Math.min(100, Math.round((current / steps) * 100));
			setProgress(pct);

			if (pct >= 100) {
				clearInterval(timer);
			}
		}, PROGRESS_INTERVAL);

		return () => clearInterval(timer);
	}, []);

	// Auto-advance when complete
	const handleComplete = useCallback(() => {
		if (completedRef.current) return;
		completedRef.current = true;
		onComplete();
	}, [onComplete]);

	useEffect(() => {
		if (progress < 100) return;

		const timeout = setTimeout(handleComplete, 1000);
		return () => clearTimeout(timeout);
	}, [progress, handleComplete]);

	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
			<div className="w-full max-w-md space-y-8">
				<div className="flex flex-col items-center gap-4 text-center">
					<motion.div
						animate={{ scale: [1, 1.15, 1] }}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
						className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
					>
						<Loader2 className="h-6 w-6 animate-spin text-primary" />
					</motion.div>

					<div className="space-y-1">
						<h2 className="text-2xl font-semibold tracking-tight">
							Building your AI identity...
						</h2>
						<p className="text-sm text-muted-foreground">
							This usually takes 10–15 seconds
						</p>
					</div>
				</div>

				<div className="space-y-6">
					{connectedSources.map((source) => {
						const Icon = providerIcons[source.provider] ?? Github;
						const label = providerLabels[source.provider] ?? source.provider;
						const items = getStatusItems(source.provider, progress);

						return (
							<div key={source.provider} className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
										<Icon className="h-4 w-4" />
									</div>
									<span className="text-sm font-medium">{label}</span>
								</div>

								{/* Progress bar */}
								<div className="h-1.5 overflow-hidden rounded-full bg-muted">
									<motion.div
										className="h-full rounded-full bg-primary"
										initial={{ width: "0%" }}
										animate={{ width: `${progress}%` }}
										transition={{ duration: 0.3, ease: "easeOut" }}
									/>
								</div>

								{/* Status items */}
								<div className="space-y-1.5 pl-11">
									{items.map((item) => (
										<motion.div
											key={item.label}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
											className={cn(
												"text-xs",
												item.done
													? "text-muted-foreground"
													: "text-muted-foreground/70",
											)}
										>
											<span
												className={cn("mr-1.5", item.done && "text-primary")}
											>
												{item.done ? "✓" : "•"}
											</span>
											{item.label}
										</motion.div>
									))}
								</div>
							</div>
						);
					})}

					{connectedSources.length === 0 && (
						<div className="text-center text-sm text-muted-foreground">
							No sources connected. Simulating import...
						</div>
					)}
				</div>

				<div className="text-center">
					<button
						type="button"
						onClick={onSkip}
						className="text-xs text-muted-foreground/70 underline-offset-4 hover:underline"
					>
						Skip
					</button>
				</div>
			</div>
		</div>
	);
}
