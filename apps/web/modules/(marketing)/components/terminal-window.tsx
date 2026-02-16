"use client";

interface TerminalWindowProps {
	title?: string;
	children: React.ReactNode;
}

export function TerminalWindow({
	title = "terminal",
	children,
}: TerminalWindowProps) {
	return (
		<div className="overflow-hidden rounded-xl border border-border bg-[var(--terminal-bg)] shadow-2xl">
			<div className="flex items-center gap-2 border-b border-[var(--terminal-border)] px-4 py-3">
				<div className="h-3 w-3 rounded-full bg-[var(--terminal-dot)]" />
				<div className="h-3 w-3 rounded-full bg-[var(--terminal-dot)]" />
				<div className="h-3 w-3 rounded-full bg-[var(--terminal-dot)]" />
				<span className="ml-2 text-xs text-[var(--terminal-text-muted)]">
					{title}
				</span>
			</div>
			<div className="p-5 font-mono text-[13px] leading-relaxed">
				{children}
			</div>
		</div>
	);
}
