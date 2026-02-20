# octx

OneContext CLI — manage your AI identity from the terminal.

[OneContext](https://onecontext.dev) is a universal AI identity platform. One auto-updating profile that syncs from X, GitHub, Notion and is consumable via MCP or REST API.

## Install

```bash
npm install -g octx
```

Or run directly:

```bash
npx octx login
```

## Quick Start

```bash
# Authenticate with your API key (get one at https://onecontext.dev/settings)
octx login

# Check your profile
octx whoami

# Add a memory
octx memories add "I prefer TypeScript for backend development"

# Search your memories
octx memories search "programming languages"

# View your dashboard
octx dashboard
```

## Commands

```
octx login [--api-key <key>] [--api-url <url>]
octx logout
octx whoami [--json]

octx memories list [--json]
octx memories search <query> [--filters <json>] [--json]
octx memories add <content> [--categories <cat1,cat2>]
octx memories update <id> <content>
octx memories delete <id> [--force]
octx memories pin <id>
octx memories unpin <id>

octx sources list [--json]
octx sources connect <provider>
octx sources sync <provider>
octx sources disconnect <provider> [--force]

octx settings update --name "..." --summary "..."
octx settings sync --enable|--disable
octx settings export [--output <file>]
octx settings delete-account

octx dashboard [--json]
octx billing [status] [--json]
octx billing portal [--json]
```

All commands support `--json` for machine-readable output.

## Auth

Run `octx login` and paste your API key. Keys start with `octx_` and can be created at [onecontext.dev/settings](https://onecontext.dev/settings).

Credentials are stored at `~/.onecontext/config.json`.

## License

MIT
