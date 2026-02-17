import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import {
	deleteMemory,
	listMemories,
	pinMemory,
	searchMemories,
	unpinMemory,
	updateMemory,
} from "../services/memories";

const memoryUpdateSchema = z.object({
	content: z.string().min(1, "Content is required"),
});

export const memoriesRouter = new Hono()
	.basePath("/memories")
	.use(authMiddleware)
	.get(
		"/",
		describeRoute({
			tags: ["Memories"],
			summary: "List all memories",
			description: "Returns all memories for the authenticated user",
			responses: { 200: { description: "List of memories" } },
		}),
		async (c) => {
			const user = c.get("user");
			const enriched = await listMemories(user.id);
			return c.json(enriched);
		},
	)
	.get(
		"/search",
		describeRoute({
			tags: ["Memories"],
			summary: "Search memories",
			description: "Semantic search across user memories",
			responses: { 200: { description: "Search results" } },
		}),
		async (c) => {
			const user = c.get("user");
			const query = c.req.query("q");
			if (!query) {
				return c.json({ error: "Query parameter 'q' is required" }, 400);
			}
			const filtersParam = c.req.query("filters");
			let filters: Record<string, unknown> | undefined;
			if (filtersParam) {
				try {
					filters = JSON.parse(filtersParam);
				} catch {
					return c.json({ error: "Invalid JSON in 'filters' parameter" }, 400);
				}
			}
			const results = await searchMemories(query, user.id, filters);
			return c.json(results);
		},
	)
	.put(
		"/:id",
		describeRoute({
			tags: ["Memories"],
			summary: "Update a memory",
			description: "Update the content of a specific memory",
			responses: {
				200: { description: "Updated memory" },
				400: { description: "Missing content" },
			},
		}),
		sValidator("json", memoryUpdateSchema),
		async (c) => {
			const memoryId = c.req.param("id");
			const { content } = c.req.valid("json");
			const result = await updateMemory(memoryId, content);
			return c.json(result);
		},
	)
	.delete(
		"/:id",
		describeRoute({
			tags: ["Memories"],
			summary: "Delete a memory",
			description: "Delete a specific memory",
			responses: { 200: { description: "Memory deleted" } },
		}),
		async (c) => {
			const memoryId = c.req.param("id");
			await deleteMemory(memoryId);
			return c.body(null, 204);
		},
	)
	.post(
		"/:id/pin",
		describeRoute({
			tags: ["Memories"],
			summary: "Pin a memory",
			description: "Pin a memory for the authenticated user",
			responses: {
				200: { description: "Memory pinned" },
				409: { description: "Memory already pinned" },
			},
		}),
		async (c) => {
			const user = c.get("user");
			const memoryId = c.req.param("id");
			const pinned = await pinMemory(user.id, memoryId);
			return c.json(pinned);
		},
	)
	.delete(
		"/:id/pin",
		describeRoute({
			tags: ["Memories"],
			summary: "Unpin a memory",
			description: "Unpin a memory for the authenticated user",
			responses: {
				200: { description: "Memory unpinned" },
				404: { description: "Pinned memory not found" },
			},
		}),
		async (c) => {
			const user = c.get("user");
			const memoryId = c.req.param("id");
			await unpinMemory(user.id, memoryId);
			return c.body(null, 204);
		},
	);
