import {
	ChatGPTIcon,
	ClaudeIcon,
	GitHubIcon,
	GoogleDriveIcon,
	LinkedInIcon,
	N8NIcon,
	NotionIcon,
	OpenclawIcon,
	TikTokIcon,
	XIcon,
	YouTubeIcon,
} from "@shared/icons/brand-icons";
import { cn } from "@ui/lib/utils";
import { OneContextLogo } from "../../(marketing)/components/logo";

export default function IntegrationsSection() {
	return (
		<section>
			<div className="bg-muted dark:bg-background py-24 md:py-32">
				<div className="mx-auto max-w-5xl px-6">
					<div className="mx-auto mb-16 max-w-lg space-y-6 text-center">
						<h2 className="text-balance text-3xl font-semibold md:text-4xl">
							Works with the tools you already use
						</h2>
						<p className="text-muted-foreground">
							Plug it into your current stack. One profile feeds every AI tool
							and automation you already run.
						</p>
					</div>
					<div className="relative mx-auto flex max-w-lg items-center justify-between">
						<div className="space-y-3">
							<IntegrationCard side="left" angle={45} lineWidth={155}>
								<NotionIcon />
							</IntegrationCard>
							<IntegrationCard side="left" angle={35} lineWidth={145}>
								<XIcon />
							</IntegrationCard>
							<IntegrationCard side="left" angle={17} lineWidth={135}>
								<LinkedInIcon />
							</IntegrationCard>
							<IntegrationCard side="left" angle={0} lineWidth={125}>
								<GitHubIcon />
							</IntegrationCard>
							<IntegrationCard side="left" angle={-17} lineWidth={135}>
								<TikTokIcon />
							</IntegrationCard>
							<IntegrationCard side="left" angle={-35} lineWidth={145}>
								<YouTubeIcon />
							</IntegrationCard>
							<IntegrationCard side="left" angle={-45} lineWidth={155}>
								<GoogleDriveIcon />
							</IntegrationCard>
						</div>

						<div className="mx-auto my-2 flex w-fit justify-center gap-2">
							<div className="relative z-20 animate-[glow-pulse_3s_ease-in-out_infinite] rounded-2xl border border-primary/30 bg-muted p-1.5">
								<IntegrationCard
									className="shadow-black-950/10 dark:bg-background size-20 border-primary/40 shadow-xl dark:border-primary/30 dark:shadow-primary/10"
									isCenter
								>
									<OneContextLogo className="text-primary" />
								</IntegrationCard>
							</div>
						</div>

						<div
							role="presentation"
							className="absolute inset-1/3 bg-[radial-gradient(var(--dots-color)_1px,transparent_1px)] opacity-50 [--dots-color:var(--primary)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
						/>

						<div className="space-y-3">
							<IntegrationCard side="right" angle={-26} lineWidth={140}>
								<OpenclawIcon />
							</IntegrationCard>
							<IntegrationCard side="right" angle={-9} lineWidth={130}>
								<ClaudeIcon />
							</IntegrationCard>
							<IntegrationCard side="right" angle={9} lineWidth={130}>
								<ChatGPTIcon />
							</IntegrationCard>
							<IntegrationCard side="right" angle={26} lineWidth={140}>
								<N8NIcon />
							</IntegrationCard>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

const IntegrationCard = ({
	children,
	className,
	side,
	angle = 0,
	lineWidth = 120,
	isCenter = false,
}: {
	children: React.ReactNode;
	className?: string;
	side?: "left" | "right";
	angle?: number;
	lineWidth?: number;
	isCenter?: boolean;
}) => {
	return (
		<div
			className={cn(
				"bg-background relative flex size-12 rounded-xl border dark:bg-transparent",
				className,
			)}
		>
			<div
				className={cn(
					"relative z-20 m-auto size-fit *:size-6",
					isCenter && "*:size-12",
				)}
			>
				{children}
			</div>
			{side && !isCenter && (
				<div
					className={cn(
						"absolute z-10 h-px",
						side === "left" &&
							"bg-linear-to-r to-muted-foreground/25 left-full top-1/2 origin-left",
						side === "right" &&
							"bg-linear-to-l to-muted-foreground/25 right-full top-1/2 origin-right",
					)}
					style={{
						width: `${lineWidth}px`,
						transform: `rotate(${angle}deg)`,
					}}
				/>
			)}
		</div>
	);
};
