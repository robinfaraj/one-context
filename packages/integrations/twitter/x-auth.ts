import { db } from "@onecontext/database/server";
import { logger } from "@onecontext/logs";
import { OAuth2 } from "@xdevplatform/xdk";

interface RefreshTokenResponse {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
}

/**
 * Get a valid (non-expired) X access token for a user.
 * Automatically refreshes the token if expired.
 */
export async function getValidXAccessToken(userId: string): Promise<string> {
	const account = await db.account.findFirst({
		where: { userId, providerId: "twitter" },
	});

	if (!account) {
		throw new Error("Twitter account not found. Please connect via OAuth.");
	}

	if (!account.accessToken) {
		throw new Error("Twitter access token missing. Please reconnect.");
	}

	// Check if token has expired
	const now = new Date();
	const isExpired =
		account.accessTokenExpiresAt && now >= account.accessTokenExpiresAt;

	if (!isExpired) {
		return account.accessToken;
	}

	// Token expired — try to refresh
	if (!account.refreshToken) {
		throw new Error(
			"Access token expired and no refresh token available. Please re-authenticate with Twitter.",
		);
	}

	try {
		logger.info("[X_AUTH] Access token expired, refreshing...");
		return await refreshTwitterToken(account.id, account.refreshToken);
	} catch (error) {
		logger.error("[X_AUTH] Failed to refresh token:", error);
		throw new Error(
			"Access token expired and refresh failed. Please re-authenticate with Twitter.",
		);
	}
}

async function refreshTwitterToken(
	accountId: string,
	refreshToken: string,
): Promise<string> {
	const refreshed = await refreshAccessToken(refreshToken);

	const now = new Date();
	const expiresAt = new Date(now.getTime() + refreshed.expires_in * 1000);

	await db.account.update({
		where: { id: accountId },
		data: {
			accessToken: refreshed.access_token,
			refreshToken: refreshed.refresh_token,
			accessTokenExpiresAt: expiresAt,
		},
	});

	logger.info("[X_AUTH] Token refreshed successfully");
	return refreshed.access_token;
}

async function refreshAccessToken(
	refreshToken: string,
): Promise<RefreshTokenResponse> {
	const oauth2 = new OAuth2({
		clientId: process.env.TWITTER_CLIENT_ID as string,
		clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
		redirectUri: "",
	});

	const token = await oauth2.refreshToken(refreshToken);

	return {
		access_token: token.access_token,
		refresh_token: token.refresh_token ?? refreshToken,
		expires_in: token.expires_in,
		token_type: token.token_type,
		scope: token.scope ?? "",
	};
}
