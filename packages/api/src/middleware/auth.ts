import { auth } from "@onecontext/auth";
import { findUserByEmail, findUserById } from "@onecontext/database/queries";
import { createMiddleware } from "hono/factory";

// Infer the correct session type from the auth instance
type AuthSession = typeof auth.$Infer.Session;

/**
 * Dev-only: Authenticate via bearer token for CLI testing.
 * Returns mock session data if valid, null otherwise.
 */
async function getDevApiKeySession(token: string): Promise<{
	session: AuthSession["session"];
	user: AuthSession["user"];
} | null> {
	// Only allow in development
	if (process.env.NODE_ENV === "production") {
		return null;
	}

	const devApiKey = process.env.DEV_API_KEY;
	const devUserEmail = process.env.DEV_API_USER_EMAIL;

	if (!devApiKey || !devUserEmail || token !== devApiKey) {
		return null;
	}

	// Fetch the test user
	const user = await findUserByEmail(devUserEmail);

	if (!user) {
		console.warn(`[Dev Auth] User not found: ${devUserEmail}`);
		return null;
	}

	// Create mock session
	const mockSession: AuthSession["session"] = {
		id: "dev-session",
		userId: user.id,
		token: "dev-token",
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		createdAt: new Date(),
		updatedAt: new Date(),
		ipAddress: null,
		userAgent: "hono-cli",
		impersonatedBy: null,
	};

	return {
		session: mockSession,
		user: user as AuthSession["user"],
	};
}

export const authMiddleware = createMiddleware<{
	Variables: {
		session: AuthSession["session"];
		user: AuthSession["user"];
	};
}>(async (c, next) => {
	// Check for dev API key authentication (bearer token)
	const authHeader = c.req.header("Authorization");
	if (authHeader?.startsWith("Bearer ")) {
		const devSession = await getDevApiKeySession(authHeader.slice(7));
		if (devSession) {
			c.set("session", devSession.session);
			c.set("user", devSession.user);
			return next();
		}
	}

	// Check for BetterAuth API key (x-api-key header or Authorization: Bearer)
	const apiKey =
		c.req.header("x-api-key") ??
		(authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);
	if (apiKey) {
		try {
			const result = await auth.api.verifyApiKey({ body: { key: apiKey } });
			if (result.valid && result.key) {
				const user = await findUserById(result.key.userId);
				if (user) {
					const mockSession: AuthSession["session"] = {
						id: result.key.id,
						userId: user.id,
						token: "api-key-session",
						expiresAt:
							result.key.expiresAt ??
							new Date(Date.now() + 24 * 60 * 60 * 1000),
						createdAt: new Date(),
						updatedAt: new Date(),
						ipAddress: null,
						userAgent: c.req.header("User-Agent") ?? null,
						impersonatedBy: null,
					};
					c.set("session", mockSession);
					c.set("user", user as AuthSession["user"]);
					return next();
				}
			}
		} catch (err) {
			console.warn(
				"[Auth] API key validation failed:",
				err instanceof Error ? err.message : String(err),
			);
		}
	}

	// Fall back to cookie-based auth
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	c.set("session", session.session);
	c.set("user", session.user);

	await next();
});
