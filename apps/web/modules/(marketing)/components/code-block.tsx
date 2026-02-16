"use client";

import { TerminalWindow } from "./terminal-window";

interface CodeBlockProps {
	filename?: string;
	code: string;
}

export function CodeBlock({ filename = "code", code }: CodeBlockProps) {
	return (
		<TerminalWindow title={filename}>
			<pre className="overflow-x-auto text-[var(--terminal-text)]">
				<code>{code}</code>
			</pre>
		</TerminalWindow>
	);
}
