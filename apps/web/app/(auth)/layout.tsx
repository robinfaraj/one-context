"use client";

import { authClient } from "@onecontext/auth/client";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!isPending && session) {
			router.replace("/dashboard");
		}
	}, [session, isPending, router]);

	if (isPending) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
			</div>
		);
	}

	if (session) return null;

	return (
		<div className="flex min-h-svh items-center justify-center bg-background p-4">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="font-instrument-serif text-3xl">OneContext</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Your AI identity, everywhere
					</p>
				</div>
				{children}
			</div>
		</div>
	);
}
