export type Config = {
	auth: {
		enableSignup: boolean;
		enableSocialLogin: boolean;
		enablePasswordLogin: boolean;
		redirectAfterSignIn: string;
		redirectAfterLogout: string;
		sessionCookieMaxAge: number;
	};
	ui: {
		enabledThemes: Array<"light" | "dark">;
		defaultTheme: "light" | "dark";
	};
	api: {
		rateLimitPerMinute: number;
		apiKeyPrefix: string;
	};
};
