import { app } from "@onecontext/api";
import { handle } from "hono/vercel";

export const dynamic = "force-dynamic";

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
