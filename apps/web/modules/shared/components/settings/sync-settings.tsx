"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useUpdateSyncSettings } from "../../lib/settings-api";

interface SyncSettingsProps {
	syncEnabled: boolean;
}

export function SyncSettings({ syncEnabled: initial }: SyncSettingsProps) {
	const [enabled, setEnabled] = useState(initial);
	const updateSync = useUpdateSyncSettings();

	function handleToggle() {
		const next = !enabled;
		setEnabled(next);
		updateSync.mutate(
			{ syncEnabled: next },
			{ onError: () => setEnabled(enabled) },
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Sync Preferences</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-start gap-3">
						<RefreshCw className="mt-0.5 h-5 w-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Automatic sync</p>
							<p className="text-sm text-muted-foreground">
								Automatically sync connected sources daily at 3 AM UTC
							</p>
						</div>
					</div>
					<button
						type="button"
						role="switch"
						aria-checked={enabled}
						onClick={handleToggle}
						disabled={updateSync.isPending}
						className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${enabled ? "bg-primary" : "bg-input"}`}
					>
						{updateSync.isPending ? (
							<Loader2 className="absolute left-1 h-4 w-4 animate-spin text-white" />
						) : (
							<span
								className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`}
							/>
						)}
					</button>
				</div>
			</CardContent>
		</Card>
	);
}
