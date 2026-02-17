"use client";

import { getBaseUrl } from "@onecontext/utils";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@ui/components/accordion";
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

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	function handleCopy() {
		navigator.clipboard.writeText(text);
		setCopied(true);
		toast.success("Copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			className="absolute right-2 top-2 h-7 px-2 text-muted-foreground hover:text-foreground"
			onClick={handleCopy}
		>
			{copied ? (
				<Check className="mr-1 h-3 w-3" />
			) : (
				<Copy className="mr-1 h-3 w-3" />
			)}
			{copied ? "Copied" : "Copy"}
		</Button>
	);
}

function CodeBlock({
	children,
	copyText,
}: { children: string; copyText?: string }) {
	return (
		<div className="relative">
			<pre className="overflow-x-auto rounded-lg bg-muted p-4 pr-20 font-mono text-xs leading-relaxed">
				{children}
			</pre>
			<CopyButton text={copyText ?? children} />
		</div>
	);
}

function Step({
	number,
	children,
}: { number: number; children: React.ReactNode }) {
	return (
		<div className="flex gap-3">
			<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-700/10 text-[11px] font-medium text-emerald-700">
				{number}
			</span>
			<div className="text-sm text-muted-foreground pt-px">{children}</div>
		</div>
	);
}

export function McpSetupGuide() {
	const siteUrl = getBaseUrl();

	const claudeWebCommand = `${siteUrl}/api/mcp`;
	const claudeDesktopConfig = `{
  "mcpServers": {
    "onecontext": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${siteUrl}/api/mcp"]
    }
  }
}`;
	const claudeCodeCommand = `claude mcp add --transport http onecontext ${siteUrl}/api/mcp`;
	const stdioConfig = `{
  "mcpServers": {
    "onecontext": {
      "command": "npx",
      "args": ["@onecontext/mcp-server", "--api-key", "YOUR_API_KEY"]
    }
  }
}`;
	const cursorConfig = `{
  "mcpServers": {
    "onecontext": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${siteUrl}/api/mcp"]
    }
  }
}`;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Terminal className="h-5 w-5" />
					Setup Instructions
				</CardTitle>
				<CardDescription>
					Connect your OneContext profile to any MCP client. Your memories and
					sources become available as tools.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="claude">
						<AccordionTrigger className="hover:no-underline">
							Claude
						</AccordionTrigger>
						<AccordionContent className="space-y-4">
							<div>
								<p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
									Team, Enterprise (Claude.ai)
								</p>
								<div className="space-y-2.5">
									<Step number={1}>
										Navigate to{" "}
										<span className="font-medium text-foreground">
											Settings
										</span>{" "}
										in the sidebar
									</Step>
									<Step number={2}>
										Scroll to{" "}
										<span className="font-medium text-foreground">
											Integrations
										</span>{" "}
										and click{" "}
										<span className="font-medium text-foreground">
											Add more
										</span>
									</Step>
									<Step number={3}>
										<span>In the prompt, enter:</span>
										<div className="mt-2 space-y-1.5 pl-0">
											<div className="text-xs">
												<span className="text-muted-foreground">
													Integration name:{" "}
												</span>
												<code className="font-mono text-foreground">
													OneContext
												</code>
											</div>
											<div className="text-xs">
												<span className="text-muted-foreground">
													Integration URL:{" "}
												</span>
												<code className="font-mono text-foreground">
													{claudeWebCommand}
												</code>
											</div>
										</div>
									</Step>
									<Step number={4}>
										Make sure to enable the tools in any new chats
									</Step>
								</div>
							</div>

							<div className="border-t pt-4">
								<p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
									Free, Pro (Claude for Desktop)
								</p>
								<div className="space-y-2.5">
									<Step number={1}>
										Open the file{" "}
										<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
											~/Library/Application
											Support/Claude/claude_desktop_config.json
										</code>
									</Step>
									<Step number={2}>
										<span>
											Add the following and restart the Claude desktop app:
										</span>
									</Step>
								</div>
								<div className="mt-2.5">
									<CodeBlock>{claudeDesktopConfig}</CodeBlock>
								</div>
							</div>

							<div className="border-t pt-4">
								<p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
									Claude Code
								</p>
								<div className="space-y-2.5">
									<CodeBlock>{claudeCodeCommand}</CodeBlock>
									<p className="text-sm text-muted-foreground">
										Then run{" "}
										<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
											/mcp
										</code>{" "}
										once you've opened a session to go through the
										authentication flow.
									</p>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="cursor">
						<AccordionTrigger className="hover:no-underline">
							Cursor
						</AccordionTrigger>
						<AccordionContent className="space-y-2.5">
							<Step number={1}>
								Open{" "}
								<span className="font-medium text-foreground">
									Cursor Settings
								</span>{" "}
								and navigate to{" "}
								<span className="font-medium text-foreground">MCP</span>
							</Step>
							<Step number={2}>
								Click{" "}
								<span className="font-medium text-foreground">
									Add new global MCP server
								</span>
							</Step>
							<Step number={3}>
								<span>Paste the following configuration:</span>
							</Step>
							<CodeBlock>{cursorConfig}</CodeBlock>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="windsurf">
						<AccordionTrigger className="hover:no-underline">
							Windsurf
						</AccordionTrigger>
						<AccordionContent className="space-y-2.5">
							<Step number={1}>
								Open{" "}
								<span className="font-medium text-foreground">
									Windsurf Settings
								</span>{" "}
								and navigate to{" "}
								<span className="font-medium text-foreground">
									Cascade &gt; MCP
								</span>
							</Step>
							<Step number={2}>
								Click{" "}
								<span className="font-medium text-foreground">Add Server</span>{" "}
								and paste the following configuration:
							</Step>
							<CodeBlock>{cursorConfig}</CodeBlock>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="api-key">
						<AccordionTrigger className="hover:no-underline">
							API Key (any client)
						</AccordionTrigger>
						<AccordionContent className="space-y-2.5">
							<p className="text-sm text-muted-foreground">
								For CI/headless environments or clients that don't support
								OAuth, use an API key with the stdio transport. Replace{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
									YOUR_API_KEY
								</code>{" "}
								with a key from above:
							</p>
							<CodeBlock>{stdioConfig}</CodeBlock>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<div className="mt-6 rounded-lg border p-3">
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
