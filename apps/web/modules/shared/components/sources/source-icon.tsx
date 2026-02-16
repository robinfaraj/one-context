import {
	GitHubIcon,
	LinkedInIcon,
	NotionIcon,
	XIcon,
	YouTubeIcon,
} from "@shared/icons/brand-icons";
import { cn } from "@ui/lib/utils";
import { Newspaper } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	twitter: XIcon,
	github: GitHubIcon,
	linkedin: LinkedInIcon,
	notion: NotionIcon,
	youtube: YouTubeIcon,
	substack: Newspaper,
};

interface SourceIconProps {
	icon: string;
	className?: string;
}

export function SourceIcon({ icon, className }: SourceIconProps) {
	const Icon = iconMap[icon];
	if (!Icon) return <Newspaper className={cn("h-5 w-5", className)} />;
	return <Icon className={cn("h-5 w-5", className)} />;
}
