import { db } from "@onecontext/database/server";
import {
	type AvailableIntegration,
	get,
	getAccessToken,
	getAvailable,
	persistSyncResult,
} from "@onecontext/integrations";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "../middleware/auth";

export const sourcesRouter = new Hono()
	.basePath("/sources")
	.use(authMiddleware)
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

			const connectedSources = await db.source.findMany({
				where: { userId: user.id },
				orderBy: { createdAt: "desc" },
			});

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

			return c.json({ integrations, connectedSources });
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

			const accessToken = await getAccessToken(user.id, provider);
			if (!accessToken) {
				return c.json(
					{ error: "No access token found. Please reconnect this source." },
					400,
				);
			}

			const result = await adapter.sync(user.id, accessToken);
			await persistSyncResult(source.id, user.id, result);

			return c.json({
				provider,
				itemsSynced: result.contentItems.length,
				memoriesAdded: result.memoriesAdded,
			});
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

			// Delete content items first, then the source
			await db.contentItem.deleteMany({
				where: { sourceId: source.id },
			});

			await db.source.delete({
				where: { id: source.id },
			});

			return c.json({ provider, disconnected: true });
		},
	);
