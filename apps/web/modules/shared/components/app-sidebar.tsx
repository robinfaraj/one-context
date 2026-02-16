"use client";

import { UserMenu } from "@shared/components/user-menu";
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
} from "@ui/components/sidebar";
import {
	Brain,
	Code,
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

interface AppSidebarProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

export function AppSidebar({ user }: AppSidebarProps) {
	const pathname = usePathname();

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/dashboard">
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
										<Link href={item.href}>
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
				<UserMenu user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
