import type { Config } from "./types";

export type { Config } from "./types";

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
};
