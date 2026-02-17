"use client";

import { NearLimitBanner } from "@shared/components/billing/near-limit-banner";
import { MemoryFilters } from "@shared/components/memories/memory-filters";
import { MemoryList } from "@shared/components/memories/memory-list";
import { MemorySearch } from "@shared/components/memories/memory-search";
import { useSubscription } from "@shared/lib/billing-api";
import { useCallback, useMemo, useState } from "react";
import {
	useMemories,
	useSearchMemories,
} from "../../../modules/shared/lib/memories-api";

export default function MemoriesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedSource, setSelectedSource] = useState("All");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const { data: sub } = useSubscription();
	const { data: allMemories, isLoading, isError, refetch } = useMemories();
	const { data: searchResults, isLoading: isSearching } =
		useSearchMemories(searchQuery);

	const isSearchMode = searchQuery.length > 0;
	const baseMemories = isSearchMode ? searchResults : allMemories;

	const categories = useMemo(() => {
		if (!allMemories) return [];
		const set = new Set<string>();
		for (const m of allMemories) {
			for (const c of m.categories ?? []) set.add(c);
		}
		return Array.from(set).sort();
	}, [allMemories]);

	const filtered = useMemo(() => {
		if (!baseMemories) return undefined;
		return baseMemories.filter((m) => {
			if (
				selectedSource !== "All" &&
				(m.metadata?.source ?? "chat").toLowerCase() !==
					selectedSource.toLowerCase()
			)
				return false;
			if (
				selectedCategories.length > 0 &&
				!selectedCategories.some((c) => m.categories?.includes(c))
			)
				return false;
			return true;
		});
	}, [baseMemories, selectedSource, selectedCategories]);

	const handleSearch = useCallback((q: string) => setSearchQuery(q), []);

	const handleCategoryToggle = useCallback((cat: string) => {
		setSelectedCategories((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
		);
	}, []);

	const count = filtered?.length ?? 0;

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden">
			<title>Memories | OneContext</title>
			{sub && sub.limits.memories !== "unlimited" && (
				<NearLimitBanner
					current={sub.usage.memories}
					limit={sub.limits.memories as number}
					resource="memories"
				/>
			)}
			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-semibold tracking-tight">Memories</h1>
				{!isLoading && (
					<span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
						{count}
						{sub && sub.limits.memories !== "unlimited"
							? `/${sub.limits.memories}`
							: ""}
					</span>
				)}
			</div>

			<MemorySearch onSearch={handleSearch} />

			<MemoryFilters
				selectedSource={selectedSource}
				onSourceChange={setSelectedSource}
				categories={categories}
				selectedCategories={selectedCategories}
				onCategoryToggle={handleCategoryToggle}
			/>

			<MemoryList
				memories={filtered}
				isLoading={isLoading || isSearching}
				isError={isError}
				onRetry={() => refetch()}
			/>
		</div>
	);
}
