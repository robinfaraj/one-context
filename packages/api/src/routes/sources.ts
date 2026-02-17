import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "../middleware/auth";
import {
	BadRequestError,
	MemoryLimitError,
	NotFoundError,
	SourceLimitError,
	connectSource,
	disconnectSource,
	listSources,
	syncSource,
} from "../services/sources";

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

			try {
				const result = await connectSource(user.id, provider);
				return c.json(result);
			} catch (err) {
				if (err instanceof BadRequestError) {
					return c.json({ error: err.message }, 400);
				}
				if (err instanceof SourceLimitError) {
					return c.json(
						{
							error: "Source limit reached",
							limit: err.limit,
							current: err.current,
							upgrade: true,
						},
						403,
					);
				}
				throw err;
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
			const result = await listSources(user.id);
			return c.json(result);
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

			try {
				const result = await syncSource(user.id, provider);
				return c.json(result);
			} catch (err) {
				if (err instanceof NotFoundError) {
					return c.json({ error: err.message }, 404);
				}
				if (err instanceof MemoryLimitError) {
					return c.json(
						{
							error: err.message,
							limit: err.limit,
							current: err.current,
							upgrade: true,
						},
						403,
					);
				}
				if (err instanceof BadRequestError) {
					return c.json({ error: err.message }, 400);
				}
				const message =
					err instanceof Error ? err.message : "Sync failed unexpectedly";
				return c.json({ error: message }, 503);
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

			try {
				const result = await disconnectSource(user.id, provider);
				return c.json(result);
			} catch (err) {
				if (err instanceof NotFoundError) {
					return c.json({ error: err.message }, 404);
				}
				throw err;
			}
		},
	);
