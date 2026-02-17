"use client";

import { AppSidebar } from "@shared/components/app-sidebar";
import { authClient } from "@shared/lib/api";
import { Separator } from "@ui/components/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@ui/components/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!isPending && !session) {
			router.push("/login");
		}
		if (session && !session.user.onboardingComplete) {
			router.push("/onboarding");
		}
	}, [session, isPending, router]);

	if (isPending) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		);
	}

	if (!session) return null;

	return (
		<SidebarProvider className="h-svh">
			<AppSidebar user={session.user} />
			<SidebarInset className="overflow-y-auto">
				<header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
					</div>
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
