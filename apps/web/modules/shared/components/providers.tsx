"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { type PropsWithChildren, useState } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: PropsWithChildren) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
				{children}
				<Toaster />
			</ThemeProvider>
		</QueryClientProvider>
	);
}
