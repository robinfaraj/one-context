import type { Config } from "./types";

export type { Config, PlanLimits, Price, PlanConfig } from "./types";

if (process.env.NODE_ENV !== "test") {
	if (!process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID) {
		console.warn(
			"[Config] NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID is not set — Stripe checkout will not work",
		);
	}
	if (!process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID) {
		console.warn(
			"[Config] NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID is not set — Stripe checkout will not work",
		);
	}
}

export const config: Config = {
	links: {
		github: "https://github.com/robinfaraj/one-context",
		twitter: "https://twitter.com/onecontext",
		discord: "https://discord.gg/6uNYMBZEEh",
	},
	auth: {
		enableSignup: true,
		enableSocialLogin: true,
		enablePasswordLogin: true,
		redirectAfterSignIn: "/dashboard",
		redirectAfterLogout: "/",
		sessionCookieMaxAge: 60 * 60 * 24 * 30, // 30 days in seconds
	},
	ui: {
		enabledThemes: ["light", "dark"],
		defaultTheme: "light",
	},
	api: {
		rateLimitPerMinute: 60,
		apiKeyPrefix: "octx_",
	},
	mail: {
		from: process.env.MAIL_FROM ?? "OneContext <noreply@onecontext.dev>",
	},
	payments: {
		plans: {
			free: {
				name: "Free",
				isFree: true,
				limits: { sources: 1, memories: 25, apiCallsPerDay: 100 },
			},
			pro: {
				name: "Pro",
				recommended: true,
				limits: {
					sources: "unlimited",
					memories: "unlimited",
					apiCallsPerDay: 10000,
				},
				prices: [
					{
						type: "recurring",
						priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
						interval: "month",
						amount: 9,
						currency: "USD",
					},
					{
						type: "recurring",
						priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID ?? "",
						interval: "year",
						amount: 99,
						currency: "USD",
					},
				],
			},
		},
	},
};
