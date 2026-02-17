"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { Brain, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";

interface SearchMemoriesArgs {
	query: string;
}

interface MemorySearchResult {
	id: string;
	memory: string;
	score?: number;
	metadata?: { source?: string; [key: string]: unknown };
}

type SearchMemoriesResult = MemorySearchResult[];

function SearchingState({ query }: { query: string }) {
	return (
		<div className="mb-4 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm">
			<Search className="h-4 w-4 animate-pulse text-muted-foreground" />
			<span className="text-muted-foreground">Searching memories for:</span>
			<span className="font-medium text-foreground">"{query}"</span>
		</div>
	);
}

function MemoryResultRow({ item }: { item: MemorySearchResult }) {
	const source = (item.metadata?.source as string) ?? "manual";
	return (
		<div className="flex items-start gap-2 py-1.5 text-sm">
			<Brain className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
			<span className="text-foreground line-clamp-2">{item.memory}</span>
			<span className="ml-auto flex-shrink-0 text-xs text-muted-foreground">
				{source}
			</span>
		</div>
	);
}

function SearchResultsList({ results }: { results: MemorySearchResult[] }) {
	const [isCollapsed, setIsCollapsed] = useState(true);

	return (
		<div className="mb-4 overflow-hidden rounded-lg border border-border/50 bg-muted/20">
			<button
				type="button"
				onClick={() => setIsCollapsed(!isCollapsed)}
				className="flex w-full items-center gap-2 border-b border-border/50 bg-muted/30 px-3 py-1.5 transition-colors hover:bg-muted/40"
			>
				<Brain className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
				<span className="text-sm font-medium text-foreground">Memories</span>
				<span className="ml-auto flex-shrink-0 text-xs text-muted-foreground">
					{results.length} result{results.length !== 1 ? "s" : ""}
				</span>
				{isCollapsed ? (
					<ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
				) : (
					<ChevronUp className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
				)}
			</button>

			{!isCollapsed && (
				<div className="px-3 py-2">
					{results.map((item) => (
						<MemoryResultRow key={item.id} item={item} />
					))}
				</div>
			)}
		</div>
	);
}

export const SearchMemoriesToolUI = makeAssistantToolUI<
	SearchMemoriesArgs,
	SearchMemoriesResult
>({
	toolName: "searchMemories",
	render: ({ args, result, status }) => {
		if (status?.type === "running") {
			return <SearchingState query={args.query} />;
		}
		if (!result || result.length === 0) return null;
		return <SearchResultsList results={result} />;
	},
});
