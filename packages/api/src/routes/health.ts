import { Hono } from "hono";
import { describeRoute } from "hono-openapi";

export const healthRouter = new Hono().get(
	"/health",
	describeRoute({
		tags: ["Health"],
		summary: "Health check",
		description: "Returns 200 if the server is healthy",
		responses: { 200: { description: "OK" } },
	}),
	() => new Response("OK"),
);
