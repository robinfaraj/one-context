"use client";

import { ThreadPrimitive } from "@assistant-ui/react";
import { Button } from "@ui/components/button";
import { BrainIcon, SearchIcon, SparklesIcon } from "lucide-react";
import type { FC } from "react";

const SUGGESTIONS = [
	{
		title: "What do you know",
		label: "about me?",
		prompt: "What do you know about me?",
		icon: BrainIcon,
	},
	{
		title: "Search the web",
		label: "for something",
		prompt: "Search the web for the latest AI news",
		icon: SearchIcon,
	},
	{
		title: "Add a memory",
		label: "about me",
		prompt: "Add a memory about my current project",
		icon: SparklesIcon,
	},
] as const;

export const ThreadWelcome: FC = () => {
	return (
		<div className="aui-thread-welcome-root mx-auto my-auto flex w-full max-w-(--thread-max-width) grow flex-col">
			<div className="aui-thread-welcome-center flex w-full grow flex-col items-center justify-center">
				<div className="aui-thread-welcome-message flex size-full flex-col justify-center px-4">
					<div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-emerald-700/10">
						<BrainIcon className="size-5 text-emerald-700 dark:text-emerald-400" />
					</div>
					<h1 className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in font-semibold text-2xl duration-200">
						What would you like to know?
					</h1>
					<p className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in text-muted-foreground text-base delay-75 duration-200">
						Ask me anything about your identity, memories, or connected sources.
					</p>
				</div>
			</div>
			<div className="aui-thread-welcome-suggestions grid w-full gap-2 pb-4 @md:grid-cols-3">
				{SUGGESTIONS.map((suggestion, index) => (
					<div
						key={suggestion.prompt}
						className="aui-thread-welcome-suggestion-display fade-in slide-in-from-bottom-2 animate-in fill-mode-both duration-200"
						style={{ animationDelay: `${100 + index * 50}ms` }}
					>
						<ThreadPrimitive.Suggestion prompt={suggestion.prompt} send asChild>
							<Button
								variant="ghost"
								className="aui-thread-welcome-suggestion h-auto w-full flex-col items-start justify-start gap-1 rounded-2xl border px-4 py-3 text-left text-sm transition-colors hover:border-emerald-700/30 hover:bg-emerald-700/5"
								aria-label={suggestion.prompt}
							>
								<suggestion.icon className="mb-1 size-4 text-emerald-700 dark:text-emerald-400" />
								<span className="aui-thread-welcome-suggestion-text-1 font-medium">
									{suggestion.title}
								</span>
								<span className="aui-thread-welcome-suggestion-text-2 text-muted-foreground">
									{suggestion.label}
								</span>
							</Button>
						</ThreadPrimitive.Suggestion>
					</div>
				))}
			</div>
		</div>
	);
};
