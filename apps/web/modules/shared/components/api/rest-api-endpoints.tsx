"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
import { BookOpen, Globe } from "lucide-react";

const ENDPOINTS = [
	{ method: "GET", path: "/api/memories", description: "List all memories" },
	{
		method: "GET",
		path: "/api/memories/search?q=...",
		description: "Semantic search memories",
	},
	{
		method: "GET",
		path: "/api/sources",
		description: "List connected sources",
	},
	{
		method: "POST",
		path: "/api/ai/chat",
		description: "Chat with your AI profile",
	},
	{
		method: "GET",
		path: "/api/dashboard",
		description: "Dashboard summary stats",
	},
];

const METHOD_COLORS: Record<string, string> = {
	GET: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
	POST: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

export function RestApiEndpoints() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Globe className="h-5 w-5" />
					REST API
				</CardTitle>
				<CardDescription>
					Use your API key as a Bearer token to access these endpoints.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="divide-y rounded-lg border">
					{ENDPOINTS.map((ep) => (
						<div key={ep.path} className="flex items-center gap-3 px-4 py-2.5">
							<span
								className={`inline-flex w-14 shrink-0 items-center justify-center rounded px-1.5 py-0.5 font-mono text-xs font-semibold ${METHOD_COLORS[ep.method] ?? ""}`}
							>
								{ep.method}
							</span>
							<code className="min-w-0 truncate font-mono text-sm">
								{ep.path}
							</code>
							<span className="ml-auto shrink-0 text-xs text-muted-foreground">
								{ep.description}
							</span>
						</div>
					))}
				</div>
				<a
					href="/api/docs"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:underline dark:text-emerald-400"
				>
					<BookOpen className="h-3.5 w-3.5" />
					Full API documentation
				</a>
			</CardContent>
		</Card>
	);
}
