"use client";

import { authClient } from "@shared/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@ui/components/sidebar";
import { LogOut, Settings } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserMenuProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

export function UserMenu({ user }: UserMenuProps) {
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut();
		router.push("/");
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={user.image ?? undefined}
									alt={user.name ?? "User"}
								/>
								<AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
									{user.name?.charAt(0)?.toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{user.name || "User"}
								</span>
								<span className="truncate text-xs text-muted-foreground">
									{user.email}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side="top"
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuItem asChild>
							<Link href="/settings">
								<Settings className="mr-2 size-4" />
								Settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut className="mr-2 size-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
