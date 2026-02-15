# OneContext: GitHub README

### TL;DR

**Stop repeating your story for every AI tool. OneContext is the universal AI identity layer—set up your profile once, auto-sync your digital footprint, and use your up-to-date context everywhere via MCP or API. Built for developers, privacy-first, and always current.**

---

## Header & Logo

> **Your AI identity, everywhere.**

---

## Hero Section

# Stop repeating yourself to every AI tool.

### OneContext is the universal AI identity platform. Set up your profile once, auto-sync from X, GitHub, and Notion, then use it everywhere via MCP or API.

Every AI tool wants your background and recent work. You fill it in for ChatGPT, then again for Claude, then OpenClaw, Cursor, and the next trend. Ship a feature? None of your AI tools know. OneContext fixes this. One auto-updating profile, always in sync, works with any AI tool.

---

## Quick Start

Get started in under 2 minutes:

**1. Hosted (recommended):**

* 

* Connect your accounts

* Copy your API key

```bash
# Connect accounts and get started instantly:
open https://onecontext.dev
```

**2. Self-hosted:**

* Use Docker or npm to launch your own server

```bash
# Docker (runs everything)
docker run --env-file .env -p 3000:3000 onecontext/onecontext:latest

```

# `or with npm`

`npm install -g onecontext`  

`onecontext dev`  

**3. MCP Only:**

* Just want to serve context via MCP for Claude/OpenClaw?

```bash
npm install -g @onecontext/mcp-server
onecontext-mcp --api-key=YOUR_API_KEY
```

---

## Demo / How It Works

1\. Connect your X account

  

*Authorize in one click—no copy-pasting keys.*

2\. Dashboard auto-builds your profile

  

*See your synced projects, bio, and activity. “Last synced: 10 min ago.”*

3\. Copy MCP command or API key

  

*Connect any AI tool in seconds.*

4\. OpenClaw/Claude starts using your up-to-date identity

  

*No more explaining what you shipped yesterday.*

---

## Features

* ✅ **Auto-sync Everything**

  * Daily updates from X, GitHub, Notion—no more manual context refreshes.

* ✅ **Works Everywhere**

  * Use with Claude, OpenClaw via MCP; REST API for all other tools; plugin support.

* ✅ **Privacy-First by Default**

  * Fully open source and self-hostable; your data under your control, not ours.

* ✅ **Developer-Friendly**

  * Clean API, TypeScript SDK, comprehensive docs, and simple integrations.

* ✅ **Extensible by Design**

  * Add your own sources and plugins—custom integration system makes it easy.

* ✅ **Always Current**

  * AI tools always know about your latest projects, commits, tweets, and updates.

---

## Integrations

---

## Tech Stack

* **Frontend:** Next.js 16, Tailwind CSS, shadcn/ui, Framer Motion

* **Backend:** HonoJS (API + MCP Server), BetterAuth, PostgreSQL (Supabase)

* **Integrations:** OAuth 2.0 for secure connections (e.g., X, GitHub)

* **Deployment:** Vercel (hosted), Docker (self-hosted)

* **Repo Structure:** Turborepo mono-repo (UI app, CLI app, shared packages)

---

## Installation & Setup

For self-hosters:

**Prerequisites:**

* Node.js 18+

* PostgreSQL

* npm or pnpm

**Steps:**

1. Clone repo:  

  ```bash
  git clone https://github.com/yourusername/onecontext.git
  cd onecontext
```

2. Install dependencies:  

  ```bash
  pnpm install
```

3. Configure environment:  

  ```bash
  cp .env.example .env
  # Edit .env with your DB URL, OAuth keys, etc.
```

4. Run migrations:  

  ```bash
  pnpm db:migrate
```

5. Start dev server:  

  ```bash
  pnpm dev
  # Open http://localhost:3000
```

See full setup docs for OAuth, deployment, production

---

## API Documentation

**Authentication:**  

Include your API key in header:  

`Authorization: Bearer YOUR_API_KEY`

**Endpoints:**

* `GET /api/profile/:userId`  

  Fetch user profile (bio, integrations, last_synced)  

  **Example response:**

  ```json
  {
    "bio": "AI engineer and OS maintainer.",
    "integrations": \["x", "github"\],
    "last_synced": "2026-03-01T11:26:40Z"
  }
```

* `PATCH /api/profile/:userId`  

  Update profile fields

* `POST /api/integrations/connect`  

  Start OAuth flow to connect an account

* `GET /api/mcp/context`  

  Retrieve profile context in MCP format for AI tools  

  **Example response:**

  ```json
  {
    "context": "Jane Doe, founder at Acme, shipping AI infra. Recent: Launched OneContext, tweeted ...",
    "last_synced": "2026-03-01T11:26:40Z"
  }
```

---

## MCP Integration Guide

Want instant integration with Claude, OpenClaw, and any MCP-compatible AI tool?

**1. Install MCP server:**

```bash
npm install -g @onecontext/mcp-server
```

**3. Configure your AI tool:**

*Claude config (*`~/.claude/config.json`*):*

```json
{
  "contextServer": "http://localhost:5555",
  "apiKey": "YOUR_API_KEY"
}
```

*OpenClaw config:*

```yaml
context_server: http://localhost:5555
api_key: YOUR_API_KEY
```

**4. Restart your tool:**  

Done—your identity & context loads automatically.

> **Tip:** MCP is the easiest way to connect Claude and OpenClaw.

---

## Contributing

We ♥️ open source contributors!  

Ways to help:

* Report bugs via GitHub Issues

* 

* 

* Add integrations (plugin system is designed for this)

* Improve documentation

**Development setup:**

* Install dependencies, configure `.env`, run migrations (see Installation above)

* Run tests: `pnpm test`

* Lint: `pnpm lint`

* Build: `pnpm build`

* All PRs must pass CI (Prettier + ESLint)

---

## Roadmap

* **Current (v0.1):**  

  X and GitHub integrations, MCP server, REST API, hosted option, Docker self-host

* **Next (v0.2 – 4 weeks):**  

  Notion integration, CLI for AI automations, Webhook support, Team profiles

* **Future:**  

  Calendar sync, Linear integration, GraphQL API, Browser extension

* **Community requests:**  

---

## FAQ

**Q: Is my data secure?**  

A: Yes. Tokens are encrypted at rest. We enforce row-level security. You can also self-host for full control. It's all open source—inspect everything.

**Q: How much does it cost?**  

A:

* Free tier: 2 integrations, manual updates

* Pro ($9/mo): Unlimited integrations, auto-sync, priority support

* Self-host: Always free

**Q: Which AI tools does this work with?**  

A: Any supporting MCP (Claude, OpenClaw) or REST API (ChatGPT plugins, custom agents, etc.)

**Q: Can I add my own integrations?**  

A: Yes! Use our plugin system—see docs/integrations.

**Q: What happens if I delete my account?**  

A: Data is deleted immediately, with no backups or retention.

---

## Community & Support

* 

* 

* 

* 

* 

We’re developers building for developers—feedback always welcome!

---

## License & Credits

**License:** Apache 2.0 — free to use, modify, and distribute. See LICENSE file.

**Credits:** Made by \[your name/team\], inspired by the pain of AI tool setup. Thanks to Anthropic (MCP), Vercel (design inspiration), shadcn (UI), and the open source community.

---

**Star the repo if OneContext saves you hours!** Contributions always welcome.