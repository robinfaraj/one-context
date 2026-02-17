export type PlanLimits = {
	sources: number | "unlimited";
	memories: number | "unlimited";
	apiCallsPerDay: number | "unlimited";
};

export type Price = {
	type: "recurring";
	priceId: string;
	interval: "month" | "year";
	amount: number;
	currency: string;
};

export type PlanConfig = {
	name: string;
	isFree?: boolean;
	recommended?: boolean;
	limits: PlanLimits;
	prices?: Price[];
};

export type Config = {
	links: {
		github: string;
		twitter: string;
		discord: string;
	};
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
	mail: {
		from: string;
	};
	payments: {
		plans: Record<string, PlanConfig>;
	};
};
