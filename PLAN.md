# OneContext Boilerplate Architecture Plan

## Overview

Strip down Postel v2's architecture into a minimal, clean foundation for OneContext. Same monorepo patterns, latest versions, zero domain logic. **Only project setup and boilerplate** — features get built on top of this.

---

## 1. Root Configuration Files

### `package.json`
```json
{
  "name": "onecontext",
  "private": true,
  "scripts": {
    "build": "dotenv -c -- turbo build",
    "dev": "dotenv -c -- turbo dev --concurrency 15",
    "lint": "biome check .",
    "lint:fix": "biome check . --write --unsafe",
    "clean": "turbo clean",
    "format": "biome format . --write"
  },
  "engines": { "node": ">=20" },
  "packageManager": "pnpm@9.3.0",
  "devDependencies": {
    "@biomejs/biome": "1.9.4",
    "@onecontext/tsconfig": "workspace:*",
    "@types/node": "^22.10.5",
    "dotenv": "^16.4.7",
    "dotenv-cli": "^8.0.0",
    "tsx": "^4.19.2",
    "turbo": "^2.8.4",
    "typescript": "5.7.2"
  }
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - config
  - apps/*
  - packages/*
  - tooling/*
```

### `turbo.json`
- `globalEnv`: `DATABASE_URL`, `SHADOW_DATABASE_URL`, `MIGRATION_DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `VERCEL_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`, `DEV_API_KEY`, `DEV_API_USER_EMAIL`, `PORT`, `NODE_ENV`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `RESEND_API_KEY`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`, `S3_REGION`, `TRIGGER_SECRET_KEY`, `TRIGGER_API_URL`
- Same task graph as Postel: `build` depends on `^generate` + `^build`, `dev` is persistent/uncached

### `biome.json`
- Same rules as Postel (recommended + custom overrides, kebab-case for `.tsx`)
- Updated ignore paths for OneContext

### `.env.example`
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/onecontext
MIGRATION_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/onecontext
SHADOW_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/onecontext_shadow

# Auth
BETTER_AUTH_SECRET=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_URL=http://localhost:3000
PORT=3000

# OAuth - GitHub
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# OAuth - X/Twitter
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=

# Mail
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
RESEND_API_KEY=

# Storage (S3-compatible)
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
S3_REGION=

# Trigger.dev
TRIGGER_SECRET_KEY=
TRIGGER_API_URL=

# Dev
DEV_API_KEY=
DEV_API_USER_EMAIL=
```

### Other root files
- `.npmrc` — `public-hoist-pattern[]=*prisma*`
- `.gitignore` — Standard (node_modules, .next, .turbo, dist, .env files)
- `tsconfig.json` — Extends `@onecontext/tsconfig/base.json`

---

## 2. Directory Structure

```
onecontext/
├── .env.example
├── .gitignore
├── .npmrc
├── biome.json
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── turbo.json
├── CLAUDE.md
│
├── config/                          # @onecontext/config
│   ├── index.ts
│   ├── types.ts
│   ├── package.json
│   └── tsconfig.json
│
├── tooling/
│   ├── typescript/                  # @onecontext/tsconfig
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   ├── react-library.json
│   │   └── package.json
│   └── tailwind/                    # @onecontext/tailwind-config
│       ├── theme.css
│       ├── tailwind-animate.css
│       └── package.json
│
├── packages/
│   ├── database/                    # @onecontext/database
│   │   ├── index.ts
│   │   ├── prisma.config.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   └── schema.prisma       (BetterAuth tables ONLY)
│   │   └── src/
│   │       └── client.ts
│   │
│   ├── auth/                        # @onecontext/auth
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api/                         # @onecontext/api
│   │   ├── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── app.ts
│   │       ├── middleware/
│   │       │   ├── auth.ts
│   │       │   ├── cors.ts
│   │       │   └── logger.ts
│   │       └── routes/
│   │           ├── health.ts
│   │           └── auth.ts
│   │
│   ├── utils/                       # @onecontext/utils
│   │   ├── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── lib/
│   │       └── base-url.ts
│   │
│   ├── logs/                        # @onecontext/logs
│   │   ├── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── lib/
│   │       └── logger.ts
│   │
│   ├── mail/                        # @onecontext/mail
│   │   ├── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── provider.ts          (Resend/nodemailer setup)
│   │
│   ├── tasks/                       # @onecontext/tasks
│   │   ├── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── client.ts            (Trigger.dev client setup)
│   │
│   ├── storage/                     # @onecontext/storage
│   │   ├── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── client.ts            (S3 client setup)
│   │       └── presign.ts           (presigned URL helpers)
│   │
│   └── integrations/                # @onecontext/integrations (empty scaffold)
│       ├── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   ├── web/                         # @onecontext/web
│   │   ├── next.config.ts
│   │   ├── postcss.config.cjs
│   │   ├── components.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   ├── global-error.tsx
│   │   │   ├── layout.tsx           (root layout)
│   │   │   ├── page.tsx             (home — placeholder)
│   │   │   └── api/
│   │   │       └── [[...rest]]/
│   │   │           └── route.ts     (Hono catch-all)
│   │   ├── modules/
│   │   │   ├── ui/
│   │   │   │   ├── components/      (shadcn components go here)
│   │   │   │   └── lib/
│   │   │   │       └── utils.ts     (cn() helper)
│   │   │   └── shared/
│   │   │       └── components/
│   │   │           └── providers.tsx
│   │   └── public/
│   │
│   └── cli/                         # @onecontext/cli (empty scaffold)
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts
```

---

## 3. What We Keep vs Remove from Postel

### KEEP (adapted for OneContext)
| Postel Package | OneContext Package | Changes |
|---|---|---|
| `@repo/database` | `@onecontext/database` | BetterAuth tables only (User, Session, Account, Verification, Apikey). No domain tables. |
| `@repo/auth` | `@onecontext/auth` | Remove organization, passkey, oidcProvider, payment/tracking hooks. Keep: email/password, GitHub OAuth, Twitter OAuth, API keys, magicLink |
| `@repo/api` | `@onecontext/api` | Health + auth routes only. Hono + OpenAPI scaffold. No domain routes. |
| `@repo/utils` | `@onecontext/utils` | base-url helper only |
| `@repo/logs` | `@onecontext/logs` | Identical (consola wrapper) |
| `@repo/mail` | `@onecontext/mail` | Provider setup only (Resend/nodemailer). No templates yet. |
| `@repo/tasks` | `@onecontext/tasks` | Trigger.dev client setup only. No task definitions yet. |
| `@repo/storage` | `@onecontext/storage` | S3 client + presigned URL helpers only. |
| `@repo/config` | `@onecontext/config` | New config shape (auth, ui, api settings) |
| `@repo/tsconfig` | `@onecontext/tsconfig` | Identical (base, nextjs, react-library) |
| tailwind config | `@onecontext/tailwind-config` | Same structure, neutral brand colors |
| `apps/web` | `apps/web` | Root layout + home placeholder + API catch-all only. No pages. |

### REMOVE (not needed)
- `@repo/posts` — Content generation
- `@repo/ai` — LLM abstractions
- `@repo/ai-chat` — Chat orchestration
- `@repo/knowledge-base` — Document processing
- `@repo/payments` — Stripe/Lemon/Chargebee
- `@repo/queue` — Job queues (replaced by Trigger.dev)
- `@repo/scheduling` — Post scheduling
- `@repo/tracking` — Facebook CAPI
- `@repo/redis` — Redis client
- `@repo/i18n` — Internationalization

---

## 4. Database Schema

**Auto-generated by BetterAuth CLI** — no hand-written tables. The Prisma schema starts with only the generator + datasource block:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

Then BetterAuth CLI generates all required tables based on our auth config (plugins enabled):
```bash
pnpm dlx @better-auth/cli@latest generate --config ./packages/auth/auth.ts --output ./packages/database/prisma/schema.prisma
```

This auto-creates: User, Session, Account, Verification, Apikey (+ any tables required by username, admin, magicLink plugins).

No domain tables — those come later when building features.

---

## 5. Auth Setup (BetterAuth)

- **Plugins:** `username()`, `admin()`, `openAPI()`, `apiKey({ prefix: "octx_" })`, `magicLink()`
- **Social:** GitHub (`user:email`, `read:user`), Twitter (`users.read`, `tweet.read`, `offline.access`)
- **Email/Password:** Enabled
- **Removed:** organization, passkey, oidcProvider, payment hooks, tracking hooks

---

## 6. API Setup (Hono)

Bare minimum Hono app:
- **Middleware:** logger, CORS, auth
- **Routes:** health check + auth (BetterAuth handler proxy)
- **OpenAPI:** Scalar docs UI at `/api/docs`
- **Catch-all:** Next.js `app/api/[[...rest]]/route.ts` proxies all `/api/*` to Hono

No domain routes, no MCP routes — those come later.

---

## 7. Web App (Next.js)

Absolute minimum:
- Root layout (html, body, fonts, providers)
- Home page placeholder
- API catch-all route for Hono
- `modules/ui/` with `cn()` helper + empty `components/` dir for shadcn
- `modules/shared/components/providers.tsx` (QueryClientProvider, ThemeProvider)
- `components.json` for shadcn CLI

No auth pages, no dashboard pages, no feature modules — those come later.

---

## 8. Package Naming: `@onecontext/`

Using `@onecontext` scope (not `@repo`) so packages are ready for npm publishing (MCP server, CLI).

---

## 9. Implementation Sequence

1. Root config files (package.json, turbo.json, biome.json, etc.)
2. `tooling/typescript/` — tsconfig base files
3. `tooling/tailwind/` — theme + animate CSS
4. `config/` — centralized app config
5. `packages/logs/` — logger
6. `packages/utils/` — base-url helper
7. `packages/database/` — Prisma config + client (schema empty, just generator/datasource)
8. `packages/storage/` — S3 client + presigned URLs
9. `packages/mail/` — mail provider setup
10. `packages/auth/` — BetterAuth config (plugins, social providers)
11. Run `better-auth generate` → populates Prisma schema from auth config
12. Run `prisma generate` → generates Prisma client
13. `packages/tasks/` — Trigger.dev client
12. `packages/integrations/` — empty scaffold
13. `packages/api/` — Hono app with health + auth routes only
14. `apps/web/` — Next.js shell (layout + home + API catch-all)
15. `apps/cli/` — empty scaffold

Then: `pnpm install` → `better-auth generate` (populates schema) → `prisma generate` (generates client) → `pnpm dev`

---

## 10. Key Architectural Decisions

1. **No organizations** — Personal tool, not team-based. Removes massive complexity.
2. **No domain logic** — This is purely boilerplate. All domain models, routes, pages, and business logic come in subsequent feature work.
3. **BetterAuth CLI generates schema** — Run `better-auth generate` to auto-create Prisma models from auth config. No hand-written auth tables.
4. **Mail provider setup only** — No email templates yet, just the sending infrastructure.
5. **Trigger.dev client only** — No task definitions yet, just the client wiring.
6. **Storage client only** — S3 client + presign helpers, no upload routes or UI.
7. **API = health + auth only** — No domain routes, no MCP. Just enough to verify Hono + BetterAuth work.
8. **Web = shell only** — Root layout, home placeholder, API proxy. No pages, no auth UI, no dashboard.
