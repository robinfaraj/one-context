import { config } from "@onecontext/config";
import { db } from "@onecontext/database/server";
import { logger } from "@onecontext/logs";
import { getBaseUrl } from "@onecontext/utils";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
	admin,
	apiKey,
	magicLink,
	oidcProvider,
	openAPI,
	username,
} from "better-auth/plugins";

const appUrl = getBaseUrl();

// Build trusted origins list - only include the base app URL
const trustedOrigins = [appUrl];

// Strict pattern matching for Vercel preview deployments
// Only allow: onecontext-[branch/hash]-robinsadeghpours-projects.vercel.app
const VERCEL_PREVIEW_PATTERN =
	/^onecontext-.+-robinsadeghpours-projects\.vercel\.app$/i;

function isAllowedVercelPreviewHost(hostname: string): boolean {
	return VERCEL_PREVIEW_PATTERN.test(hostname);
}

export const auth = betterAuth({
	baseURL: appUrl,
	trustedOrigins: async (request) => {
		const dynamic: string[] = [...trustedOrigins];

		// Allow request origin only if it matches allowed vercel preview hosts
		const origin = request?.headers?.get("origin");

		if (origin) {
			try {
				const url = new URL(origin);
				if (isAllowedVercelPreviewHost(url.hostname)) {
					dynamic.push(`${url.protocol}//${url.host}`);
				}
			} catch {
				// ignore malformed origin
			}
		}

		const finalOrigins = Array.from(new Set(dynamic));
		return finalOrigins;
	},
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
	session: {
		expiresIn: config.auth.sessionCookieMaxAge,
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["github", "twitter"],
		},
	},
	user: {
		additionalFields: {
			onboardingComplete: {
				type: "boolean",
				required: false,
			},
		},
		deleteUser: {
			enabled: true,
		},
		changeEmail: {
			enabled: true,
		},
	},
	emailAndPassword: {
		enabled: config.auth.enablePasswordLogin,
		autoSignIn: true,
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			scope: ["user:email", "read:user"],
		},
		twitter: {
			clientId: process.env.TWITTER_CLIENT_ID as string,
			clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
			scope: ["users.read", "tweet.read", "offline.access"],
		},
	},
	plugins: [
		username(),
		admin(),
		openAPI(),
		apiKey({
			defaultPrefix: config.api.apiKeyPrefix,
			enableMetadata: true,
			rateLimit: {
				enabled: true,
				timeWindow: 60000,
				maxRequests: config.api.rateLimitPerMinute,
			},
		}),
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				logger.info("Magic link requested", { email, url });
			},
		}),
		oidcProvider({
			loginPage: "/login",
			consentPage: "/auth/oauth/consent",
			allowDynamicClientRegistration: true,
			requirePKCE: true,
			scopes: ["openid", "profile", "email", "offline_access"],
			accessTokenExpiresIn: 3600,
			refreshTokenExpiresIn: 604800,
		}),
	],
	onAPIError: {
		onError(error, ctx) {
			logger.error(error, { ctx });
		},
	},
});

export type Session = typeof auth.$Infer.Session;
