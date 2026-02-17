"use client";

import { Button } from "@ui/components/button";
import { cn } from "@ui/lib/utils";

const SOURCE_OPTIONS = ["All", "Manual", "Twitter", "GitHub"] as const;

interface MemoryFiltersProps {
	selectedSource: string;
	onSourceChange: (source: string) => void;
	categories: string[];
	selectedCategories: string[];
	onCategoryToggle: (category: string) => void;
}

export function MemoryFilters({
	selectedSource,
	onSourceChange,
	categories,
	selectedCategories,
	onCategoryToggle,
}: MemoryFiltersProps) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<div className="flex flex-wrap items-center gap-1">
				{SOURCE_OPTIONS.map((source) => (
					<Button
						key={source}
						variant={selectedSource === source ? "default" : "outline"}
						size="sm"
						onClick={() => onSourceChange(source)}
						className="h-7 text-xs"
					>
						{source}
					</Button>
				))}
			</div>
			{categories.length > 0 && (
				<>
					<div className="h-4 w-px bg-border" />
					<div className="flex flex-wrap items-center gap-1">
						{categories.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => onCategoryToggle(cat)}
								className={cn(
									"rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
									selectedCategories.includes(cat)
										? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
										: "bg-muted text-muted-foreground hover:bg-muted/80",
								)}
							>
								{cat}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
}
