import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import type { PropsWithChildren } from "react";
import { Providers } from "../modules/shared/components/providers";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
	title: {
		default: "OneContext — Your AI identity, everywhere",
		template: "%s | OneContext",
	},
	description:
		"Stop repeating yourself to every AI tool. Set up your AI identity once, auto-sync from X, GitHub, Notion. Use everywhere via MCP or API.",
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
