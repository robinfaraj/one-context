import { db } from "@onecontext/database/server";
import * as mem0 from "@onecontext/mem0";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "../middleware/auth";

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
			const memories = await mem0.getAll(user.id);
			return c.json(memories);
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
			const filters = filtersParam ? JSON.parse(filtersParam) : undefined;
			const results = await mem0.search(query, user.id, filters);
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
		async (c) => {
			const memoryId = c.req.param("id");
			const body = await c.req.json<{ content: string }>();
			if (!body.content) {
				return c.json({ error: "Content is required" }, 400);
			}
			const result = await mem0.update(memoryId, body.content);
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
			await mem0.deleteMemory(memoryId);
			return c.json({ success: true });
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
			const existing = await db.pinnedMemory.findUnique({
				where: {
					userId_memoryId: { userId: user.id, memoryId },
				},
			});
			if (existing) {
				return c.json({ error: "Memory already pinned" }, 409);
			}
			const pinned = await db.pinnedMemory.create({
				data: { userId: user.id, memoryId },
			});
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
			const existing = await db.pinnedMemory.findUnique({
				where: {
					userId_memoryId: { userId: user.id, memoryId },
				},
			});
			if (!existing) {
				return c.json({ error: "Pinned memory not found" }, 404);
			}
			await db.pinnedMemory.delete({
				where: {
					userId_memoryId: { userId: user.id, memoryId },
				},
			});
			return c.json({ success: true });
		},
	);
