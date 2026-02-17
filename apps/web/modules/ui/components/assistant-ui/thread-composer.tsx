"use client";

import { AuiIf, ComposerPrimitive } from "@assistant-ui/react";
import { TooltipIconButton } from "@ui/components/assistant-ui/tooltip-icon-button";
import { Button } from "@ui/components/button";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import type { FC } from "react";

export const Composer: FC = () => {
	return (
		<ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
			<ComposerPrimitive.Input
				placeholder="Send a message..."
				className="aui-composer-input min-h-14 w-full resize-none rounded-2xl border border-input bg-background px-4 pt-4 pb-12 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
				rows={1}
				autoFocus
				aria-label="Message input"
			/>
			<ComposerAction />
		</ComposerPrimitive.Root>
	);
};

const ComposerAction: FC = () => {
	return (
		<div className="aui-composer-action-wrapper absolute right-3 bottom-3 flex items-center gap-1">
			<AuiIf condition={({ thread }) => !thread.isRunning}>
				<ComposerPrimitive.Send asChild>
					<TooltipIconButton
						tooltip="Send message"
						side="top"
						type="submit"
						variant="default"
						size="icon"
						className="aui-composer-send size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
						aria-label="Send message"
					>
						<ArrowUpIcon className="aui-composer-send-icon size-4" />
					</TooltipIconButton>
				</ComposerPrimitive.Send>
			</AuiIf>

			<AuiIf condition={({ thread }) => thread.isRunning}>
				<ComposerPrimitive.Cancel asChild>
					<Button
						type="button"
						variant="default"
						size="icon"
						className="aui-composer-cancel size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
						aria-label="Stop generating"
					>
						<SquareIcon className="aui-composer-cancel-icon size-3 fill-current" />
					</Button>
				</ComposerPrimitive.Cancel>
			</AuiIf>
		</div>
	);
};
