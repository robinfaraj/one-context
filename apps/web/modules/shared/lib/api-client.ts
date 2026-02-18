import type { AppRouter } from "@onecontext/api";
import { hc } from "hono/client";

const baseUrl =
	typeof window !== "undefined"
		? window.location.origin
		: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const apiClient = hc<AppRouter>(baseUrl, {
	init: { credentials: "include" },
}).api;
