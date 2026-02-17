import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Handle OAuth discovery endpoints directly.
	// Next.js cannot route dot-prefixed paths through the App Router
	// when catch-all routes exist, so we intercept them here.
	if (pathname.startsWith("/.well-known/oauth-protected-resource")) {
		return handleProtectedResource(req);
	}
	if (pathname.startsWith("/.well-known/oauth-authorization-server")) {
		return handleAuthorizationServer(req);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/.well-known/:path*"],
};

// --- OAuth discovery helpers for MCP clients (RFC 9728 / RFC 8414) ---

function getOrigin(req: NextRequest): string {
	const forwarded =
		req.headers.get("x-forwarded-host") || req.headers.get("host");
	const proto = req.headers.get("x-forwarded-proto") || "https";
	if (forwarded) {
		return `${proto}://${forwarded}`;
	}
	return req.nextUrl.origin;
}

function handleProtectedResource(req: NextRequest): NextResponse {
	const origin = getOrigin(req);
	return NextResponse.json({
		resource: `${origin}/api/mcp`,
		authorization_servers: [`${origin}/api/auth`],
		scopes_supported: ["openid", "profile", "email", "offline_access"],
		bearer_methods_supported: ["header"],
	});
}

async function handleAuthorizationServer(
	req: NextRequest,
): Promise<NextResponse> {
	const origin = getOrigin(req);

	try {
		const internalUrl = `${req.nextUrl.origin}/api/auth/.well-known/openid-configuration`;
		const response = await fetch(internalUrl, {
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			throw new Error(`OIDC fetch failed: ${response.status}`);
		}

		const oidcConfig = (await response.json()) as Record<string, unknown>;

		// Rewrite URLs from internal origin to external origin (for proxy/forwarded requests)
		const internalOrigin = req.nextUrl.origin;
		const rewritten: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(oidcConfig)) {
			if (typeof value === "string" && value.startsWith(internalOrigin)) {
				rewritten[key] = value.replace(internalOrigin, origin);
			} else {
				rewritten[key] = value;
			}
		}

		return NextResponse.json(rewritten);
	} catch {
		// Hardcoded fallback per RFC 8414
		return NextResponse.json({
			issuer: `${origin}/api/auth`,
			authorization_endpoint: `${origin}/api/auth/oauth2/authorize`,
			token_endpoint: `${origin}/api/auth/oauth2/token`,
			registration_endpoint: `${origin}/api/auth/oauth2/register`,
			userinfo_endpoint: `${origin}/api/auth/oauth2/userinfo`,
			jwks_uri: `${origin}/api/auth/jwks`,
			response_types_supported: ["code"],
			grant_types_supported: ["authorization_code", "refresh_token"],
			code_challenge_methods_supported: ["S256"],
			token_endpoint_auth_methods_supported: [
				"client_secret_basic",
				"client_secret_post",
				"none",
			],
			scopes_supported: ["openid", "profile", "email", "offline_access"],
		});
	}
}
