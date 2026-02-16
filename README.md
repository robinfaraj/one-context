# OneContext

**Your AI identity, everywhere.**

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

## Roadmap

- **Now:** Landing page, core auth, project scaffolding
- **Next:** X and GitHub integrations, MCP server, REST API, self-host via Docker
- **Later:** Notion sync, CLI, webhooks, team profiles, calendar/Linear integrations

## Contributing

Issues and PRs welcome. This project uses Biome for linting/formatting.

```bash
pnpm lint       # check
pnpm lint:fix   # auto-fix
pnpm build      # build all packages
```

## License

Apache 2.0 — free to use, modify, and distribute. See LICENSE file.

## Credits

Built by [Robin Sadeghpour](https://github.com/robinfaraj), inspired by the pain of AI tool setup. Thanks to Anthropic (MCP), Vercel, shadcn, and the open source community.

---

**Star the repo if OneContext saves you time.** Contributions always welcome.
