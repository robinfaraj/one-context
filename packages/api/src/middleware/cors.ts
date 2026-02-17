import { getBaseUrl } from "@onecontext/utils";
import { cors } from "hono/cors";

export const corsMiddleware = cors({
	origin: (requestOrigin) => {
		// Debug logging for CORS (only in non-production)
		if (process.env.NODE_ENV !== "production") {
			console.log("[CORS Debug]", {
				requestOrigin,
				vercelEnv: process.env.VERCEL_ENV,
				vercelUrl: process.env.VERCEL_URL,
				vercelBranchUrl: process.env.VERCEL_BRANCH_URL,
				baseUrl: getBaseUrl(),
			});
		}

		// Always allow server-to-server requests (no Origin header)
		if (!requestOrigin) {
			return getBaseUrl();
		}

		const baseUrl = getBaseUrl();

		// Allow the primary site origin
		if (requestOrigin === baseUrl) {
			return requestOrigin;
		}

		// Strict pattern matching for Vercel preview deployments
		// Only allow: onecontext-[branch/hash]-robinsadeghpours-projects.vercel.app
		const VERCEL_PREVIEW_PATTERN =
			/^onecontext-.+-robinsadeghpours-projects\.vercel\.app$/i;

		try {
			const { hostname } = new URL(requestOrigin);
			if (VERCEL_PREVIEW_PATTERN.test(hostname)) {
				return requestOrigin;
			}
		} catch {
			// ignore malformed URLs
		}

		return "";
	},
	allowHeaders: ["Content-Type", "Authorization"],
	allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
	exposeHeaders: ["Content-Length", "Transfer-Encoding"],
	maxAge: 600,
	credentials: true,
});
