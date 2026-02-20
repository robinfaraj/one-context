<p align="center">
  <img src=".github/logo.svg" alt="OneContext" width="200" />
</p>

<h1 align="center">OneContext</h1>

<p align="center"><strong>Your AI identity, everywhere.</strong></p>

Set up your profile once. Auto-sync from X, GitHub, and Notion. Use it with any AI tool via MCP or API.

---

Every AI tool asks for your background. You fill it in for ChatGPT, then Claude, then OpenClaw, then Cursor. Ship a feature? None of them know. OneContext fixes this — one auto-updating profile that works everywhere.

## How it works

1. **Connect** your accounts (X, GitHub, Notion)
2. **We sync** your identity daily — bio, projects, activity
3. **Use anywhere** via MCP or REST API — Claude, OpenClaw, ChatGPT, custom agents

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, Tailwind CSS, shadcn/ui |
| Backend | HonoJS, BetterAuth, PostgreSQL |
| Auth | OAuth 2.0 (X, GitHub), email, magic link, API keys |
| Infra | Turborepo monorepo, Vercel (hosted), Docker (self-hosted) |

## Local development

```bash
git clone https://github.com/one-context-app/onecontext.git
cd onecontext
pnpm install
cp .env.example .env.local   # add DB URL, OAuth keys, etc.
pnpm dev                     # http://localhost:3000
```

See `CLAUDE.md` for the full list of commands and architecture details.

## Docker

Run the full stack (app + PostgreSQL) with Docker Compose:

```bash
cp .env.example .env.local   # configure your env vars
docker compose up --build     # http://localhost:3000
```

Build a standalone production image:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  -t onecontext .
```

Run the production image (pass runtime secrets via env vars or `--env-file`):

```bash
docker run -p 3000:3000 \
  --env-file .env.local \
  -e DATABASE_URL=postgresql://user:pass@host:5432/onecontext \
  onecontext
```

## CLI

[![npm](https://img.shields.io/npm/v/octx)](https://www.npmjs.com/package/octx)

Manage your AI identity from the terminal:

```bash
npx octx login          # authenticate with your API key
npx octx whoami          # check current user
npx octx memories list   # list your memories
npx octx sources list    # list connected integrations
```

Or install globally: `npm install -g octx`

Full command reference: `npx octx --help`

## Roadmap

- **Done:** Auth, integrations (X, GitHub, Notion), MCP server, REST API, CLI, Docker self-host
- **Next:** Webhooks, team profiles, calendar/Linear integrations

## Contributing

Issues and PRs welcome. Join our [Discord](https://discord.gg/6uNYMBZEEh) to chat with the community. This project uses Biome for linting/formatting.

```bash
pnpm lint       # check
pnpm lint:fix   # auto-fix
pnpm build      # build all packages
```

## License

Apache 2.0 — free to use, modify, and distribute. See LICENSE file.

## Credits

Built by [Robin Faraj](https://github.com/robinfaraj) ([X](https://x.com/robin_faraj), [LinkedIn](https://www.linkedin.com/in/robin-sadeghpour-faraj-204196230/)), inspired by the pain of AI tool setup. Thanks to Anthropic (MCP), Vercel, shadcn, and the open source community.

---

**Star the repo if OneContext saves you time.** Contributions always welcome.
