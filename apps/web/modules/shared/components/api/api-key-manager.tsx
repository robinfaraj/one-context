"use client";

import {
	useApiKeys,
	useCreateApiKey,
	useDeleteApiKey,
} from "@shared/lib/api-keys-api";
import { Button } from "@ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Skeleton } from "@ui/components/skeleton";
import {
	AlertTriangle,
	Check,
	Copy,
	Key,
	Loader2,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text);
	toast.success("Copied to clipboard");
}

function formatDate(date: Date) {
	return new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function ApiKeyManager() {
	const { data: keys, isLoading, isError, refetch } = useApiKeys();
	const createKey = useCreateApiKey();
	const deleteKey = useDeleteApiKey();
	const [name, setName] = useState("");
	const [newKey, setNewKey] = useState<string | null>(null);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	async function handleCreate() {
		const keyName = name.trim() || "Untitled key";
		const result = await createKey.mutateAsync(keyName);
		setNewKey(result.key);
		setName("");
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Key className="h-5 w-5" />
					API Keys
				</CardTitle>
				<CardDescription>
					Create API keys to authenticate with the REST API or MCP server.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Create new key */}
				<div className="flex gap-2">
					<Input
						placeholder="Key name (e.g. Claude Desktop)"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleCreate();
						}}
					/>
					<Button
						onClick={handleCreate}
						disabled={createKey.isPending}
						className="shrink-0 bg-emerald-700 hover:bg-emerald-800"
					>
						{createKey.isPending ? (
							<Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
						) : (
							<Plus className="mr-1.5 h-4 w-4" />
						)}
						Create
					</Button>
				</div>

				{/* Newly created key banner */}
				{newKey && (
					<div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
						<p className="mb-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-300">
							Copy your API key now — it won't be shown again.
						</p>
						<div className="flex items-center gap-2">
							<code className="flex-1 rounded bg-white px-3 py-1.5 font-mono text-sm dark:bg-black/30">
								{newKey}
							</code>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									copyToClipboard(newKey);
									setNewKey(null);
								}}
							>
								<Copy className="mr-1.5 h-3.5 w-3.5" />
								Copy & Dismiss
							</Button>
						</div>
					</div>
				)}

				{/* Key list */}
				{isError ? (
					<div className="flex flex-col items-center justify-center py-8 gap-3">
						<AlertTriangle className="h-8 w-8 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">
							Failed to load API keys
						</p>
						<Button variant="outline" size="sm" onClick={() => refetch()}>
							Try again
						</Button>
					</div>
				) : isLoading ? (
					<div className="space-y-2">
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-12 w-full" />
					</div>
				) : keys?.length === 0 ? (
					<p className="py-4 text-center text-sm text-muted-foreground">
						No API keys yet. Create one to get started.
					</p>
				) : (
					<div className="divide-y rounded-lg border">
						{keys?.map((key) => (
							<div
								key={key.id}
								className="flex items-center justify-between gap-3 px-4 py-3"
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium">
										{key.name || "Untitled"}
									</p>
									<p className="font-mono text-xs text-muted-foreground">
										{key.prefix}
										{key.start}...
									</p>
								</div>
								<div className="flex shrink-0 items-center gap-3">
									<span className="text-xs text-muted-foreground">
										{formatDate(key.createdAt)}
									</span>
									{confirmDeleteId === key.id ? (
										<div className="flex items-center gap-1.5">
											<Button
												variant="destructive"
												size="sm"
												disabled={deleteKey.isPending}
												onClick={() => {
													deleteKey.mutate(key.id);
													setConfirmDeleteId(null);
												}}
											>
												{deleteKey.isPending ? (
													<Loader2 className="h-3.5 w-3.5 animate-spin" />
												) : (
													<Check className="h-3.5 w-3.5" />
												)}
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setConfirmDeleteId(null)}
											>
												Cancel
											</Button>
										</div>
									) : (
										<Button
											variant="ghost"
											size="sm"
											className="text-muted-foreground"
											onClick={() => setConfirmDeleteId(key.id)}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
