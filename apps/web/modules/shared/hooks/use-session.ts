"use client";

import { authClient } from "@onecontext/auth/client";

export function useSession() {
	return authClient.useSession();
}
