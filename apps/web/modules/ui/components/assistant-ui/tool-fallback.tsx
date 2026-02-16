import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { cn } from "@ui/lib/utils";
import { CheckIcon, ChevronDown, ChevronUp, XCircleIcon } from "lucide-react";
import { useState } from "react";

export const ToolFallback: ToolCallMessagePartComponent = ({
	toolName,
	argsText,
	result,
	status,
}) => {
	const [isCollapsed, setIsCollapsed] = useState(true);

	const isCancelled =
		status?.type === "incomplete" && status.reason === "cancelled";
	const cancelledReason =
		isCancelled && status.error
			? typeof status.error === "string"
				? status.error
				: JSON.stringify(status.error)
			: null;

	if (status?.type === "running") {
		return (
			<div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm">
				<CheckIcon className="h-4 w-4 animate-pulse text-muted-foreground" />
				<span className="text-muted-foreground">
					Running tool: <span className="font-medium">{toolName}</span>
				</span>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"mb-4 overflow-hidden rounded-lg border border-border/50 bg-muted/20",
				isCancelled && "opacity-70",
			)}
		>
			<button
				type="button"
				onClick={() => setIsCollapsed(!isCollapsed)}
				className="flex w-full items-center gap-2 border-b border-border/50 bg-muted/30 px-3 py-1.5 transition-colors hover:bg-muted/40"
			>
				{isCancelled ? (
					<XCircleIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
				) : (
					<CheckIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
				)}
				<span
					className={cn(
						"text-sm font-medium text-foreground",
						isCancelled && "text-muted-foreground line-through",
					)}
				>
					{isCancelled ? "Cancelled " : "Used tool: "}
					{toolName}
				</span>
				{isCollapsed ? (
					<ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
				) : (
					<ChevronUp className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
				)}
			</button>

			{!isCollapsed && (
				<div className="flex flex-col gap-2 px-3 py-2 text-sm">
					{cancelledReason && (
						<p className="text-muted-foreground">Reason: {cancelledReason}</p>
					)}
					{argsText && argsText !== "{}" && (
						<pre className="whitespace-pre-wrap text-xs text-muted-foreground">
							{argsText}
						</pre>
					)}
					{!isCancelled && result !== undefined && (
						<pre className="whitespace-pre-wrap border-t border-border/50 pt-2 text-xs text-muted-foreground">
							{typeof result === "string"
								? result
								: JSON.stringify(result, null, 2)}
						</pre>
					)}
				</div>
			)}
		</div>
	);
};
