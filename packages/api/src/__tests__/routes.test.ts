import { db } from "@onecontext/database/server";
import { get, getAvailable, list } from "@onecontext/integrations";
import * as memory from "@onecontext/memory";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
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

	describe("Integration Registry", () => {
		it("should have twitter and github adapters registered", () => {
			const adapters = list();
			const providers = adapters.map((a) => a.provider);
			expect(providers).toContain("twitter");
			expect(providers).toContain("github");
		});

		it("should return adapter by provider name", () => {
			const twitter = get("twitter");
			expect(twitter).toBeDefined();
			expect(twitter?.provider).toBe("twitter");
			expect(twitter?.displayName).toBe("Twitter / X");

			const github = get("github");
			expect(github).toBeDefined();
			expect(github?.provider).toBe("github");
		});

		it("should return undefined for unknown provider", () => {
			expect(get("nonexistent")).toBeUndefined();
		});

		it("should list available integrations including coming-soon", () => {
			const available = getAvailable();
			expect(available.length).toBeGreaterThanOrEqual(6);

			const comingSoon = available.filter((a) => a.comingSoon);
			expect(comingSoon.length).toBeGreaterThanOrEqual(4);

			const active = available.filter((a) => a.available);
			expect(active.length).toBeGreaterThanOrEqual(2);
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
		});

		it("should return 401 for GET /api/ai/chats/:id without auth", async () => {
			const res = await app.request("/api/ai/chats/fake-id");
			expect(res.status).toBe(401);
		});

		it("should return 401 for DELETE /api/ai/chats/:id without auth", async () => {
			const res = await app.request("/api/ai/chats/fake-id", {
				method: "DELETE",
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for GET /api/memories without auth", async () => {
			const res = await app.request("/api/memories");
			expect(res.status).toBe(401);
		});

		it("should return 401 for GET /api/memories/search without auth", async () => {
			const res = await app.request("/api/memories/search?q=test");
			expect(res.status).toBe(401);
		});

		it("should return 401 for PUT /api/memories/:id without auth", async () => {
			const res = await app.request("/api/memories/fake-id", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: "test" }),
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for DELETE /api/memories/:id without auth", async () => {
			const res = await app.request("/api/memories/fake-id", {
				method: "DELETE",
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for POST /api/memories/:id/pin without auth", async () => {
			const res = await app.request("/api/memories/fake-id/pin", {
				method: "POST",
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for DELETE /api/memories/:id/pin without auth", async () => {
			const res = await app.request("/api/memories/fake-id/pin", {
				method: "DELETE",
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for GET /api/sources without auth", async () => {
			const res = await app.request("/api/sources");
			expect(res.status).toBe(401);
		});

		it("should return 401 for POST /api/sources/:provider/sync without auth", async () => {
			const res = await app.request("/api/sources/twitter/sync", {
				method: "POST",
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for DELETE /api/sources/:provider without auth", async () => {
			const res = await app.request("/api/sources/twitter", {
				method: "DELETE",
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for POST /api/sources/:provider/connect without auth", async () => {
			const res = await app.request("/api/sources/twitter/connect", {
				method: "POST",
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for GET /api/dashboard without auth", async () => {
			const res = await app.request("/api/dashboard");
			expect(res.status).toBe(401);
			const json = await res.json();
			expect(json).toEqual({ error: "Unauthorized" });
		});

		it("should return 401 for PUT /api/settings/profile without auth", async () => {
			const res = await app.request("/api/settings/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: "Test" }),
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for PUT /api/settings/sync without auth", async () => {
			const res = await app.request("/api/settings/sync", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ syncEnabled: false }),
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for GET /api/settings/export without auth", async () => {
			const res = await app.request("/api/settings/export");
			expect(res.status).toBe(401);
		});

		it("should return 401 for DELETE /api/settings/account without auth", async () => {
			const res = await app.request("/api/settings/account", {
				method: "DELETE",
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for POST /api/ai/chats without auth", async () => {
			const res = await app.request("/api/ai/chats", { method: "POST" });
			expect(res.status).toBe(401);
		});

		it("should return 401 for PATCH /api/ai/chats/:id without auth", async () => {
			const res = await app.request("/api/ai/chats/fake-id", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: "test" }),
			});
			expect(res.status).toBe(401);
		});
	});

	describe.runIf(!!DEV_API_KEY)("Authenticated — Chat CRUD Lifecycle", () => {
		const chatIdsToCleanup: string[] = [];
		let testUserId: string;

		beforeAll(async () => {
			const devUserEmail = process.env.DEV_API_USER_EMAIL ?? "";
			const user = await db.user.findUnique({
				where: { email: devUserEmail },
			});
			if (!user) throw new Error("Test user not found");
			testUserId = user.id;
		});

		afterAll(async () => {
			for (const id of chatIdsToCleanup) {
				await db.chat.delete({ where: { id } }).catch(() => {});
			}
		});

		it("should persist a chat with messages and load them back", async () => {
			// Simulate what the orchestrator does: create chat + save messages
			const chat = await db.chat.create({
				data: { userId: testUserId, title: "Persistence Test" },
			});
			chatIdsToCleanup.push(chat.id);

			await db.chatMessage.create({
				data: {
					chatId: chat.id,
					role: "user",
					parts: [{ type: "text", text: "What is OneContext?" }],
				},
			});

			await db.chatMessage.create({
				data: {
					chatId: chat.id,
					role: "assistant",
					parts: [
						{
							type: "text",
							text: "OneContext is a universal AI identity platform.",
						},
					],
				},
			});

			// Load via API — simulates page refresh / revisit
			const res = await app.request(`/api/ai/chats/${chat.id}`, {
				headers: authHeaders,
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as {
				id: string;
				title: string;
				messages: Array<{
					id: string;
					role: string;
					parts: Array<{ type: string; text: string }>;
					createdAt: string;
				}>;
			};

			expect(json.id).toBe(chat.id);
			expect(json.title).toBe("Persistence Test");
			expect(json.messages).toHaveLength(2);

			// Verify message content is fully persisted
			expect(json.messages[0].role).toBe("user");
			expect(json.messages[0].parts).toEqual([
				{ type: "text", text: "What is OneContext?" },
			]);
			expect(json.messages[1].role).toBe("assistant");
			expect(json.messages[1].parts).toEqual([
				{
					type: "text",
					text: "OneContext is a universal AI identity platform.",
				},
			]);
		});

		it("should return messages in chronological order", async () => {
			const chat = await db.chat.create({
				data: { userId: testUserId, title: "Order Test" },
			});
			chatIdsToCleanup.push(chat.id);

			// Create messages with slight delays to ensure ordering
			for (let i = 0; i < 3; i++) {
				await db.chatMessage.create({
					data: {
						chatId: chat.id,
						role: i % 2 === 0 ? "user" : "assistant",
						parts: [{ type: "text", text: `Message ${i + 1}` }],
					},
				});
			}

			const res = await app.request(`/api/ai/chats/${chat.id}`, {
				headers: authHeaders,
			});
			const json = (await res.json()) as {
				messages: Array<{
					parts: Array<{ text: string }>;
					createdAt: string;
				}>;
			};

			expect(json.messages).toHaveLength(3);
			expect(json.messages[0].parts[0].text).toBe("Message 1");
			expect(json.messages[1].parts[0].text).toBe("Message 2");
			expect(json.messages[2].parts[0].text).toBe("Message 3");

			// Verify chronological order
			for (let i = 1; i < json.messages.length; i++) {
				expect(
					new Date(json.messages[i].createdAt).getTime(),
				).toBeGreaterThanOrEqual(
					new Date(json.messages[i - 1].createdAt).getTime(),
				);
			}
		});

		it("should add messages to an existing chat and see them on reload", async () => {
			const chat = await db.chat.create({
				data: { userId: testUserId, title: "Growing Chat" },
			});
			chatIdsToCleanup.push(chat.id);

			// First message
			await db.chatMessage.create({
				data: {
					chatId: chat.id,
					role: "user",
					parts: [{ type: "text", text: "First message" }],
				},
			});

			// Verify 1 message
			const res1 = await app.request(`/api/ai/chats/${chat.id}`, {
				headers: authHeaders,
			});
			const json1 = (await res1.json()) as {
				messages: Array<{ role: string }>;
			};
			expect(json1.messages).toHaveLength(1);

			// Add two more messages (simulates continued conversation)
			await db.chatMessage.create({
				data: {
					chatId: chat.id,
					role: "assistant",
					parts: [{ type: "text", text: "Reply to first" }],
				},
			});
			await db.chatMessage.create({
				data: {
					chatId: chat.id,
					role: "user",
					parts: [{ type: "text", text: "Follow-up question" }],
				},
			});

			// Reload — should now have 3 messages
			const res2 = await app.request(`/api/ai/chats/${chat.id}`, {
				headers: authHeaders,
			});
			const json2 = (await res2.json()) as {
				messages: Array<{ role: string; parts: Array<{ text: string }> }>;
			};
			expect(json2.messages).toHaveLength(3);
			expect(json2.messages[2].parts[0].text).toBe("Follow-up question");
		});

		it("should list multiple chats sorted by most recent first", async () => {
			const chat1 = await db.chat.create({
				data: { userId: testUserId, title: "Older Chat" },
			});
			chatIdsToCleanup.push(chat1.id);

			// Small delay to ensure different updatedAt
			await new Promise((r) => setTimeout(r, 50));

			const chat2 = await db.chat.create({
				data: { userId: testUserId, title: "Newer Chat" },
			});
			chatIdsToCleanup.push(chat2.id);

			const res = await app.request("/api/ai/chats", {
				headers: authHeaders,
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as Array<{
				id: string;
				title: string;
				updatedAt: string;
			}>;

			const idx1 = json.findIndex((c) => c.id === chat1.id);
			const idx2 = json.findIndex((c) => c.id === chat2.id);
			expect(idx1).toBeGreaterThan(-1);
			expect(idx2).toBeGreaterThan(-1);
			// Newer chat should appear first (sorted by updatedAt desc)
			expect(idx2).toBeLessThan(idx1);
		});

		it("should cascade delete messages when chat is deleted", async () => {
			const chat = await db.chat.create({
				data: { userId: testUserId, title: "Cascade Test" },
			});

			const msg = await db.chatMessage.create({
				data: {
					chatId: chat.id,
					role: "user",
					parts: [{ type: "text", text: "Will be cascade deleted" }],
				},
			});

			// Delete chat via API
			const deleteRes = await app.request(`/api/ai/chats/${chat.id}`, {
				method: "DELETE",
				headers: authHeaders,
			});
			expect(deleteRes.status).toBe(200);

			// Verify messages are also gone
			const orphanedMsg = await db.chatMessage.findUnique({
				where: { id: msg.id },
			});
			expect(orphanedMsg).toBeNull();
		});

		it("should return chat list items with correct shape", async () => {
			const chat = await db.chat.create({
				data: { userId: testUserId, title: "Shape Test" },
			});
			chatIdsToCleanup.push(chat.id);

			const res = await app.request("/api/ai/chats", {
				headers: authHeaders,
			});
			const json = (await res.json()) as Array<Record<string, unknown>>;
			const found = json.find((c) => c.id === chat.id) as Record<
				string,
				unknown
			>;
			expect(found).toBeDefined();

			// List endpoint should return id, title, createdAt, updatedAt — but NOT messages
			expect(found.id).toBeDefined();
			expect(found.title).toBe("Shape Test");
			expect(found.createdAt).toBeDefined();
			expect(found.updatedAt).toBeDefined();
			expect(found.messages).toBeUndefined();
		});

		it("should return 404 when getting nonexistent chat", async () => {
			const res = await app.request("/api/ai/chats/nonexistent-id", {
				headers: authHeaders,
			});
			expect(res.status).toBe(404);
			expect(await res.json()).toEqual({ error: "Chat not found" });
		});

		it("should return 404 when deleting nonexistent chat", async () => {
			const res = await app.request("/api/ai/chats/nonexistent-id", {
				method: "DELETE",
				headers: authHeaders,
			});
			expect(res.status).toBe(404);
			expect(await res.json()).toEqual({ error: "Chat not found" });
		});

		it("should create a new empty chat via POST /api/ai/chats", async () => {
			const res = await app.request("/api/ai/chats", {
				method: "POST",
				headers: authHeaders,
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as {
				id: string;
				title: string;
				createdAt: string;
				updatedAt: string;
			};
			expect(json.id).toBeDefined();
			expect(json.title).toBeDefined();
			expect(json.createdAt).toBeDefined();
			expect(json.updatedAt).toBeDefined();

			chatIdsToCleanup.push(json.id);
		});

		it("should update chat title via PATCH /api/ai/chats/:id", async () => {
			const chat = await db.chat.create({
				data: { userId: testUserId, title: "Original Title" },
			});
			chatIdsToCleanup.push(chat.id);

			const res = await app.request(`/api/ai/chats/${chat.id}`, {
				method: "PATCH",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({ title: "Updated Title" }),
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as { id: string; title: string };
			expect(json.title).toBe("Updated Title");
		});

		it("should return 404 when updating nonexistent chat", async () => {
			const res = await app.request("/api/ai/chats/nonexistent-id", {
				method: "PATCH",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({ title: "test" }),
			});
			expect(res.status).toBe(404);
			expect(await res.json()).toEqual({ error: "Chat not found" });
		});

		it("should not crash when POST /api/ai/chat is called with chatId 'new'", async () => {
			// Regression: the frontend sends chatId: "new" for new chats.
			// Previously this was treated as a real chatId, causing an FK violation.
			const res = await app.request("/api/ai/chat", {
				method: "POST",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({
					chatId: "new",
					messages: [
						{
							role: "user",
							parts: [{ type: "text", text: "hello" }],
						},
					],
				}),
			});
			// Should not be 500 (FK violation). May fail for other reasons
			// (e.g., no AI key) but the chat creation itself should succeed.
			expect(res.status).not.toBe(500);

			// Clean up any chat that was created
			const chatId = res.headers.get("x-chat-id");
			if (chatId) {
				chatIdsToCleanup.push(chatId);
			}
		});
	});

	describe("Sources — Unauthenticated Edge Cases", () => {
		it("should return 401 for syncing unknown provider without auth", async () => {
			const res = await app.request("/api/sources/nonexistent-provider/sync", {
				method: "POST",
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for deleting unknown provider without auth", async () => {
			const res = await app.request("/api/sources/nonexistent-provider", {
				method: "DELETE",
			});
			expect(res.status).toBe(401);
		});
	});

	describe.runIf(!!DEV_API_KEY)("Authenticated — Sources", () => {
		it("should return 404 when syncing source with unknown adapter", async () => {
			const devUserEmail = process.env.DEV_API_USER_EMAIL ?? "";
			const user = await db.user.findUnique({
				where: { email: devUserEmail },
			});
			if (!user) throw new Error("Test user not found");

			// Create a source record with a provider that has no adapter
			const source = await db.source.create({
				data: {
					userId: user.id,
					provider: "test-no-adapter",
					status: "connected",
				},
			});

			try {
				const res = await app.request("/api/sources/test-no-adapter/sync", {
					method: "POST",
					headers: authHeaders,
				});
				expect(res.status).toBe(404);
				const json = await res.json();
				expect(json).toEqual({ error: "Integration not available" });
			} finally {
				await db.source.delete({ where: { id: source.id } }).catch(() => {});
			}
		});

		it("should disconnect a source and remove its content items", async () => {
			const devUserEmail = process.env.DEV_API_USER_EMAIL ?? "";
			const user = await db.user.findUnique({
				where: { email: devUserEmail },
			});
			if (!user) throw new Error("Test user not found");

			const source = await db.source.create({
				data: {
					userId: user.id,
					provider: "test-disconnect",
					status: "connected",
				},
			});

			await db.contentItem.create({
				data: {
					userId: user.id,
					sourceId: source.id,
					externalId: "test-item-1",
					type: "test",
					rawData: { test: true },
					contentDate: new Date(),
				},
			});

			const itemsBefore = await db.contentItem.findMany({
				where: { sourceId: source.id },
			});
			expect(itemsBefore).toHaveLength(1);

			const res = await app.request("/api/sources/test-disconnect", {
				method: "DELETE",
				headers: authHeaders,
			});
			expect(res.status).toBe(200);
			const json = (await res.json()) as {
				provider: string;
				disconnected: boolean;
			};
			expect(json.provider).toBe("test-disconnect");
			expect(json.disconnected).toBe(true);

			const source2 = await db.source.findUnique({
				where: { id: source.id },
			});
			expect(source2).not.toBeNull();
			expect(source2?.status).toBe("disconnected");

			const itemsAfter = await db.contentItem.findMany({
				where: { sourceId: source.id },
			});
			expect(itemsAfter).toHaveLength(0);

			// Clean up the disconnected source record
			await db.source.delete({ where: { id: source.id } }).catch(() => {});
		});

		it("should return integrations with correct shape", async () => {
			const res = await app.request("/api/sources", {
				headers: authHeaders,
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as {
				integrations: Array<{
					provider: string;
					displayName: string;
					description: string;
					available: boolean;
					connected: boolean;
					comingSoon?: boolean;
				}>;
				connectedSources: unknown[];
			};

			expect(json.integrations).toBeDefined();
			expect(json.connectedSources).toBeDefined();
			expect(json.integrations.length).toBeGreaterThanOrEqual(6);

			// Should include both available and coming-soon integrations
			const twitter = json.integrations.find((i) => i.provider === "twitter");
			expect(twitter).toBeDefined();
			expect(twitter?.available).toBe(true);
			expect(twitter?.displayName).toBe("Twitter / X");

			const github = json.integrations.find((i) => i.provider === "github");
			expect(github).toBeDefined();
			expect(github?.available).toBe(true);

			const linkedin = json.integrations.find((i) => i.provider === "linkedin");
			expect(linkedin).toBeDefined();
			expect(linkedin?.available).toBe(false);
			expect(linkedin?.comingSoon).toBe(true);
		});

		it("should return 404 when syncing unconnected source", async () => {
			const res = await app.request("/api/sources/twitter/sync", {
				method: "POST",
				headers: authHeaders,
			});
			expect(res.status).toBe(404);
			const json = await res.json();
			expect(json).toEqual({ error: "Source not connected" });
		});

		it("should return 404 when disconnecting unconnected source", async () => {
			const res = await app.request("/api/sources/twitter", {
				method: "DELETE",
				headers: authHeaders,
			});
			expect(res.status).toBe(404);
			const json = await res.json();
			expect(json).toEqual({ error: "Source not connected" });
		});

		it("should return 404 when syncing nonexistent provider", async () => {
			const res = await app.request("/api/sources/nonexistent-provider/sync", {
				method: "POST",
				headers: authHeaders,
			});
			// Either 404 (source not connected) or 404 (integration not available)
			expect(res.status).toBe(404);
		});

		it("should return 404 when disconnecting nonexistent provider", async () => {
			const res = await app.request("/api/sources/nonexistent-provider", {
				method: "DELETE",
				headers: authHeaders,
			});
			expect(res.status).toBe(404);
		});

		it("should return 400 when connecting provider without OAuth account", async () => {
			const res = await app.request(
				"/api/sources/nonexistent-provider/connect",
				{
					method: "POST",
					headers: authHeaders,
				},
			);
			expect(res.status).toBe(400);
			const json = await res.json();
			expect(json).toEqual({
				error: "No OAuth account found. Please connect via OAuth first.",
			});
		});

		it("should include pendingConnections in sources list", async () => {
			const res = await app.request("/api/sources", {
				headers: authHeaders,
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as {
				integrations: unknown[];
				connectedSources: unknown[];
				pendingConnections: string[];
			};

			expect(json.pendingConnections).toBeDefined();
			expect(Array.isArray(json.pendingConnections)).toBe(true);
		});

		it("should include disconnectedProviders in sources list", async () => {
			const res = await app.request("/api/sources", {
				headers: authHeaders,
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as {
				integrations: unknown[];
				connectedSources: unknown[];
				disconnectedProviders: string[];
			};

			expect(json.disconnectedProviders).toBeDefined();
			expect(Array.isArray(json.disconnectedProviders)).toBe(true);
		});

		it("should return 403 when syncing at memory limit", async () => {
			const devUserEmail = process.env.DEV_API_USER_EMAIL ?? "";
			const user = await db.user.findUnique({
				where: { email: devUserEmail },
			});
			if (!user) throw new Error("Test user not found");

			// Create a source with an adapter that exists (twitter)
			const source = await db.source.create({
				data: {
					userId: user.id,
					provider: "twitter",
					status: "connected",
				},
			});

			// Mock getAll to return enough memories to exceed the free plan limit (25)
			const fakeMemories = Array.from({ length: 30 }, (_, i) => ({
				id: `mock-memory-${i}`,
				memory: `Test memory ${i}`,
				metadata: { source: "chat" },
			}));
			const getAllSpy = vi
				.spyOn(memory, "getAll")
				.mockResolvedValueOnce(fakeMemories);

			try {
				const res = await app.request("/api/sources/twitter/sync", {
					method: "POST",
					headers: authHeaders,
				});
				expect(res.status).toBe(403);

				const json = (await res.json()) as {
					error: string;
					limit: number;
					current: number;
					upgrade: boolean;
				};
				expect(json.error).toContain("Memory limit reached");
				expect(json.current).toBe(30);
				expect(json.limit).toBe(25);
				expect(json.upgrade).toBe(true);
			} finally {
				getAllSpy.mockRestore();
				await db.source.delete({ where: { id: source.id } }).catch(() => {});
			}
		});

		it("should include memoriesDeleted in disconnect response", async () => {
			const devUserEmail = process.env.DEV_API_USER_EMAIL ?? "";
			const user = await db.user.findUnique({
				where: { email: devUserEmail },
			});
			if (!user) throw new Error("Test user not found");

			const source = await db.source.create({
				data: {
					userId: user.id,
					provider: "test-cleanup",
					status: "connected",
				},
			});

			const res = await app.request("/api/sources/test-cleanup", {
				method: "DELETE",
				headers: authHeaders,
			});
			expect(res.status).toBe(200);
			const json = (await res.json()) as {
				provider: string;
				disconnected: boolean;
				memoriesDeleted: number;
			};
			expect(json.provider).toBe("test-cleanup");
			expect(json.disconnected).toBe(true);
			expect(typeof json.memoriesDeleted).toBe("number");

			// Clean up the disconnected source record
			await db.source
				.delete({
					where: {
						userId_provider: { userId: user.id, provider: "test-cleanup" },
					},
				})
				.catch(() => {});
		});
	});

	describe.runIf(!!DEV_API_KEY)("Authenticated — Dashboard", () => {
		it("should return dashboard data with correct shape", async () => {
			const res = await app.request("/api/dashboard", {
				headers: authHeaders,
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as {
				user: { name: string; email: string; image: string | null };
				stats: {
					memoryCount: number;
					sourceCount: number;
					chatCount: number;
				};
				connectedSources: unknown[];
				recentActivity: unknown[];
			};

			expect(json.user).toBeDefined();
			expect(json.user.email).toBeDefined();
			expect(json.stats).toBeDefined();
			expect(typeof json.stats.memoryCount).toBe("number");
			expect(typeof json.stats.sourceCount).toBe("number");
			expect(typeof json.stats.chatCount).toBe("number");
			expect(Array.isArray(json.connectedSources)).toBe(true);
			expect(Array.isArray(json.recentActivity)).toBe(true);
		});

		it("should not count non-integration sources in dashboard sourceCount", async () => {
			const devUserEmail = process.env.DEV_API_USER_EMAIL ?? "";
			const user = await db.user.findUnique({
				where: { email: devUserEmail },
			});
			if (!user) throw new Error("Test user not found");

			// Get baseline count
			const before = await app.request("/api/dashboard", {
				headers: authHeaders,
			});
			const beforeJson = (await before.json()) as {
				stats: { sourceCount: number };
			};
			const baselineCount = beforeJson.stats.sourceCount;

			// Create a non-integration source (e.g. credential, manual, unknown)
			const nonIntegrationSource = await db.source.create({
				data: {
					userId: user.id,
					provider: "credential",
					status: "connected",
				},
			});

			try {
				// sourceCount should NOT increase
				const after = await app.request("/api/dashboard", {
					headers: authHeaders,
				});
				const afterJson = (await after.json()) as {
					stats: { sourceCount: number };
				};
				expect(afterJson.stats.sourceCount).toBe(baselineCount);
			} finally {
				await db.source
					.delete({ where: { id: nonIntegrationSource.id } })
					.catch(() => {});
			}
		});
	});

	describe.runIf(!!DEV_API_KEY)("Authenticated — Settings", () => {
		it("should update profile with name and profileSummary", async () => {
			// Capture original name for restoration
			const devUserEmail = process.env.DEV_API_USER_EMAIL ?? "";
			const originalUser = await db.user.findUnique({
				where: { email: devUserEmail },
			});
			if (!originalUser) throw new Error("Test user not found");

			try {
				const res = await app.request("/api/settings/profile", {
					method: "PUT",
					headers: { ...authHeaders, "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "Test User Updated",
						profileSummary: "A test bio",
					}),
				});
				expect(res.status).toBe(200);

				const json = (await res.json()) as {
					name: string;
					email: string;
					profileSummary: string;
				};
				expect(json.name).toBe("Test User Updated");
				expect(json.email).toBeDefined();
				expect(json.profileSummary).toBe("A test bio");
			} finally {
				// Restore original name
				await db.user.update({
					where: { email: devUserEmail },
					data: { name: originalUser.name },
				});
			}
		});

		it("should return 400 for profile update with empty body", async () => {
			const res = await app.request("/api/settings/profile", {
				method: "PUT",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({}),
			});
			expect(res.status).toBe(400);
			const json = await res.json();
			expect(json).toEqual({ error: "No fields to update" });
		});

		it("should update sync settings to disabled", async () => {
			const res = await app.request("/api/settings/sync", {
				method: "PUT",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({ syncEnabled: false }),
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as { syncEnabled: boolean };
			expect(json.syncEnabled).toBe(false);
		});

		it("should update sync settings to enabled", async () => {
			const res = await app.request("/api/settings/sync", {
				method: "PUT",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({ syncEnabled: true }),
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as { syncEnabled: boolean };
			expect(json.syncEnabled).toBe(true);
		});

		it("should export user data with correct shape", async () => {
			const res = await app.request("/api/settings/export", {
				headers: authHeaders,
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as {
				exportedAt: string;
				profile: unknown;
				chats: unknown;
				sources: unknown;
				contentItems: unknown;
				memories: unknown;
			};
			expect(json.exportedAt).toBeDefined();
			expect(json.profile).toBeDefined();
			expect(json.chats).toBeDefined();
			expect(json.sources).toBeDefined();
			expect(json.contentItems).toBeDefined();
			expect(json.memories).toBeDefined();
		});
	});

	describe.runIf(!!DEV_API_KEY)("Authenticated — Memories", () => {
		it("should return memories as array", async () => {
			const res = await app.request("/api/memories", {
				headers: authHeaders,
			});
			expect(res.status).toBe(200);
			const json = await res.json();
			expect(Array.isArray(json)).toBe(true);
		});

		it("should return 400 for search without query param", async () => {
			const res = await app.request("/api/memories/search", {
				headers: authHeaders,
			});
			expect(res.status).toBe(400);
			const json = await res.json();
			expect(json).toEqual({
				error: "Query parameter 'q' is required",
			});
		});

		it("should return 400 for update without content", async () => {
			const res = await app.request("/api/memories/fake-id", {
				method: "PUT",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({}),
			});
			expect(res.status).toBe(400);
			const json = await res.json();
			expect(json).toEqual({ error: "Content is required" });
		});

		it("should return 200 for idempotent unpin of non-pinned memory", async () => {
			const res = await app.request("/api/memories/nonexistent-memory/pin", {
				method: "DELETE",
				headers: authHeaders,
			});
			expect(res.status).toBe(200);
			const json = await res.json();
			expect(json).toEqual({ success: true });
		});
	});

	describe.runIf(!!DEV_API_KEY)(
		"Functional — Source Lifecycle & Dashboard Consistency",
		() => {
			async function getTestUserId() {
				const devUserEmail = process.env.DEV_API_USER_EMAIL ?? "";
				const user = await db.user.findUnique({
					where: { email: devUserEmail },
				});
				if (!user) throw new Error("Test user not found");
				return user.id;
			}

			it("should remove content items from dashboard after source disconnect", async () => {
				const testUserId = await getTestUserId();
				const source = await db.source.create({
					data: {
						userId: testUserId,
						provider: "test-dashboard-lifecycle",
						status: "connected",
					},
				});

				for (let i = 0; i < 3; i++) {
					await db.contentItem.create({
						data: {
							userId: testUserId,
							sourceId: source.id,
							externalId: `dash-test-${i}`,
							type: "test",
							rawData: { content: `Test item ${i}` },
							contentDate: new Date(),
						},
					});
				}

				// Dashboard should show these items
				const before = await app.request("/api/dashboard", {
					headers: authHeaders,
				});
				const beforeJson = (await before.json()) as {
					recentActivity: Array<{
						source?: { provider: string };
					}>;
				};
				const beforeItems = beforeJson.recentActivity.filter(
					(a) => a.source?.provider === "test-dashboard-lifecycle",
				);
				expect(beforeItems.length).toBeGreaterThanOrEqual(1);

				// Disconnect
				const disconnectRes = await app.request(
					"/api/sources/test-dashboard-lifecycle",
					{ method: "DELETE", headers: authHeaders },
				);
				expect(disconnectRes.status).toBe(200);

				// Dashboard should no longer show those items
				const after = await app.request("/api/dashboard", {
					headers: authHeaders,
				});
				const afterJson = (await after.json()) as {
					recentActivity: Array<{
						source?: { provider: string };
					}>;
				};
				const afterItems = afterJson.recentActivity.filter(
					(a) => a.source?.provider === "test-dashboard-lifecycle",
				);
				expect(afterItems).toHaveLength(0);

				// Cleanup
				await db.source.delete({ where: { id: source.id } }).catch(() => {});
			});

			it("should have mutually exclusive pendingConnections and disconnectedProviders", async () => {
				const testUserId = await getTestUserId();
				const account = await db.account.create({
					data: {
						id: `test-account-${Date.now()}`,
						userId: testUserId,
						accountId: "test-consistency-123",
						providerId: "test-consistency",
						accessToken: "fake-token",
					},
				});

				try {
					// With account but no source → should be in pendingConnections
					const res1 = await app.request("/api/sources", {
						headers: authHeaders,
					});
					const json1 = (await res1.json()) as {
						pendingConnections: string[];
						connectedSources: Array<{ provider: string }>;
						disconnectedProviders: string[];
					};
					expect(json1.pendingConnections).toContain("test-consistency");

					// Create connected source → should move to connectedSources
					const source = await db.source.create({
						data: {
							userId: testUserId,
							provider: "test-consistency",
							status: "connected",
						},
					});

					const res2 = await app.request("/api/sources", {
						headers: authHeaders,
					});
					const json2 = (await res2.json()) as {
						pendingConnections: string[];
						connectedSources: Array<{ provider: string }>;
						disconnectedProviders: string[];
					};
					expect(json2.pendingConnections).not.toContain("test-consistency");
					const connected = json2.connectedSources.find(
						(s) => s.provider === "test-consistency",
					);
					expect(connected).toBeDefined();

					// Disconnect → should move to disconnectedProviders
					await db.source.update({
						where: { id: source.id },
						data: { status: "disconnected" },
					});

					const res3 = await app.request("/api/sources", {
						headers: authHeaders,
					});
					const json3 = (await res3.json()) as {
						pendingConnections: string[];
						connectedSources: Array<{ provider: string }>;
						disconnectedProviders: string[];
					};
					expect(json3.disconnectedProviders).toContain("test-consistency");
					expect(json3.pendingConnections).not.toContain("test-consistency");
					const stillConnected = json3.connectedSources.find(
						(s) => s.provider === "test-consistency",
					);
					expect(stillConnected).toBeUndefined();

					// Cleanup source
					await db.source.delete({ where: { id: source.id } }).catch(() => {});
				} finally {
					await db.account
						.delete({ where: { id: account.id } })
						.catch(() => {});
				}
			});

			it("should reuse source record ID when reconnecting a disconnected source", async () => {
				const testUserId = await getTestUserId();
				const source = await db.source.create({
					data: {
						userId: testUserId,
						provider: "test-reconnect",
						status: "disconnected",
					},
				});

				// Upsert (same logic as the connect route)
				const reconnected = await db.source.upsert({
					where: {
						userId_provider: { userId: testUserId, provider: "test-reconnect" },
					},
					create: {
						userId: testUserId,
						provider: "test-reconnect",
						status: "connected",
					},
					update: { status: "connected" },
				});

				expect(reconnected.id).toBe(source.id); // Same record, not new
				expect(reconnected.status).toBe("connected");

				await db.source.delete({ where: { id: source.id } }).catch(() => {});
			});
		},
	);

	describe("Billing — Auth Guards", () => {
		it("should return 401 for POST /api/billing/checkout without auth", async () => {
			const res = await app.request("/api/billing/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ priceId: "price_test" }),
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for POST /api/billing/portal without auth", async () => {
			const res = await app.request("/api/billing/portal", {
				method: "POST",
			});
			expect(res.status).toBe(401);
		});

		it("should return 401 for GET /api/billing/subscription without auth", async () => {
			const res = await app.request("/api/billing/subscription");
			expect(res.status).toBe(401);
		});

		it("should return 401 for POST /api/billing/cancel without auth", async () => {
			const res = await app.request("/api/billing/cancel", {
				method: "POST",
			});
			expect(res.status).toBe(401);
		});

		it("should return 400 for POST /api/billing/webhook without stripe-signature", async () => {
			const res = await app.request("/api/billing/webhook", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({}),
			});
			expect(res.status).toBe(400);
			const json = await res.json();
			expect(json).toEqual({ error: "Missing stripe-signature header" });
		});
	});

	describe.runIf(!!DEV_API_KEY)("Authenticated — Billing", () => {
		it("should return subscription info with correct shape", async () => {
			const res = await app.request("/api/billing/subscription", {
				headers: authHeaders,
			});
			expect(res.status).toBe(200);

			const json = (await res.json()) as {
				plan: string;
				planId: string;
				isPro: boolean;
				subscription: unknown;
				usage: {
					sources: number;
					memories: number;
					apiCallsToday: number;
				};
				limits: Record<string, unknown>;
			};

			expect(json.plan).toBeDefined();
			expect(json.planId).toBeDefined();
			expect(typeof json.isPro).toBe("boolean");
			expect(json.usage).toBeDefined();
			expect(typeof json.usage.sources).toBe("number");
			expect(typeof json.usage.memories).toBe("number");
			expect(typeof json.usage.apiCallsToday).toBe("number");
			expect(json.limits).toBeDefined();
		});

		it("should return 400 for POST /api/billing/checkout without priceId", async () => {
			const res = await app.request("/api/billing/checkout", {
				method: "POST",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({}),
			});
			expect(res.status).toBe(400);
			const json = await res.json();
			expect(json).toEqual({ error: "priceId is required" });
		});

		it("should return 400 for POST /api/billing/portal without stripe customer", async () => {
			const res = await app.request("/api/billing/portal", {
				method: "POST",
				headers: authHeaders,
			});
			expect(res.status).toBe(400);
			const json = await res.json();
			expect(json).toEqual({
				error: "No Stripe customer ID found. Please subscribe first.",
			});
		});

		it("should return 400 for POST /api/billing/cancel without active subscription", async () => {
			const res = await app.request("/api/billing/cancel", {
				method: "POST",
				headers: authHeaders,
			});
			expect(res.status).toBe(400);
			const json = await res.json();
			expect(json).toEqual({ error: "No active subscription found" });
		});
	});

	describe.runIf(!!DEV_API_KEY)(
		"Functional — Pins, Export & Settings Persistence",
		() => {
			async function getTestUserId() {
				const devUserEmail = process.env.DEV_API_USER_EMAIL ?? "";
				const user = await db.user.findUnique({
					where: { email: devUserEmail },
				});
				if (!user) throw new Error("Test user not found");
				return user.id;
			}

			it("should pin and unpin a memory with correct DB state", async () => {
				const testUserId = await getTestUserId();
				const memoryId = `test-pin-roundtrip-${Date.now()}`;

				// Pin
				const pinRes = await app.request(`/api/memories/${memoryId}/pin`, {
					method: "POST",
					headers: authHeaders,
				});
				expect(pinRes.status).toBe(200);

				// Verify in DB
				const pinRow = await db.pinnedMemory.findFirst({
					where: { userId: testUserId, memoryId },
				});
				expect(pinRow).not.toBeNull();

				// Pin again (idempotent)
				const pinRes2 = await app.request(`/api/memories/${memoryId}/pin`, {
					method: "POST",
					headers: authHeaders,
				});
				expect(pinRes2.status).toBe(200);

				// Still only one row
				const pinCount = await db.pinnedMemory.count({
					where: { userId: testUserId, memoryId },
				});
				expect(pinCount).toBe(1);

				// Unpin
				const unpinRes = await app.request(`/api/memories/${memoryId}/pin`, {
					method: "DELETE",
					headers: authHeaders,
				});
				expect(unpinRes.status).toBe(200);

				// Verify gone
				const afterUnpin = await db.pinnedMemory.findFirst({
					where: { userId: testUserId, memoryId },
				});
				expect(afterUnpin).toBeNull();

				// Unpin again → 200 (deleteMany is idempotent, never throws 404)
				const unpinRes2 = await app.request(`/api/memories/${memoryId}/pin`, {
					method: "DELETE",
					headers: authHeaders,
				});
				expect(unpinRes2.status).toBe(200);
			});

			it("should include recently created chat and source in export", async () => {
				const testUserId = await getTestUserId();
				// Create a chat with a message
				const chat = await db.chat.create({
					data: { userId: testUserId, title: "Export Test Chat" },
				});
				await db.chatMessage.create({
					data: {
						chatId: chat.id,
						role: "user",
						parts: [{ type: "text", text: "Export test message" }],
					},
				});

				// Create a source
				const source = await db.source.create({
					data: {
						userId: testUserId,
						provider: "test-export",
						status: "connected",
					},
				});

				try {
					const res = await app.request("/api/settings/export", {
						headers: authHeaders,
					});
					expect(res.status).toBe(200);

					const json = (await res.json()) as {
						exportedAt: string;
						profile: { id: string };
						chats: Array<{
							id: string;
							title: string;
							messages: Array<{ parts: unknown }>;
						}>;
						sources: Array<{ id: string; provider: string }>;
						contentItems: unknown[];
						memories: unknown;
					};

					// Verify chat is included with its message
					const exportedChat = json.chats.find((c) => c.id === chat.id);
					expect(exportedChat).toBeDefined();
					expect(exportedChat?.title).toBe("Export Test Chat");
					expect(exportedChat?.messages.length).toBeGreaterThanOrEqual(1);

					// Verify source is included
					const exportedSource = json.sources.find((s) => s.id === source.id);
					expect(exportedSource).toBeDefined();
					expect(exportedSource?.provider).toBe("test-export");
				} finally {
					await db.chat.delete({ where: { id: chat.id } }).catch(() => {});
					await db.source.delete({ where: { id: source.id } }).catch(() => {});
				}
			});

			it("should persist profile update and reflect in dashboard", async () => {
				const testUserId = await getTestUserId();
				const originalUser = await db.user.findUnique({
					where: { id: testUserId },
				});

				try {
					// Update profile
					const updateRes = await app.request("/api/settings/profile", {
						method: "PUT",
						headers: { ...authHeaders, "Content-Type": "application/json" },
						body: JSON.stringify({ name: "Functional Test Name" }),
					});
					expect(updateRes.status).toBe(200);

					// Dashboard should reflect the new name
					const dashRes = await app.request("/api/dashboard", {
						headers: authHeaders,
					});
					const dashJson = (await dashRes.json()) as { user: { name: string } };
					expect(dashJson.user.name).toBe("Functional Test Name");
				} finally {
					// Restore original name
					await db.user.update({
						where: { id: testUserId },
						data: { name: originalUser?.name },
					});
				}
			});

			it("should toggle sync settings and persist in DB", async () => {
				const testUserId = await getTestUserId();
				// Enable
				const enableRes = await app.request("/api/settings/sync", {
					method: "PUT",
					headers: { ...authHeaders, "Content-Type": "application/json" },
					body: JSON.stringify({ syncEnabled: true }),
				});
				expect(enableRes.status).toBe(200);
				expect(
					((await enableRes.json()) as { syncEnabled: boolean }).syncEnabled,
				).toBe(true);

				// Verify in DB
				const userEnabled = await db.user.findUnique({
					where: { id: testUserId },
				});
				expect(userEnabled?.syncEnabled).toBe(true);

				// Disable
				const disableRes = await app.request("/api/settings/sync", {
					method: "PUT",
					headers: { ...authHeaders, "Content-Type": "application/json" },
					body: JSON.stringify({ syncEnabled: false }),
				});
				expect(disableRes.status).toBe(200);
				expect(
					((await disableRes.json()) as { syncEnabled: boolean }).syncEnabled,
				).toBe(false);

				// Verify in DB
				const userDisabled = await db.user.findUnique({
					where: { id: testUserId },
				});
				expect(userDisabled?.syncEnabled).toBe(false);
			});
		},
	);
});
