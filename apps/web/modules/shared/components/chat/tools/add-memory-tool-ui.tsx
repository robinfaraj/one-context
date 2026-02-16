"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { Brain, Check } from "lucide-react";

interface AddMemoryArgs {
	content: string;
	metadata?: Record<string, unknown>;
}

interface AddMemoryResult {
	id: string;
	memory: string;
}

function AddMemoryLoading({ content }: { content?: string }) {
	return (
		<div className="mb-4 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
			<div className="flex items-center gap-2 text-sm">
				<Brain className="h-4 w-4 animate-pulse text-muted-foreground" />
				<span className="text-muted-foreground">Adding memory...</span>
			</div>
			{content && (
				<p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 pl-6">
					{content}
				</p>
			)}
		</div>
	);
}

function AddMemorySuccess({ memory }: { memory: string }) {
	return (
		<div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/20 px-3 py-2">
			<div className="flex items-center gap-2 text-sm">
				<Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
				<span className="font-medium text-emerald-800 dark:text-emerald-300">
					Memory stored
				</span>
			</div>
			<p className="mt-1.5 text-xs text-emerald-700/80 dark:text-emerald-400/80 line-clamp-2 pl-6">
				{memory}
			</p>
		</div>
	);
}

export const AddMemoryToolUI = makeAssistantToolUI<
	AddMemoryArgs,
	AddMemoryResult
>({
	toolName: "addMemory",
	render: ({ args, result, status }) => {
		if (status?.type === "running") {
			return <AddMemoryLoading content={args.content} />;
		}
		if (result) {
			return <AddMemorySuccess memory={result.memory} />;
		}
		return null;
	},
});
