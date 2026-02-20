# CLI — CLAUDE.md

## Overview

The OneContext CLI (`onecontext`) is a standalone npm package that talks to the OneContext API over HTTP. It has zero `@onecontext/*` workspace dependencies — it's a pure HTTP client using `fetch`, `commander`, `chalk`, and `ora`.

Auth is via API key (`octx_` prefix) stored at `~/.onecontext/config.json`.

## File Structure

```
apps/cli/src/
  index.ts                          # Entry point, commander program, version from package.json
  lib/
    config.ts                       # ~/.onecontext/config.json read/write (dir 0o700, file 0o600)
    api-client.ts                   # fetch wrapper — adds Bearer auth, handles 401/204
    output.ts                       # printTable, printJson, createSpinner, printError/Success/Warning
  commands/
    login.ts                        # Store API key after validation against /api/dashboard
    logout.ts                       # Clear config file
    whoami.ts                       # Show current user info
    dashboard.ts                    # GET /api/dashboard — profile + stats
    billing.ts                      # GET /api/billing/subscription, POST /api/billing/portal
    memories/
      index.ts                      # Parent command, registers subcommands
      list.ts                       # GET /api/memories
      search.ts                     # GET /api/memories/search?q=
      add.ts                        # POST /api/memories
      update.ts                     # PUT /api/memories/:id
      delete.ts                     # DELETE /api/memories/:id
      pin.ts                        # POST /api/memories/:id/pin
      unpin.ts                      # DELETE /api/memories/:id/pin
    sources/
      index.ts                      # Parent command
      list.ts                       # GET /api/sources
      connect.ts                    # POST /api/sources/:provider/connect
      sync.ts                       # POST /api/sources/:provider/sync
      disconnect.ts                 # DELETE /api/sources/:provider
    settings/
      index.ts                      # Parent command
      update.ts                     # PUT /api/settings/profile
      sync.ts                       # PUT /api/settings/sync
      export.ts                     # GET /api/settings/export
      delete-account.ts             # DELETE /api/settings/account
```

## Command Tree

```
onecontext login [--api-key <key>] [--api-url <url>]
onecontext logout
onecontext whoami [--json]
onecontext memories list [--json]
onecontext memories search <query> [--filters <json>] [--json]
onecontext memories add <content> [--categories <cat1,cat2>]
onecontext memories update <id> <content>
onecontext memories delete <id> [--force]
onecontext memories pin <id>
onecontext memories unpin <id>
onecontext sources list [--json]
onecontext sources connect <provider>
onecontext sources sync <provider>
onecontext sources disconnect <provider> [--force]
onecontext settings update --name "..." --summary "..."
onecontext settings sync --enable|--disable
onecontext settings export [--output <file>]
onecontext settings delete-account
onecontext dashboard [--json]
onecontext billing [status] [--json]
onecontext billing portal [--json]
```

## Conventions

- **ESM-only**: `"type": "module"` in package.json, `module: "NodeNext"` in tsconfig
- **All imports use `.js` extensions** (required for NodeNext module resolution)
- **No workspace deps**: The CLI ships as a standalone npm package
- **Command pattern**: Each command file exports `register*Command(parent: Command)` that adds a subcommand to the parent
- **API paths**: All `apiRequest()` calls use full paths starting with `/api/` (e.g., `/api/memories`, `/api/dashboard`)
- **Error handling**: Commands catch `ApiError` for HTTP errors. The api-client auto-exits on 401 with a login prompt.
- **Destructive actions**: `delete` and `disconnect` prompt for confirmation unless `--force` is passed. `delete-account` requires typing "DELETE".

## Publishing to npm

### First-time setup

```bash
npm login
```

### Publish

```bash
cd apps/cli
pnpm build
npm publish
```

Users can then:

```bash
# Run without installing
npx octx login

# Or install globally
npm install -g octx
onecontext login
```

### Version bump + publish

```bash
cd apps/cli
npm version patch   # or minor / major
pnpm build
npm publish
```

### CI publish (GitHub Actions)

Add an `NPM_TOKEN` secret to the repo, then trigger on version tags:

```yaml
# .github/workflows/publish-cli.yml
name: Publish CLI
on:
  push:
    tags: ["cli-v*"]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter octx build
      - run: cd apps/cli && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Tag a release with `git tag cli-v0.1.0 && git push --tags`.
