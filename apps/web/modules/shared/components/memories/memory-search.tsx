"use client";

import { Input } from "@ui/components/input";
import { cn } from "@ui/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MemorySearchProps {
	onSearch: (query: string) => void;
	className?: string;
}

export function MemorySearch({ onSearch, className }: MemorySearchProps) {
	const [value, setValue] = useState("");
	const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

	useEffect(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => onSearch(value.trim()), 300);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [value, onSearch]);

	return (
		<div className={cn("relative", className)}>
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				placeholder="Search memories..."
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="pl-9 pr-9"
			/>
			{value && (
				<button
					type="button"
					onClick={() => setValue("")}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
