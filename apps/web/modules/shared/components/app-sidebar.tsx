"use client";

import { UserMenu } from "@shared/components/user-menu";
import { useSubscription } from "@shared/lib/billing-api";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@ui/components/sidebar";
import {
	Brain,
	Code,
	CreditCard,
	LayoutDashboard,
	MessageSquare,
	Plug,
	Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OneContextLogo } from "../../(marketing)/components/logo";

const navItems = [
	{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ title: "Chat", href: "/chat", icon: MessageSquare },
	{ title: "Sources", href: "/sources", icon: Plug },
	{ title: "Memories", href: "/memories", icon: Brain },
	{ title: "API & MCP", href: "/api-keys", icon: Code },
	{ title: "Settings", href: "/settings", icon: Settings },
];

function PlanBadge() {
	const { data: sub } = useSubscription();
	if (!sub) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton asChild>
					<Link href="/settings/billing">
						<CreditCard className="h-4 w-4" />
						<span className="flex items-center gap-2">
							<span
								className={`rounded-full px-2 py-0.5 text-xs font-medium ${sub.isPro ? "bg-emerald-700/10 text-emerald-700" : "bg-muted text-muted-foreground"}`}
							>
								{sub.isPro ? "Pro" : "Free"}
							</span>
							{!sub.isPro && (
								<span className="text-xs text-emerald-700">Upgrade</span>
							)}
						</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

interface AppSidebarProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

export function AppSidebar({ user }: AppSidebarProps) {
	const pathname = usePathname();
	const { setOpenMobile } = useSidebar();

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/dashboard" onClick={() => setOpenMobile(false)}>
								<OneContextLogo className="!h-4 !w-auto !shrink-0 text-primary" />
								<span className="truncate font-semibold">OneContext</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={pathname.startsWith(item.href)}
									>
										<Link href={item.href} onClick={() => setOpenMobile(false)}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<PlanBadge />
				<UserMenu user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
