import { auth } from "@onecontext/auth";
import { db } from "@onecontext/database/server";
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
	const user = await db.user.findUnique({
		where: { email: devUserEmail },
	});

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
		activeOrganizationId: null,
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
