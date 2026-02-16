import { describe, expect, it } from "vitest";
import { app } from "../app";

const DEV_API_KEY = process.env.DEV_API_KEY;
const authHeaders: Record<string, string> = DEV_API_KEY
	? { Authorization: `Bearer ${DEV_API_KEY}` }
	: {};

describe("API Routes", () => {
	describe("Health Check", () => {
		it("should return 200 OK for /api/health", async () => {
			const res = await app.request("/api/health");
			expect(res.status).toBe(200);
			const text = await res.text();
			expect(text).toBe("OK");
		});
	});

	describe("Auth Guards - Protected Endpoints", () => {
		it("should return 401 for GET /api/ai/chats without auth", async () => {
			const res = await app.request("/api/ai/chats");
			expect(res.status).toBe(401);
			const json = await res.json();
			expect(json).toEqual({ error: "Unauthorized" });
		});

		it("should return 401 for POST /api/ai/chat without auth", async () => {
			const res = await app.request("/api/ai/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: [] }),
			});
			expect(res.status).toBe(401);
			const json = await res.json();
			expect(json).toEqual({ error: "Unauthorized" });
		});

		it("should return 401 for DELETE /api/ai/chats/:id without auth", async () => {
			const res = await app.request("/api/ai/chats/fake-id", {
				method: "DELETE",
			});
			expect(res.status).toBe(401);
			const json = await res.json();
			expect(json).toEqual({ error: "Unauthorized" });
		});

		it("should return 401 for GET /api/memories without auth", async () => {
			const res = await app.request("/api/memories");
			expect(res.status).toBe(401);
			const json = await res.json();
			expect(json).toEqual({ error: "Unauthorized" });
		});

		it("should return 401 for GET /api/memories/search without auth", async () => {
			const res = await app.request("/api/memories/search?q=test");
			expect(res.status).toBe(401);
			const json = await res.json();
			expect(json).toEqual({ error: "Unauthorized" });
		});

		it("should return 401 for GET /api/sources without auth", async () => {
			const res = await app.request("/api/sources");
			expect(res.status).toBe(401);
			const json = await res.json();
			expect(json).toEqual({ error: "Unauthorized" });
		});

		it("should return 401 for POST /api/sources/:provider/sync without auth", async () => {
			const res = await app.request("/api/sources/twitter/sync", {
				method: "POST",
			});
			expect(res.status).toBe(401);
			const json = await res.json();
			expect(json).toEqual({ error: "Unauthorized" });
		});

		it("should return 401 for DELETE /api/sources/:provider without auth", async () => {
			const res = await app.request("/api/sources/twitter", {
				method: "DELETE",
			});
			expect(res.status).toBe(401);
			const json = await res.json();
			expect(json).toEqual({ error: "Unauthorized" });
		});
	});

	describe.runIf(!!DEV_API_KEY)("Authenticated Endpoints", () => {
		describe("AI Chat", () => {
			it("GET /api/ai/chats should return empty array", async () => {
				const res = await app.request("/api/ai/chats", {
					headers: authHeaders,
				});
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(Array.isArray(json)).toBe(true);
			});

			it("GET /api/ai/chats/:id should return 404 for nonexistent chat", async () => {
				const res = await app.request("/api/ai/chats/nonexistent-id", {
					headers: authHeaders,
				});
				expect(res.status).toBe(404);
				const json = await res.json();
				expect(json).toEqual({ error: "Chat not found" });
			});

			it("DELETE /api/ai/chats/:id should return 404 for nonexistent chat", async () => {
				const res = await app.request("/api/ai/chats/nonexistent-id", {
					method: "DELETE",
					headers: authHeaders,
				});
				expect(res.status).toBe(404);
				const json = await res.json();
				expect(json).toEqual({ error: "Chat not found" });
			});
		});

		describe("Sources", () => {
			it("GET /api/sources should return integrations list", async () => {
				const res = await app.request("/api/sources", {
					headers: authHeaders,
				});
				expect(res.status).toBe(200);
				const json = (await res.json()) as {
					integrations: Array<{
						provider: string;
						connected: boolean;
					}>;
					connectedSources: unknown[];
				};
				expect(json.integrations).toBeDefined();
				expect(Array.isArray(json.integrations)).toBe(true);
				expect(json.integrations.length).toBeGreaterThan(0);
				// Verify each integration has required fields
				for (const integration of json.integrations) {
					expect(integration.provider).toBeDefined();
					expect(typeof integration.connected).toBe("boolean");
				}
				expect(json.connectedSources).toBeDefined();
				expect(Array.isArray(json.connectedSources)).toBe(true);
			});

			it("POST /api/sources/twitter/sync should return 404 for unconnected source", async () => {
				const res = await app.request("/api/sources/twitter/sync", {
					method: "POST",
					headers: authHeaders,
				});
				expect(res.status).toBe(404);
				const json = await res.json();
				expect(json).toEqual({ error: "Source not connected" });
			});

			it("DELETE /api/sources/twitter should return 404 for unconnected source", async () => {
				const res = await app.request("/api/sources/twitter", {
					method: "DELETE",
					headers: authHeaders,
				});
				expect(res.status).toBe(404);
				const json = await res.json();
				expect(json).toEqual({ error: "Source not connected" });
			});
		});

		describe("Memories", () => {
			it("GET /api/memories should return memories list", async () => {
				const res = await app.request("/api/memories", {
					headers: authHeaders,
				});
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(Array.isArray(json)).toBe(true);
			});

			it("GET /api/memories/search should return 400 without query param", async () => {
				const res = await app.request("/api/memories/search", {
					headers: authHeaders,
				});
				expect(res.status).toBe(400);
				const json = await res.json();
				expect(json).toEqual({
					error: "Query parameter 'q' is required",
				});
			});
		});
	});
});
