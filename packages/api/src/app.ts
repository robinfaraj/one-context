import { auth } from "@onecontext/auth";
import { getBaseUrl } from "@onecontext/utils";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import { corsMiddleware } from "./middleware/cors";
import { loggerMiddleware } from "./middleware/logger";
import { aiRouter } from "./routes/ai";
import { authRouter } from "./routes/auth";
import { billingRouter } from "./routes/billing";
import { dashboardRouter } from "./routes/dashboard";
import { healthRouter } from "./routes/health";
import { mcpRouter } from "./routes/mcp/router";
import { memoriesRouter } from "./routes/memories";
import { settingsRouter } from "./routes/settings";
import { sourcesRouter } from "./routes/sources";

export const app = new Hono().basePath("/api");

app.use(loggerMiddleware);
app.use(corsMiddleware);

const appRouter = app
	.route("/", healthRouter)
	.route("/", authRouter)
	.route("/", memoriesRouter)
	.route("/", aiRouter)
	.route("/", sourcesRouter)
	.route("/", dashboardRouter)
	.route("/", settingsRouter)
	.route("/", billingRouter)
	.route("/", mcpRouter);

app.get("/app-openapi", async (c) => {
	try {
		const handler = openAPIRouteHandler(app, {
			documentation: {
				info: {
					title: "OneContext API",
					version: "1.0.0",
				},
				servers: [
					{
						url: getBaseUrl(),
						description: "API server",
					},
				],
			},
		});
		return await handler(c, async () => {});
	} catch (error) {
		console.error("[app-openapi] Error generating OpenAPI spec:", error);
		throw error;
	}
});

interface OpenAPISchema {
	paths?: Record<string, unknown>;
	components?: {
		schemas?: Record<string, unknown>;
		[key: string]: unknown;
	};
	[key: string]: unknown;
}

app.get("/openapi", async (c) => {
	const authSchema = (await auth.api.generateOpenAPISchema()) as OpenAPISchema;
	const appSchema = (await (
		app.request("/api/app-openapi") as Promise<Response>
	).then((res) => res.json())) as OpenAPISchema;

	// Merge auth and app schemas
	const mergedSchema = {
		...appSchema,
		paths: {
			...appSchema.paths,
			...authSchema.paths,
		},
		components: {
			...(appSchema.components || {}),
			schemas: {
				...(appSchema.components?.schemas || {}),
				...(authSchema.components?.schemas || {}),
			},
		},
	};

	return c.json(mergedSchema);
});

app.get(
	"/docs",
	Scalar({
		theme: "saturn",
		url: "/api/openapi",
	}),
);

export type AppRouter = typeof appRouter;
