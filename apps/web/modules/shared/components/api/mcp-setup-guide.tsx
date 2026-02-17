"use client";

import { Button } from "@ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MCP_CONFIG = `{
  "mcpServers": {
    "onecontext": {
      "command": "npx",
      "args": ["@onecontext/mcp-server", "--api-key", "YOUR_API_KEY"]
    }
  }
}`;

export function McpSetupGuide() {
	const [copied, setCopied] = useState(false);

	function handleCopy() {
		navigator.clipboard.writeText(MCP_CONFIG);
		setCopied(true);
		toast.success("Copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Terminal className="h-5 w-5" />
					MCP Server Setup
				</CardTitle>
				<CardDescription>
					Connect your OneContext profile to Claude Desktop, Cursor, or any MCP
					client. Your memories and sources become available as tools.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<p className="mb-2 text-sm text-muted-foreground">
						Add this to your MCP client configuration, replacing{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							YOUR_API_KEY
						</code>{" "}
						with a key from above:
					</p>
					<div className="relative">
						<pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
							{MCP_CONFIG}
						</pre>
						<Button
							variant="outline"
							size="sm"
							className="absolute right-2 top-2"
							onClick={handleCopy}
						>
							{copied ? (
								<Check className="mr-1.5 h-3.5 w-3.5" />
							) : (
								<Copy className="mr-1.5 h-3.5 w-3.5" />
							)}
							{copied ? "Copied" : "Copy"}
						</Button>
					</div>
				</div>
				<div className="rounded-lg border p-3">
					<p className="text-sm font-medium">Available MCP tools</p>
					<ul className="mt-1.5 space-y-1 text-sm text-muted-foreground">
						<li>
							<code className="font-mono text-xs">get_profile</code> — Your
							name, email, and bio
						</li>
						<li>
							<code className="font-mono text-xs">search_memories</code> —
							Semantic search across your memories
						</li>
						<li>
							<code className="font-mono text-xs">add_memory</code> — Store a
							new memory
						</li>
						<li>
							<code className="font-mono text-xs">get_memories</code> — List all
							memories
						</li>
						<li>
							<code className="font-mono text-xs">list_sources</code> —
							Connected data sources
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
