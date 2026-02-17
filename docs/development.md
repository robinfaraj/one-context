# Development Setup

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL (local or Docker via `docker-compose.yml`)

## First-Time Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env vars and fill in values
cp .env.example .env.local

# 3. Run database migrations
cd packages/database
pnpm migrate

# 4. Seed the database (creates e2e test user)
pnpm seed

# 5. Generate Prisma client
pnpm generate

# 6. Start dev server (from repo root)
cd ../..
pnpm dev
```

## Database

All database commands run from `packages/database/`.

| Command | Description |
|---------|-------------|
| `pnpm generate` | Generate Prisma client |
| `pnpm migrate` | Create a new migration |
| `pnpm seed` | Seed DB with e2e test user |
| `pnpm studio` | Open Prisma Studio |
| `pnpm migrate-reset` | Reset DB and re-run all migrations |
| `pnpm deploy-prod` | Deploy migrations to production |

### Seed Script

`prisma/seed.ts` creates the e2e test user using BetterAuth's `signUpEmail` API. It reads `E2E_USER_EMAIL` and `E2E_USER_PASSWORD` from `.env.local`. The script is idempotent — it skips if the user already exists.

### Resetting the Database

```bash
cd packages/database
pnpm migrate-reset   # Drops all tables, re-runs migrations
pnpm seed            # Re-create seed data
```

## E2E Tests

E2E tests use Playwright and require a running dev server.

```bash
# Start the dev server
pnpm dev

# Run e2e tests (separate terminal)
pnpm test:e2e
```

The auth setup (`e2e/auth.setup.ts`) automatically signs up the e2e test user via the API before logging in, so tests are self-bootstrapping — no manual seeding required.

### Required env vars for e2e

- `E2E_USER_EMAIL` — email for the test user
- `E2E_USER_PASSWORD` — password for the test user
