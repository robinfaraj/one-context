"use client";

import { ManualEntrySection } from "@shared/components/sources/manual-entry-section";
import { SourceGrid } from "@shared/components/sources/source-grid";
import { useSubscription } from "@shared/lib/billing-api";
import { useConnectSource, useSources } from "@shared/lib/sources-api";
import { Button } from "@ui/components/button";
import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

export default function SourcesPage() {
	const { data, isLoading, isError, refetch } = useSources();
	const { data: sub } = useSubscription();
	const connectSource = useConnectSource();
	const connectingRef = useRef<Set<string>>(new Set());

	// Auto-connect any providers that have OAuth accounts but no Source record
	useEffect(() => {
		if (!data?.pendingConnections?.length) return;

		for (const provider of data.pendingConnections) {
			if (connectingRef.current.has(provider)) continue;
			connectingRef.current.add(provider);
			connectSource.mutate(provider);
		}
	}, [data?.pendingConnections]);

	const connectedCount = data?.connectedSources.length ?? 0;
	const integrationCount =
		data?.connectedSources.filter((s) =>
			data.integrations.some((i) => i.provider === s.provider && i.available),
		).length ?? 0;
	const atSourceLimit =
		sub && sub.limits.sources !== "unlimited"
			? integrationCount >= (sub.limits.sources as number)
			: false;

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center py-16 gap-3">
				<AlertTriangle className="h-8 w-8 text-muted-foreground" />
				<p className="text-sm text-muted-foreground">Failed to load sources</p>
				<Button variant="outline" size="sm" onClick={() => refetch()}>
					Try again
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-6 p-4 pt-0">
			<title>Sources | OneContext</title>
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Sources</h1>
				{connectedCount > 0 && (
					<p className="text-sm text-muted-foreground">
						{connectedCount} connected source{connectedCount !== 1 ? "s" : ""}
					</p>
				)}
			</div>

			<SourceGrid
				integrations={data?.integrations ?? []}
				connectedSources={data?.connectedSources ?? []}
				disconnectedProviders={data?.disconnectedProviders ?? []}
				isLoading={isLoading}
				atSourceLimit={atSourceLimit}
			/>

			<ManualEntrySection />
		</div>
	);
}
