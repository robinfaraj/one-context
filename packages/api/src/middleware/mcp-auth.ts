import { auth } from "@onecontext/auth";
import { config } from "@onecontext/config";
import { db } from "@onecontext/database/server";
import { createMiddleware } from "hono/factory";

type AuthSession = typeof auth.$Infer.Session;

async function authenticateWithApiKey(
	token: string,
): Promise<{ userId: string; sessionId: string } | null> {
	const result = await auth.api.verifyApiKey({ body: { key: token } });
	if (!result.valid || !result.key) return null;

	return {
		userId: result.key.userId,
		sessionId: result.key.id,
	};
}

/**
 * Verify an OAuth 2.1 access token by looking it up directly in the database.
 *
 * Better Auth does not expose a public `verifyOAuthAccessToken` API.
 * Its own `/oauth2/userinfo` endpoint performs the same `findUnique` lookup
 * internally, so this is consistent with the library's approach.
 */
async function authenticateWithOAuth(
	token: string,
): Promise<{ userId: string; sessionId: string } | null> {
	const accessToken = await db.oauthAccessToken.findUnique({
		where: { accessToken: token },
		include: { oauthapplication: { select: { disabled: true } } },
	});
	if (!accessToken) return null;
	if (
		accessToken.accessTokenExpiresAt &&
		accessToken.accessTokenExpiresAt < new Date()
	)
		return null;
	if (!accessToken.userId) return null;
	if (accessToken.oauthapplication?.disabled) return null;

	return {
		userId: accessToken.userId,
		sessionId: accessToken.id,
	};
}

export const mcpAuthMiddleware = createMiddleware<{
	Variables: {
		session: AuthSession["session"];
		user: AuthSession["user"];
	};
}>(async (c, next) => {
	const forwarded = c.req.header("x-forwarded-host") || c.req.header("host");
	const proto = c.req.header("x-forwarded-proto") || "https";
	const origin = forwarded
		? `${proto}://${forwarded}`
		: new URL(c.req.url).origin;
	const resourceMetadataUrl = `${origin}/.well-known/oauth-protected-resource`;

	const authHeader = c.req.header("Authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		return c.json({ error: "Missing authorization" }, 401, {
			"WWW-Authenticate": `Bearer realm="onecontext-mcp", resource_metadata="${resourceMetadataUrl}"`,
		});
	}

	const token = authHeader.slice(7);
	const isApiKey = token.startsWith(config.api.apiKeyPrefix);

	const authResult = isApiKey
		? await authenticateWithApiKey(token)
		: await authenticateWithOAuth(token);

	if (!authResult) {
		return c.json({ error: "Invalid token" }, 401, {
			"WWW-Authenticate": `Bearer realm="onecontext-mcp", resource_metadata="${resourceMetadataUrl}"`,
		});
	}

	const user = await db.user.findUnique({
		where: { id: authResult.userId },
	});
	if (!user) {
		return c.json({ error: "User not found" }, 401);
	}

	c.set("session", {
		id: authResult.sessionId,
		userId: user.id,
		token: "mcp-token",
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		createdAt: new Date(),
		updatedAt: new Date(),
		ipAddress: null,
		userAgent: c.req.header("User-Agent") ?? "mcp-client",
		impersonatedBy: null,
	} as AuthSession["session"]);
	c.set("user", user as AuthSession["user"]);

	await next();
});
