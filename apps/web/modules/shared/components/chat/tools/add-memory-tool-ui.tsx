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
		<div className="mb-4 rounded-lg border border-primary/20 bg-accent/50 dark:border-primary/50 dark:bg-accent/20 px-3 py-2">
			<div className="flex items-center gap-2 text-sm">
				<Check className="h-4 w-4 text-primary dark:text-primary" />
				<span className="font-medium text-primary dark:text-primary">
					Memory stored
				</span>
			</div>
			<p className="mt-1.5 text-xs text-primary/80 dark:text-primary/80 line-clamp-2 pl-6">
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
