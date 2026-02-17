import { db } from "@onecontext/database/server";
import {
	type AvailableIntegration,
	get,
	getAccessToken,
	getAvailable,
	persistSyncResult,
} from "@onecontext/integrations";
import { deleteMemory, getAll } from "@onecontext/memory";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "../middleware/auth";
import { checkMemoryLimit, checkSourceLimit } from "../middleware/plan-limits";

export const sourcesRouter = new Hono()
	.basePath("/sources")
	.use(authMiddleware)
	.post(
		"/:provider/connect",
		describeRoute({
			tags: ["Sources"],
			summary: "Connect a source",
			description:
				"Creates a Source record for an OAuth-connected provider and triggers initial sync",
			responses: {
				200: { description: "Source connected and synced" },
				400: { description: "No OAuth account found for provider" },
			},
		}),
		async (c) => {
			const user = c.get("user");
			const provider = c.req.param("provider");

			// Verify the user has an OAuth account for this provider
			const account = await db.account.findFirst({
				where: { userId: user.id, providerId: provider },
			});

			if (!account) {
				return c.json(
					{
						error: "No OAuth account found. Please connect via OAuth first.",
					},
					400,
				);
			}

			// Check source limit before connecting
			const sourceCheck = await checkSourceLimit(user.id);
			if (!sourceCheck.allowed) {
				return c.json(
					{
						error: "Source limit reached",
						limit: sourceCheck.limit,
						current: sourceCheck.current,
						upgrade: true,
					},
					403,
				);
			}

			// Upsert the source record (idempotent, also re-activates disconnected sources)
			const source = await db.source.upsert({
				where: { userId_provider: { userId: user.id, provider } },
				create: { userId: user.id, provider, status: "connected" },
				update: { status: "connected" },
			});

			// Attempt initial sync
			const adapter = get(provider);
			const accessToken = await getAccessToken(user.id, provider);
			if (!adapter || !accessToken) {
				return c.json({ source, syncResult: null });
			}

			try {
				const result = await adapter.sync(user.id, accessToken);
				await persistSyncResult(source.id, user.id, result);
				return c.json({
					source,
					syncResult: {
						itemsSynced: result.contentItems.length,
						memoriesAdded: result.memoriesAdded,
					},
				});
			} catch {
				// Source is connected even if initial sync fails
				return c.json({ source, syncResult: null });
			}
		},
	)
	.get(
		"/",
		describeRoute({
			tags: ["Sources"],
			summary: "List sources",
			description:
				"Returns connected sources for the user and all available integrations",
			responses: { 200: { description: "Sources list" } },
		}),
		async (c) => {
			const user = c.get("user");

			const [allSources, accounts] = await Promise.all([
				db.source.findMany({
					where: { userId: user.id },
					orderBy: { createdAt: "desc" },
				}),
				db.account.findMany({
					where: { userId: user.id },
					select: { providerId: true },
				}),
			]);

			// Only treat non-disconnected sources as connected
			const connectedSources = allSources.filter(
				(s) => s.status !== "disconnected",
			);

			const available = getAvailable();

			// Merge connected status into available integrations
			const integrations = available.map(
				(integration: AvailableIntegration) => {
					const connected = connectedSources.find(
						(s) => s.provider === integration.provider,
					);
					return {
						...integration,
						connected: !!connected,
						source: connected ?? null,
					};
				},
			);

			// Providers with OAuth accounts but no Source record at all (first-time connections only)
			const knownProviders = new Set(allSources.map((s) => s.provider));
			const pendingConnections = accounts
				.map((a) => a.providerId)
				.filter((p) => !knownProviders.has(p));

			// Providers that were disconnected (have Source record with status "disconnected")
			const disconnectedProviders = allSources
				.filter((s) => s.status === "disconnected")
				.map((s) => s.provider);

			return c.json({
				integrations,
				connectedSources,
				pendingConnections,
				disconnectedProviders,
			});
		},
	)
	.post(
		"/:provider/sync",
		describeRoute({
			tags: ["Sources"],
			summary: "Sync a source",
			description: "Triggers a sync for a connected source",
			responses: {
				200: { description: "Sync result" },
				404: { description: "Source not found" },
			},
		}),
		async (c) => {
			const user = c.get("user");
			const provider = c.req.param("provider");

			const source = await db.source.findUnique({
				where: { userId_provider: { userId: user.id, provider } },
			});

			if (!source) {
				return c.json({ error: "Source not connected" }, 404);
			}

			const adapter = get(provider);
			if (!adapter) {
				return c.json({ error: "Integration not available" }, 404);
			}

			// Check memory limit before syncing
			const allMemories = await getAll(user.id);
			const memoryCheck = await checkMemoryLimit(user.id, allMemories.length);
			if (!memoryCheck.allowed) {
				return c.json(
					{
						error: `Memory limit reached (${memoryCheck.current}/${memoryCheck.limit}). Upgrade your plan to sync more.`,
						limit: memoryCheck.limit,
						current: memoryCheck.current,
						upgrade: true,
					},
					403,
				);
			}

			const accessToken = await getAccessToken(user.id, provider);
			if (!accessToken) {
				return c.json(
					{ error: "No access token found. Please reconnect this source." },
					400,
				);
			}

			try {
				const result = await adapter.sync(user.id, accessToken);
				await persistSyncResult(source.id, user.id, result);

				return c.json({
					provider,
					itemsSynced: result.contentItems.length,
					memoriesAdded: result.memoriesAdded,
				});
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Sync failed unexpectedly";
				return c.json({ error: message }, 500);
			}
		},
	)
	.delete(
		"/:provider",
		describeRoute({
			tags: ["Sources"],
			summary: "Disconnect a source",
			description: "Removes a connected source and its content items",
			responses: {
				200: { description: "Source disconnected" },
				404: { description: "Source not found" },
			},
		}),
		async (c) => {
			const user = c.get("user");
			const provider = c.req.param("provider");

			const source = await db.source.findUnique({
				where: { userId_provider: { userId: user.id, provider } },
			});

			if (!source) {
				return c.json({ error: "Source not connected" }, 404);
			}

			// Delete Mem0 memories associated with this source
			let memoriesDeleted = 0;
			try {
				const allMemories = await getAll(user.id);
				const sourceMemories = (allMemories as any[]).filter(
					(m) => m.metadata?.source === provider,
				);
				for (const memory of sourceMemories) {
					try {
						await deleteMemory(memory.id);
						memoriesDeleted++;
					} catch (e) {
						console.warn(`Failed to delete Mem0 memory ${memory.id}:`, e);
					}
				}
			} catch (e) {
				console.warn("Failed to fetch Mem0 memories for cleanup:", e);
			}

			// Delete content items and mark source as disconnected (keep record to prevent auto-reconnect)
			await db.contentItem.deleteMany({
				where: { sourceId: source.id },
			});

			await db.source.update({
				where: { id: source.id },
				data: { status: "disconnected", lastSyncAt: null },
			});

			return c.json({ provider, disconnected: true, memoriesDeleted });
		},
	);
