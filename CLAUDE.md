# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OneContext is a universal AI identity platform — one auto-updating profile that syncs from X, GitHub, Notion and is consumable via MCP or REST API. Frontend: Next.js 16, Backend: HonoJS API, Auth: BetterAuth, DB: PostgreSQL via Prisma.

## Monorepo Structure

Turborepo + pnpm workspaces. All internal packages use `@onecontext/` scope with `workspace:*` dependencies.

- **apps/web** — Next.js 16 app (App Router, Turbopack dev, React 19)
- **apps/cli** — CLI placeholder (not yet implemented)
- **packages/api** — Hono API server, mounted at `/api/*` via Next.js catch-all route
- **packages/auth** — BetterAuth config (GitHub + Twitter OAuth, email/password, magic link, API keys with `octx_` prefix)
- **packages/database** — Prisma 7 with PostgreSQL, singleton client, `@prisma/adapter-pg`
- **packages/integrations** — Empty scaffold for future integration providers
- **packages/tasks** — Trigger.dev v4 client setup
- **packages/storage** — S3-compatible storage client (presigned URLs)
- **packages/mail** — Nodemailer + react-email templates (preview on port 3005)
- **packages/logs** — Consola logger wrapper
- **packages/utils** — `getBaseUrl()` helper
- **config/** — Centralized app config (auth, ui, api settings)
- **tooling/typescript** — Shared tsconfigs (base, nextjs, react-library)
- **tooling/tailwind** — Shared theme.css and tailwind-animate.css

## Common Commands

```bash
pnpm dev                # Start all apps (turbo, concurrency 15)
pnpm build              # Build all packages (dotenv + turbo)
pnpm lint               # Biome check
pnpm lint:fix           # Biome check --write --unsafe
pnpm format             # Biome format --write
```

### Database (run from packages/database)

```bash
pnpm generate           # Generate Prisma client
pnpm push               # Push schema to DB (no migration)
pnpm migrate            # Create a Prisma migration
pnpm studio             # Open Prisma Studio
pnpm deploy-prod        # Deploy migrations to production
```

All database commands use `dotenv -c -e ../../.env.local` to load env vars.

### Auth Schema Generation (run from packages/auth)

```bash
pnpm migrate            # Generates Prisma schema from BetterAuth config into packages/database/prisma/schema.prisma
```

This runs `@better-auth/cli generate` and outputs to the database package's schema file. After running this, you must also run `pnpm generate` in packages/database.

### Trigger.dev (run from packages/tasks)

```bash
pnpm dev-trigger        # Local Trigger.dev dev mode
pnpm deploy             # Deploy tasks to Trigger.dev
```

## Architecture Patterns

### API Routing

All `/api/*` requests flow through a single Next.js catch-all route (`apps/web/app/api/[[...rest]]/route.ts`) that delegates to the Hono app from `@onecontext/api`. The Hono app is mounted at `/api` base path.

- Routes: health check (`/api/health`), auth (`/api/auth/**`)
- OpenAPI spec at `/api/openapi`, interactive docs at `/api/docs` (Scalar, Saturn theme)
- Auth middleware: dev mode uses `DEV_API_KEY` Bearer token, production uses BetterAuth cookie sessions

### Auth Flow

BetterAuth manages all auth. The Prisma schema is **auto-generated** from the BetterAuth config — do not hand-edit auth-related models in `schema.prisma`. To update auth tables: modify `packages/auth/auth.ts` → run `pnpm migrate` in packages/auth → run `pnpm generate` in packages/database.

Plugins: username, admin, openAPI, apiKey (prefix: `octx_`, rate limit: 60/min), magicLink. Social: GitHub, Twitter/X.

### Web App Conventions

- Path aliases: `@ui/*` → `modules/ui/*`, `@shared/*` → `modules/shared/*`
- UI components go in `apps/web/modules/ui/components/` (shadcn/ui, added via `pnpm shadcn-ui` script)
- Shared app components in `apps/web/modules/shared/components/`
- `cn()` utility at `modules/ui/lib/utils.ts` (clsx + tailwind-merge)
- State: Zustand, Forms: react-hook-form, Animations: Framer Motion, Toast: Sonner

## Linting & Formatting

Biome handles both linting and formatting (not ESLint/Prettier). Key rules:
- `.tsx` files must use **kebab-case** filenames
- Unused imports are errors
- `noExplicitAny`: warn, `noForEach`: off, `useExhaustiveDependencies`: off, `noEmptyBlockStatements`: warn
- Generated code (`packages/database/src/generated`) is excluded from linting

## Coding Rules (Enforced)

### API Routes — Always validate with Zod
Every Hono route that accepts a request body MUST use `sValidator("json", schema)` from `@hono/standard-validator` and `c.req.valid("json")`. Never use raw `c.req.json()`. Define schemas at the top of the route file or in a co-located `types.ts`.

### API Routes — Use the service/query layer
Route handlers in `packages/api/src/routes/` must NOT import `db` from `@onecontext/database` directly. Database access goes through service functions (business logic) and query functions (Prisma calls). Architecture: **Router → Service → Query → Database**.

### Styling — Use theme tokens, never hardcoded colors
Never use raw Tailwind color classes like `bg-emerald-700`, `text-blue-500`, etc. Always use the theme CSS variable tokens defined in `tooling/tailwind/theme.css`: `bg-primary`, `text-primary`, `bg-accent`, `text-primary-foreground`, etc. This ensures the brand is centrally configurable.

### Error handling — No silent swallowing
Never use `.catch(() => {})` or empty catch blocks. Always log errors using `@onecontext/logs` logger or at minimum `console.warn` with context.

### Imports — Use canonical paths
Import `authClient` from `@shared/lib/api` (not directly from `@onecontext/auth/client`). Use the re-export to keep a single source of truth.

## Environment

Env vars are loaded via `dotenv-cli` with `-c` flag (loads `.env.local`). See `.env.example` at root and `turbo.json` `globalEnv` for the full list. Key vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, OAuth credentials, S3 config, `TRIGGER_SECRET_KEY`.

## Reference Docs

- `prompts/product-brief.md` — Full product specification with user stories and MVP goals
- `prompts/brand-guide-and-visual-identity.md` — Brand visual identity guidelines
- `prompts/brand-and-copy-guide.md` — Copy and tone guidelines
- `dev-tool-guides/better-auth-cli.md` — BetterAuth CLI usage documentation
