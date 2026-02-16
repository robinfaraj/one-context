"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { SourceIcon } from "@shared/components/sources/source-icon";
import { ChevronDown, ChevronUp, Plug } from "lucide-react";
import { useState } from "react";

interface SourceItem {
	provider: string;
	displayName: string;
	icon: string;
	status: string;
	itemCount: number;
	lastSyncAt: string | null;
}

interface ListSourcesResult {
	sources: SourceItem[];
	totalCount: number;
}

function LoadingState() {
	return (
		<div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm">
			<Plug className="h-4 w-4 animate-pulse text-muted-foreground" />
			<span className="text-muted-foreground">Fetching sources...</span>
		</div>
	);
}

function SourceRow({ source }: { source: SourceItem }) {
	return (
		<div className="flex items-center gap-2 py-1.5 text-sm">
			<SourceIcon icon={source.icon} className="h-3.5 w-3.5 flex-shrink-0" />
			<span className="truncate text-foreground">{source.displayName}</span>
			<span className="flex-shrink-0 text-xs text-muted-foreground">
				· {source.itemCount} item{source.itemCount !== 1 ? "s" : ""}
			</span>
			<span className="ml-auto inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
		</div>
	);
}

function ListSourcesResults({ result }: { result: ListSourcesResult }) {
	const [isCollapsed, setIsCollapsed] = useState(true);

	return (
		<div className="mb-4 overflow-hidden rounded-lg border border-border/50 bg-muted/20">
			<button
				type="button"
				onClick={() => setIsCollapsed(!isCollapsed)}
				className="flex w-full items-center gap-2 border-b border-border/50 bg-muted/30 px-3 py-1.5 transition-colors hover:bg-muted/40"
			>
				<Plug className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
				<span className="text-sm font-medium text-foreground">
					Connected Sources
				</span>
				<span className="ml-auto flex-shrink-0 text-xs text-muted-foreground">
					{result.totalCount} source{result.totalCount !== 1 ? "s" : ""}
				</span>
				{isCollapsed ? (
					<ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
				) : (
					<ChevronUp className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
				)}
			</button>

			{!isCollapsed && (
				<div className="px-3 py-2">
					{result.sources.map((source) => (
						<SourceRow key={source.provider} source={source} />
					))}
				</div>
			)}
		</div>
	);
}

function ListSourcesToolUIContent({
	result,
	status,
}: {
	result?: ListSourcesResult;
	status: { type: string };
}) {
	if (status?.type === "running") {
		return <LoadingState />;
	}

	if (!result || result.sources.length === 0) {
		return null;
	}

	return <ListSourcesResults result={result} />;
}

export const ListSourcesToolUI = makeAssistantToolUI<
	Record<string, never>,
	ListSourcesResult
>({
	toolName: "listSources",
	render: ({ result, status }) => (
		<ListSourcesToolUIContent result={result} status={status} />
	),
});
