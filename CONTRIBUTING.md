# Contributing to OneContext

Thanks for your interest in contributing! This guide will help you get started.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) 9.3+
- [PostgreSQL](https://www.postgresql.org/) (local or Docker)

### Setup

```bash
git clone https://github.com/robinfaraj/one-context.git
cd one-context
pnpm install
cp .env.example .env.local
```

Fill in the required env vars in `.env.local`:

- `DATABASE_URL` — your PostgreSQL connection string
- `BETTER_AUTH_SECRET` — any random string (e.g. `openssl rand -hex 32`)

Optional (for OAuth, email, etc.): see `.env.example` for the full list.

### Database

```bash
cd packages/database
pnpm generate   # generate Prisma client
pnpm push       # push schema to your DB
```

### Run locally

```bash
pnpm dev   # starts everything on http://localhost:3000
```

## Making Changes

### Branch naming

Use descriptive branch names:

- `feat/add-notion-sync`
- `fix/oauth-redirect-loop`
- `docs/update-contributing`

### Code style

This project uses [Biome](https://biomejs.dev/) for linting and formatting (not ESLint/Prettier).

```bash
pnpm lint       # check for issues
pnpm lint:fix   # auto-fix
pnpm format     # format all files
```

Key rules:

- `.tsx` files must use **kebab-case** filenames (e.g. `user-profile.tsx`)
- Unused imports are errors
- Husky runs checks on commit — if a hook fails, fix the issue and commit again

### Project structure

This is a Turborepo monorepo. Key locations:

| Path | What goes there |
|------|----------------|
| `apps/web/` | Next.js frontend |
| `apps/web/modules/ui/components/` | UI components (shadcn/ui) |
| `apps/web/modules/shared/components/` | Shared app components |
| `packages/api/` | Hono API server |
| `packages/auth/` | BetterAuth config |
| `packages/database/` | Prisma schema and client |

### Auth schema changes

The Prisma schema for auth tables is **auto-generated** from BetterAuth config. Never hand-edit auth models in `schema.prisma`. Instead:

1. Modify `packages/auth/auth.ts`
2. Run `pnpm migrate` in `packages/auth`
3. Run `pnpm generate` in `packages/database`

## Submitting a PR

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Run `pnpm lint` and `pnpm build` to make sure everything passes
4. Write a clear PR description explaining **what** and **why**
5. Link any related issues (e.g. "Closes #42")

### What makes a good PR

- **Small and focused** — one feature or fix per PR
- **Tested** — verify your changes work locally
- **Documented** — update docs/README if your change affects usage

## Finding Issues

Look for issues labeled [`good first issue`](https://github.com/robinfaraj/one-context/labels/good%20first%20issue) or [`help wanted`](https://github.com/robinfaraj/one-context/labels/help%20wanted).

If you want to work on something that doesn't have an issue yet, open one first so we can discuss the approach.

## Community

- Join our [Discord](https://discord.gg/6uNYMBZEEh) to ask questions and chat with other contributors
- Be kind and respectful — see our [Code of Conduct](CODE_OF_CONDUCT.md)

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).
