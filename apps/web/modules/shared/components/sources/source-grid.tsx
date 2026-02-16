"use client";

import type { Integration, Source } from "@shared/lib/sources-api";
import { Skeleton } from "@ui/components/skeleton";
import { AvailableSourceCard } from "./available-source-card";
import { SourceCard } from "./source-card";

interface SourceGridProps {
	integrations: Integration[];
	connectedSources: Source[];
	isLoading: boolean;
}

function SkeletonCards() {
	return (
		<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 3 }).map((_, i) => (
				<Skeleton key={`skeleton-${i}`} className="h-[120px] rounded-lg" />
			))}
		</div>
	);
}

export function SourceGrid({
	integrations,
	connectedSources,
	isLoading,
}: SourceGridProps) {
	if (isLoading) {
		return (
			<div className="space-y-8">
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Connected
					</h2>
					<SkeletonCards />
				</section>
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Available
					</h2>
					<SkeletonCards />
				</section>
			</div>
		);
	}

	const connected = integrations.filter((i) => i.connected);
	const available = integrations.filter((i) => !i.connected);

	return (
		<div className="space-y-8">
			{connected.length > 0 && (
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Connected
					</h2>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
						{connected.map((integration) => {
							const source = connectedSources.find(
								(s) => s.provider === integration.provider,
							);
							if (!source) return null;
							return (
								<SourceCard
									key={integration.provider}
									source={source}
									icon={integration.icon}
								/>
							);
						})}
					</div>
				</section>
			)}

			{available.length > 0 && (
				<section>
					<h2 className="mb-3 text-sm font-medium text-muted-foreground">
						Available
					</h2>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
						{available.map((integration) => (
							<AvailableSourceCard
								key={integration.provider}
								integration={integration}
							/>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
