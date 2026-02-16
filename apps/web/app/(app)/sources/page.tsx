"use client";

import { ManualEntrySection } from "@shared/components/sources/manual-entry-section";
import { SourceGrid } from "@shared/components/sources/source-grid";
import { useSources } from "@shared/lib/sources-api";

export default function SourcesPage() {
	const { data, isLoading } = useSources();

	const connectedCount = data?.connectedSources.length ?? 0;

	return (
		<div className="flex flex-1 flex-col gap-6 p-4 pt-0">
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
				isLoading={isLoading}
			/>

			<ManualEntrySection />
		</div>
	);
}
