# OneContext Implementation Plan

## Architecture Overview

### Current State
OneContext already has a solid monorepo foundation:
- **apps/web** — Next.js 16.1.1 app with landing page, Providers (React Query, next-themes, Sonner)
- **apps/cli** — CLI placeholder (scaffolded, not implemented)
- **packages/api** — Hono API with health + auth routes, CORS/auth/logger middleware, Scalar docs
- **packages/auth** — BetterAuth with GitHub + Twitter OAuth, API keys (`octx_` prefix), magic links, email/password, `onboardingComplete` field on User
- **packages/database** — Prisma 7, PostgreSQL, User/Session/Account/Verification/Apikey models
- **packages/storage, mail, logs, utils, tasks, integrations** — Scaffolded packages
- **config/** — Centralized app config (`redirectAfterSignIn: "/app"`, themes, rate limits)
- **shadcn components installed**: button, card, input, separator, sheet, sidebar, skeleton, tooltip

### What We're Building
A 6-page authenticated app shell with AI chat, memory management, source integrations, and API key management — plus the MCP server package that makes it all consumable externally. Pattern adapted from Postel v2 but significantly simplified for OneContext's domain.

### Cross-Cutting Concerns: Brand & Styling

All UI work across all checkpoints must follow the brand guide:
- **Colors**: Emerald-700 (`#047857`) as primary accent for CTAs, active states, links. White-dominant backgrounds. Dark mode: near-black `#0A0A0A`/`#18181B`.
- **Typography**: Inter for UI, Instrument Serif for display headings (both already loaded in root layout).
- **Icons**: Lucide icons exclusively.
- **Spacing**: 8px grid system.
- **Motion**: Framer Motion — 100-150ms hover transitions, 200-300ms layout transitions. Subtle, functional animations only.
- **Dark mode**: Support both light and dark themes (already configured in Providers via next-themes).
- **Components**: Style shadcn components to match brand — emerald-700 primary buttons, white cards with subtle gray borders/shadows.

### Package Structure

```
packages/
├── ai/                  <- NEW: AI SDK config, models, prompts
│   ├── index.ts         — Re-exports from ai SDK + local modules
│   ├── models.ts        — AI Gateway model config (import { gateway } from 'ai')
│   └── prompts/
│       ├── index.ts
│       └── chat-agent.ts — OneContext chat agent system prompt
│
├── ai-chat/             <- NEW: Chat orchestrator + tools
│   ├── index.ts
│   ├── src/
│   │   ├── types.ts
│   │   ├── services/
│   │   │   ├── chat-orchestrator.ts  — streamText + tool execution + message persistence
│   │   │   └── chat.ts              — Chat CRUD (list, get, create, delete)
│   │   └── tools/
│   │       ├── index.ts
│   │       ├── add-memory.ts        — Tool: add knowledge/memory to Mem0
│   │       ├── search-memories.ts   — Tool: semantic search user's memories
│   │       ├── list-sources.ts      — Tool: list connected sources
│   │       └── web-search.ts        — Tool: Tavily web search
│
├── mem0/                <- NEW: Mem0 SDK wrapper
│   ├── index.ts
│   ├── client.ts        — Thin wrapper around mem0ai SDK (add, search, get, getAll, update, delete, history)
│   └── package.json
│
├── mcp-server/          <- NEW: MCP server package (core product deliverable)
│   ├── index.ts
│   ├── server.ts        — MCP server exposing user profile, memories, sources
│   └── package.json
│
├── api/                 <- MODIFY: Add AI + memories + sources routes
│   └── src/routes/
│       ├── ai.ts        — Chat CRUD + streaming endpoint
│       ├── memories.ts  — Memory CRUD + search
│       ├── sources.ts   — Source connection status
│       ├── dashboard.ts — Aggregated stats
│       └── profile.ts   — Public profile endpoint (for MCP consumers)
│
├── database/            <- MODIFY: Add Chat, ChatMessage, Source, PinnedMemory models
│   └── prisma/schema.prisma
│
├── integrations/        <- MODIFY: Source adapter framework
│   ├── registry.ts
│   ├── types.ts
│   ├── _template/
│   ├── twitter/
│   └── github/
│
├── tasks/               <- MODIFY: Trigger.dev scheduled sync tasks
│   └── src/
│       └── sync-sources.ts — Scheduled background sync for connected sources
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     apps/web (Next.js 16)                    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Dashboard │  │   Chat   │  │ Sources  │  │ Memories │  │
│  │   Page    │  │   Page   │  │   Page   │  │   Page   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │              │              │              │         │
│       │         AssistantUI         │              │         │
│       │    + useChatRuntime         │              │         │
│       │    + AssistantChatTransport │              │         │
│       │              │              │              │         │
│       └──────────────┼──────────────┼──────────────┘         │
│                      │              │                         │
│  ┌───────────────────▼──────────────▼────────────────────┐  │
│  │              /api/* catch-all → Hono                    │  │
│  └───────────────────┬──────────────┬────────────────────┘  │
└──────────────────────┼──────────────┼────────────────────────┘
                       │              │
          ┌────────────▼──┐    ┌──────▼──────┐
          │  packages/api │    │  packages/  │
          │  (Hono routes)│    │  ai-chat    │
          └──────┬────────┘    └──────┬──────┘
                 │                     │
        ┌────────▼────────┐   ┌───────▼──────┐
        │  packages/      │   │  packages/   │
        │  database       │   │  mem0        │
        │  (Prisma/PG)    │   │  (mem0ai SDK)│
        └─────────────────┘   └──────────────┘
```

### Key Design Decisions

1. **No organizations** — OneContext is per-user, not multi-tenant. Simplifies routing and data access significantly vs Postel.
2. **No LangChain/Langfuse** — Prompts stored inline in `packages/ai/prompts/`. No observability layer for MVP.
3. **No Redis** — No token usage tracking for MVP. Can add later.
4. **Mem0 for all memory** — All user knowledge goes through Mem0 API via official `mem0ai` SDK. No custom vector DB.
5. **Simplified tools** — 4 tools (addMemory, searchMemories, listSources, webSearch) vs Postel's 6 domain-specific tools.
6. **shadcn Sidebar** — Already installed. Use the shadcn sidebar component (not Postel's custom NavBar).
7. **AssistantUI + AI SDK v6** — `@assistant-ui/react` + `useChatRuntime` + `AssistantChatTransport` pattern. Gateway built into `ai` package — no separate provider packages needed.
8. **Chat persistence** — Same pattern as Postel: messages saved to PostgreSQL, loaded on revisit.
9. **ThreadListSidebar** — Use assistant-ui's built-in `ThreadListSidebar` component for chat history instead of custom sidebar.
10. **Trigger.dev for background sync** — Use the already-scaffolded `packages/tasks` for scheduled source syncing.

### Key Simplifications vs Postel

| Aspect | Postel | OneContext |
|--------|--------|-----------|
| Multi-tenancy | Organizations + slugs | Per-user only |
| Navigation | Custom NavBar component | shadcn Sidebar |
| AI Tools | 6 domain-specific (generatePost, refinePost, etc.) | 4 generic (addMemory, searchMemories, listSources, webSearch) |
| Prompts | Langfuse-managed with versioning | Inline in prompts/ directory |
| Observability | Langfuse + OpenTelemetry | Console logging only |
| Token tracking | Redis sliding window | None for MVP |
| Chat UI | Complex with post editor panel, context sidebar, viral tweets | Clean chat with ThreadListSidebar, no side panels |
| Chat runtime | `useChat` + `useAISDKRuntime` (legacy) | `useChatRuntime` + `AssistantChatTransport` (current) |
| i18n | next-intl | None |
| Payments | Stripe integration | None for MVP |

---

## Implementation Checkpoints

### Checkpoint 1: App Shell + Onboarding — Sidebar, Layout, Routing, First-Time Flow

**Goal**: Authenticated app shell with working sidebar navigation to all 6 pages (placeholder content). First-time users see an onboarding wizard. User can sign in, see sidebar, navigate between pages.

**What gets built**:
- Route group `app/(app)/` with authenticated layout
- Sidebar component using shadcn `<Sidebar>` with 6 nav items (Dashboard, Chat, Sources, Memories, API & MCP, Settings)
- Layout with `<SidebarProvider>` + `<SidebarInset>` pattern
- 6 page routes with placeholder cards: `/dashboard`, `/chat`, `/sources`, `/memories`, `/api-keys`, `/settings`
- Auth guard redirecting unauthenticated users to `/auth/login`
- Login + signup pages (GitHub + Twitter OAuth, email/password)
- Session provider and query client setup
- User menu in sidebar footer (avatar, name, logout)
- **Onboarding wizard** for first-time users (uses existing `onboardingComplete` field on User):
  - Step 1: "Tell us about yourself" — name, role/title, bio
  - Step 2: "Connect your first source" — Twitter/GitHub OAuth buttons
  - Step 3: Dashboard with MCP setup guide callout
- Update `config.redirectAfterSignIn` from `"/app"` to `"/dashboard"`

**Key files created/modified**:
```
apps/web/app/(app)/layout.tsx                    — Authenticated layout with sidebar
apps/web/app/(app)/dashboard/page.tsx            — Dashboard placeholder
apps/web/app/(app)/chat/page.tsx                 — Chat placeholder
apps/web/app/(app)/sources/page.tsx              — Sources placeholder
apps/web/app/(app)/memories/page.tsx             — Memories placeholder
apps/web/app/(app)/api-keys/page.tsx                  — API & MCP placeholder
apps/web/app/(app)/settings/page.tsx             — Settings placeholder
apps/web/app/(app)/onboarding/page.tsx           — Onboarding wizard
apps/web/app/(auth)/layout.tsx                   — Auth layout (centered card)
apps/web/app/(auth)/login/page.tsx               — Login page
apps/web/app/(auth)/signup/page.tsx              — Signup page
apps/web/modules/shared/components/app-sidebar.tsx — Main sidebar component
apps/web/modules/shared/components/user-menu.tsx   — User menu dropdown
apps/web/modules/shared/components/onboarding/onboarding-wizard.tsx
apps/web/modules/shared/components/onboarding/onboarding-step-profile.tsx
apps/web/modules/shared/components/onboarding/onboarding-step-sources.tsx
apps/web/modules/shared/hooks/use-session.ts       — Session hook
apps/web/modules/shared/lib/api.ts                 — Auth API client
config/index.ts                                    — Update redirectAfterSignIn to "/dashboard"
```

**Postel files to reference**:
- `postel-v2/apps/web/modules/saas/shared/components/nav-bar.tsx` — Navigation structure and menu items
- `postel-v2/apps/web/app/(saas)/app/layout.tsx` — App layout with session prefetching
- `postel-v2/apps/web/app/(saas)/auth/` — Auth pages

**What user can test**:
- Visit `/` → see landing page
- Visit `/dashboard` → redirected to `/login` if not authenticated
- Sign in with GitHub/Twitter → first-time users see onboarding wizard
- Complete onboarding → redirected to `/dashboard`
- Returning users → go directly to `/dashboard`
- Click each sidebar item → navigates to correct page with placeholder content
- Sidebar highlights active page
- User menu shows name/avatar, logout works
- Dark mode toggle works

---

### Checkpoint 2: AI Package + Chat Page (AssistantUI + AI SDK v6)

**Goal**: Working AI chat page where users can have conversations with the OneContext assistant. Messages stream in real-time. Chat history persists across page refreshes. Built-in thread list sidebar for managing conversations.

**What gets built**:
- `packages/ai` — AI SDK config with gateway (built into `ai` package), model definitions, system prompt
- `packages/ai-chat` — Chat orchestrator with `streamText`, message persistence, web search tool
- Hono API routes: `POST /api/ai/chat` (streaming), `GET /api/ai/chats`, `GET /api/ai/chats/:id`, `DELETE /api/ai/chats/:id`
- Database models: `Chat`, `ChatMessage` added to Prisma schema
- AssistantUI components: thread, markdown-text (or streamdown), tool-fallback
- Chat runtime provider with `useChatRuntime` + `AssistantChatTransport`
- Chat page with thread, composer, greeting/empty state
- **ThreadListSidebar** from assistant-ui for chat history (replaces custom sidebar)
- **Web search tool** (Tavily) — available from the start so chat is immediately useful
- **Auto chat title generation** — after 2nd user message, generate a 3-5 word title via gateway model (cached on Chat record)

**Key files created/modified**:
```
packages/ai/index.ts                              — AI SDK re-exports
packages/ai/models.ts                             — import { gateway } from 'ai'; gateway('anthropic/claude-sonnet-4-5')
packages/ai/prompts/chat-agent.ts                 — OneContext system prompt
packages/ai/prompts/index.ts
packages/ai/package.json

packages/ai-chat/index.ts
packages/ai-chat/src/types.ts                     — ChatMetadata, ChatStreamOptions
packages/ai-chat/src/services/chat-orchestrator.ts — handleChatRequest + createChatStream
packages/ai-chat/src/services/chat.ts             — Chat CRUD operations
packages/ai-chat/src/tools/index.ts               — Tool exports
packages/ai-chat/src/tools/web-search.ts          — Tavily web search tool
packages/ai-chat/src/services/title.ts            — Auto-generate chat title after 2nd message
packages/ai-chat/package.json

packages/api/src/routes/ai.ts                     — Chat API routes
packages/database/prisma/schema.prisma            — Chat + ChatMessage models

apps/web/modules/ui/components/assistant-ui/thread.tsx
apps/web/modules/ui/components/assistant-ui/markdown-text.tsx
apps/web/modules/ui/components/assistant-ui/tool-fallback.tsx
apps/web/modules/ui/components/assistant-ui/tooltip-icon-button.tsx

apps/web/modules/shared/components/chat/chat-runtime-provider.tsx  — useChatRuntime + AssistantChatTransport
apps/web/modules/shared/components/chat/chat-thread.tsx
apps/web/modules/shared/components/chat/chat-greeting.tsx
apps/web/modules/shared/components/chat/ai-chat.tsx
apps/web/modules/shared/components/chat/chat-header.tsx
apps/web/modules/shared/lib/chat-api.ts           — React Query hooks for chat

apps/web/app/(app)/chat/page.tsx                  — Full chat page
```

**Note**: Use assistant-ui's built-in `ThreadListSidebar` component (install via `npx shadcn@latest add "https://r.assistant-ui.com/threadlist-sidebar"`). This replaces the need for custom `chat-sidebar.tsx` and `chat-sidebar-item.tsx`.

**Postel files to reference**:
- `postel-v2/packages/ai/` — Entire package structure (models.ts, index.ts)
- `postel-v2/packages/ai-chat/src/services/chat-orchestrator.ts` — Core streaming logic
- `postel-v2/packages/ai-chat/src/services/chat.ts` — Chat CRUD
- `postel-v2/packages/api/src/routes/ai.ts` — API route structure
- `postel-v2/apps/web/modules/saas/chat/components/chat-runtime-provider.tsx` — Runtime setup (update to new pattern)
- `postel-v2/apps/web/modules/ui/components/assistant-ui/` — All assistant-ui components

**New dependencies to install**:
```
apps/web:     @assistant-ui/react @assistant-ui/react-ai-sdk @assistant-ui/react-markdown remark-gfm
packages/ai:  ai zod
packages/ai-chat: ai nanoid zod @tavily/ai-sdk
```

**Note on dependencies**: The `ai` package v6 includes the gateway function natively — no need for `@ai-sdk/anthropic`, `@ai-sdk/openai`, or `@ai-sdk/react` as separate dependencies. The gateway routes to providers automatically. Title generation uses the same Anthropic model via gateway instead of a separate OpenAI dependency.

**Environment variables needed**:
```
AI_GATEWAY_API_KEY=          # For AI Gateway (or use ANTHROPIC_API_KEY directly)
TAVILY_API_KEY=              # For web search tool
```

**Known issue**: There's a [GitHub issue #2925](https://github.com/assistant-ui/assistant-ui/issues/2925) about `AssistantRuntimeProvider` with Next.js 16 + React 19.2 causing "Resource updated before mount" errors. Monitor and apply workaround if needed.

**What user can test**:
- Navigate to `/chat` → see greeting and suggestions
- Type a message → get streaming AI response
- Markdown renders correctly in responses
- Start new chat, switch between chats via ThreadListSidebar
- Refresh page → chat history loads from DB
- Delete a chat from sidebar
- Web search: ask "What's trending in AI?" → get results from Tavily
- Chat title auto-updates after 2nd message (e.g., "AI Trends Discussion")

---

### Checkpoint 3: Mem0 Integration + Memories Page

**Goal**: Mem0 connected for memory storage via official SDK. Chat assistant can add/search memories. Memories page shows all memories with search, filtering, and category support.

**What gets built**:
- `packages/mem0` — Thin wrapper around `mem0ai` SDK (MemoryClient)
- AI chat tools: `addMemory` (extracts and stores knowledge), `searchMemories` (semantic search)
- Updated system prompt to use memory tools
- Memories page: list all memories, search bar, source filter, category filter
- Memory cards with source icon, content preview, categories, timestamp, actions (edit, delete, pin)
- Memory detail view (modal or expandable card) with history
- `PinnedMemory` model in Prisma for local pin tracking (Mem0 has no native pin)
- API routes: `GET /api/memories`, `GET /api/memories/search`, `PUT /api/memories/:id`, `DELETE /api/memories/:id`

**Key files created/modified**:
```
packages/mem0/index.ts
packages/mem0/client.ts                           — Wrapper around mem0ai MemoryClient
packages/mem0/package.json                        — depends on mem0ai

packages/ai-chat/src/tools/add-memory.ts          — Tool definition with zod schema
packages/ai-chat/src/tools/search-memories.ts     — Tool definition with zod schema
packages/ai-chat/src/tools/index.ts               — Updated exports
packages/ai/prompts/chat-agent.ts                 — Updated with memory tool docs

packages/api/src/routes/memories.ts               — Memory API routes
packages/database/prisma/schema.prisma            — PinnedMemory model

apps/web/modules/shared/components/memories/memory-list.tsx
apps/web/modules/shared/components/memories/memory-card.tsx
apps/web/modules/shared/components/memories/memory-search.tsx
apps/web/modules/shared/components/memories/memory-filters.tsx
apps/web/modules/shared/lib/memories-api.ts       — React Query hooks

apps/web/modules/shared/components/chat/tools/add-memory-tool-ui.tsx
apps/web/modules/shared/components/chat/tools/search-memories-tool-ui.tsx

apps/web/app/(app)/memories/page.tsx              — Full memories page
```

**Mem0 SDK usage notes** (from research):
- Use `mem0ai` npm package with `MemoryClient` (Platform client)
- Auth: `Token <api-key>` format (SDK handles automatically)
- `MEM0_ORG_ID` is NOT needed — resolved from API key automatically
- `add()` is **async** — returns immediately with pending status, extraction happens in background. Tool UI should show "Processing..." state.
- Use `metadata.source` for integration source tracking (e.g., `{ source: "twitter" }`)
- Use `categories` field (first-class array) for semantic categorization (e.g., `["projects", "preferences", "skills"]`)
- Filtering supports `AND`/`OR`/`NOT` with operators: `eq`, `ne`, `in`, `contains`, `gt`, `gte`, `lt`, `lte`
- Memory pinning: use `metadata.pinned: true` + local `PinnedMemory` table for fast lookups
- `history()` method available for showing how a memory changed over time

**New dependencies**:
```
packages/mem0: mem0ai
```

**Environment variables needed**:
```
MEM0_API_KEY=                # Mem0 Platform API key (only key needed)
```

**What user can test**:
- In chat: "I'm building OneContext with Next.js and Mem0" → assistant adds memories (tool UI shows "Processing..." then confirms)
- In chat: "What do you know about my projects?" → assistant searches and returns memories
- Tool UI shows: "Adding memory..." → "Memory stored" or "Found 3 memories matching..."
- Navigate to `/memories` → see all stored memories
- Search memories by keyword (semantic search)
- Filter by source (manual, twitter, github) and category
- Pin/unpin a memory
- Edit a memory's content
- View memory history (how it changed over time)
- Delete a memory

---

### Checkpoint 4: Sources & Integrations Framework + Sources Page + Background Sync

**Goal**: Pluggable integration framework. Sources page shows connected/available integrations. OAuth connection flow works for GitHub and Twitter (already configured in BetterAuth). Scheduled background sync via Trigger.dev.

**What gets built**:
- `packages/integrations` — Integration registry, types, adapter interface, template
- Twitter adapter: pulls last 50 tweets → stores as ContentItems in PG → sends to Mem0 for semantic indexing
- GitHub adapter: pulls profile bio + top 10 repos → stores as ContentItems → sends to Mem0
- Source model in database (tracks connected sources, sync status, memory count)
- **ContentItem model** — local storage for all imported content (raw platform data). Enables fast structured queries (e.g., "my tweets by engagement") without hitting Mem0. Mem0 handles semantic search; ContentItem handles listing/filtering/stats.
- Sync strategy: incremental sync (only content newer than `lastSyncAt`), rate limit handling per provider
- Sources page UI: connected sources (cards with status, sync button, disconnect), available sources (connect buttons)
- Available sources: Twitter, GitHub, LinkedIn (placeholder), Notion (placeholder), YouTube (placeholder), Substack (placeholder)
- Manual entry section (add note, add project, upload file)
- Chat tool: `listSources` — shows user's connected sources
- **Trigger.dev scheduled sync** — Background task for daily auto-sync of connected sources
- Sync preference stored on User model (auto-sync on/off)
- API routes: `GET /api/sources`, `POST /api/sources/:provider/sync`, `DELETE /api/sources/:provider`

**Key files created/modified**:
```
packages/integrations/types.ts                    — IntegrationAdapter interface
packages/integrations/registry.ts                 — Registration + lookup
packages/integrations/_template/adapter.ts
packages/integrations/_template/sync.ts
packages/integrations/twitter/adapter.ts
packages/integrations/twitter/sync.ts
packages/integrations/github/adapter.ts
packages/integrations/github/sync.ts
packages/integrations/package.json

packages/tasks/src/sync-sources.ts                — Trigger.dev scheduled sync task
packages/database/prisma/schema.prisma            — Source + ContentItem models + syncEnabled on User

packages/ai-chat/src/tools/list-sources.ts
packages/api/src/routes/sources.ts

apps/web/modules/shared/components/sources/source-card.tsx
apps/web/modules/shared/components/sources/source-grid.tsx
apps/web/modules/shared/components/sources/available-source-card.tsx
apps/web/modules/shared/components/sources/manual-entry-section.tsx
apps/web/modules/shared/lib/sources-api.ts

apps/web/app/(app)/sources/page.tsx
```

**Postel files to reference**:
- `postel-v2/packages/ai-chat/src/tools/context/list-context.ts` — Tool that lists available data sources
- `postel-v2/apps/web/modules/saas/chat/components/tools/list-context-tool-ui.tsx` — Tool UI for listing

**What user can test**:
- Navigate to `/sources` → see available integrations (Twitter, GitHub, LinkedIn, Notion, YouTube, Substack)
- Click "Connect" on Twitter → OAuth flow → redirected back, source shows as connected
- Click "Sync Now" → triggers sync, pulls tweets into PG + Mem0
- Connected source card shows: last synced time, content count, sync status
- Click "Disconnect" → removes source and its ContentItems
- Manual entry: add a note or project → stored as ContentItem + sent to Mem0
- In chat: "What sources do I have connected?" → assistant lists sources
- Auto-sync runs daily in background for users with sync enabled

---

### Checkpoint 5: Dashboard with Real Data

**Goal**: Dashboard shows a real overview of the user's identity: profile summary, connected sources, quick stats (memory count, source count), recent activity feed, quick actions.

**What gets built**:
- **AI-generated profile summary** — LLM synthesizes a 2-3 sentence bio from Mem0 memories. Generated as a background job after each sync (not on page load). Cached on User model as `profileSummary`.
- Profile summary card (name, generated bio, location, last synced)
- Connected sources strip (small icons with sync status)
- Quick stats bar (total memories, connected sources, categories)
- Recent activity feed (latest ContentItems with source icons and timestamps — queries local PG, not Mem0)
- Quick action buttons: "Add Knowledge" (links to chat), "Copy API Key", "View MCP Setup"
- API route: `GET /api/dashboard` (aggregates stats)

**Key files created/modified**:
```
packages/api/src/routes/dashboard.ts

apps/web/modules/shared/components/dashboard/profile-summary-card.tsx
apps/web/modules/shared/components/dashboard/connected-sources-strip.tsx
apps/web/modules/shared/components/dashboard/quick-stats.tsx
apps/web/modules/shared/components/dashboard/recent-activity.tsx
apps/web/modules/shared/components/dashboard/quick-actions.tsx
apps/web/modules/shared/lib/dashboard-api.ts

apps/web/app/(app)/dashboard/page.tsx
```

**What user can test**:
- Navigate to `/dashboard` → see profile card with name, email, bio
- See connected source icons with green/gray status dots
- See stats: "42 Memories | 2 Sources | 5 Categories"
- Recent activity shows latest 10 memories with source icon and relative timestamp
- Click "Add Knowledge" → navigates to `/chat`
- Click "Copy API Key" → copies API key to clipboard (with toast notification)

---

### Checkpoint 6: API & MCP Page + MCP Server Package + API Key Management

**Goal**: Users can generate/manage API keys, see MCP setup instructions with a working MCP server package, view REST API endpoint docs. Basic usage stats displayed.

**What gets built**:
- **`packages/mcp-server`** — MCP server exposing user profile, memories, and sources as tools/resources. Packaged for `npx` usage.
- API key management: generate, view (masked), copy, revoke (using BetterAuth apiKey plugin)
- MCP server setup instructions (copy-paste config blocks pointing to the real package)
- REST API endpoint list with descriptions
- Basic usage stats: API call count this month (stored in simple counter table or derived from logs)
- Link to full API docs (Scalar at `/api/docs`)
- API routes for key management (already handled by BetterAuth, just need UI)

**Key files created/modified**:
```
packages/mcp-server/index.ts                      — MCP server entry point
packages/mcp-server/server.ts                      — Tool/resource definitions
packages/mcp-server/package.json                   — bin entry for npx

apps/web/modules/shared/components/api/api-key-manager.tsx
apps/web/modules/shared/components/api/mcp-setup-guide.tsx
apps/web/modules/shared/components/api/rest-api-endpoints.tsx
apps/web/modules/shared/components/api/usage-stats.tsx
apps/web/modules/shared/lib/api-keys-api.ts

apps/web/app/(app)/api-keys/page.tsx
```

**Postel files to reference**:
- `postel-v2/apps/web/app/(saas)/app/(organizations)/[organizationSlug]/settings/api-keys/page.tsx`

**What user can test**:
- Navigate to `/api` → see MCP setup guide with config JSON
- Copy MCP config to clipboard
- Generate a new API key → see masked key (`octx_abc...xyz`)
- Copy full API key
- Revoke an API key
- See usage stats: "This month: 1,234 API calls"
- See list of REST API endpoints
- Click "View API Documentation" → opens `/api/docs` (Scalar)
- MCP server package works: `npx @onecontext/mcp-server --api-key octx_...`

---

### Checkpoint 7: Settings Page + Polish

**Goal**: Settings page with profile editing, sync preferences, privacy settings, danger zone. Overall polish pass.

**What gets built**:
- Profile settings: edit name, bio, username (react-hook-form)
- Sync settings: auto-sync frequency toggle (stored on User, controls Trigger.dev schedule)
- Privacy settings: profile visibility toggle
- Danger zone: export all data (JSON download via Mem0 export API + local DB), delete account
- Polish: loading states, error boundaries, empty states, mobile responsive check, toast notifications
- **Sentry** for error tracking in production (apps/web + packages/api)
- Structured request logging middleware (method, path, status, duration, userId)

**Key files created/modified**:
```
packages/ai/prompts/chat-agent.ts                 — Final prompt refinements

apps/web/modules/shared/components/settings/profile-form.tsx
apps/web/modules/shared/components/settings/sync-settings.tsx
apps/web/modules/shared/components/settings/privacy-settings.tsx
apps/web/modules/shared/components/settings/danger-zone.tsx
apps/web/modules/shared/lib/settings-api.ts

apps/web/app/(app)/settings/page.tsx
```

**New dependencies**:
```
apps/web: @sentry/nextjs
```

**What user can test**:
- Navigate to `/settings` → see profile form pre-filled
- Edit name/bio → save → see updated in sidebar and dashboard
- Toggle auto-sync → saved
- Export all data → downloads JSON file (memories from Mem0 export API + chats/sources from DB)
- Delete account → confirmation dialog → account deleted (also calls Mem0 entity delete)
- All pages responsive on mobile
- Loading spinners on data fetches
- Error toasts on failures
- Empty states on pages with no data

---

## Dependencies Summary

### New packages to create:
1. `packages/ai` — AI SDK + models + prompts
2. `packages/ai-chat` — Chat orchestration + tools
3. `packages/mem0` — Mem0 SDK wrapper
4. `packages/mcp-server` — MCP server for external consumption

### New npm dependencies:
```
# apps/web
@assistant-ui/react
@assistant-ui/react-ai-sdk
@assistant-ui/react-markdown
remark-gfm
nuqs                          # URL state management for chat

# packages/ai
ai                            # v6 — includes gateway(), no separate provider packages needed
zod

# packages/ai-chat
ai
nanoid
zod
@tavily/ai-sdk                # Web search tool (Checkpoint 2)

# packages/mem0
mem0ai                        # Official Mem0 SDK

# packages/mcp-server
@modelcontextprotocol/sdk

# apps/web (Checkpoint 7)
@sentry/nextjs
```

### Database schema additions:
```prisma
model Chat {
  id          String        @id @default(cuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String        @default("New Chat")
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  messages    ChatMessage[]

  @@index([userId])
  @@map("chat")
}

model ChatMessage {
  id        String   @id @default(cuid())
  chatId    String
  chat      Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  parentId  String?
  role      String
  parts     Json
  data      Json?
  createdAt DateTime @default(now())

  @@index([chatId])
  @@map("chat_message")
}

model Source {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider    String                          // "twitter", "github", "notion", etc.
  status      String    @default("connected") // "connected", "syncing", "error", "disconnected"
  lastSyncAt  DateTime?
  memoryCount Int       @default(0)
  metadata    Json?                           // Provider-specific data
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([userId, provider])
  @@index([userId])
  @@map("source")
}

model ContentItem {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  sourceId    String
  source      Source   @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  externalId  String                            // Tweet ID, repo name, etc.
  type        String                            // "tweet", "repo", "gist", "note", "post"
  rawData     Json                              // Full original data from platform
  contentDate DateTime                          // When created on platform
  importedAt  DateTime @default(now())

  @@unique([sourceId, externalId])
  @@index([userId])
  @@index([sourceId])
  @@map("content_item")
}

model PinnedMemory {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  memoryId  String                            // Mem0 memory ID
  createdAt DateTime @default(now())

  @@unique([userId, memoryId])
  @@index([userId])
  @@map("pinned_memory")
}
```

### Environment variables:
```
AI_GATEWAY_API_KEY=          # For AI Gateway (or ANTHROPIC_API_KEY directly)
MEM0_API_KEY=                # Mem0 Platform API key
TAVILY_API_KEY=              # For web search tool (Checkpoint 7)
```

### Removed from original plan:
- ~~`OPENAI_API_KEY`~~ — Title generation uses gateway with Anthropic model, no separate OpenAI key needed
- ~~`MEM0_ORG_ID`~~ — Resolved automatically from MEM0_API_KEY
- ~~`@ai-sdk/anthropic`~~ — Gateway handles provider routing
- ~~`@ai-sdk/openai`~~ — Gateway handles provider routing
- ~~`@ai-sdk/react`~~ — `useChatRuntime` from `@assistant-ui/react-ai-sdk` replaces `useChat`

---

## Execution Strategy: Parallelization & Testing

### Checkpoint Status

- [x] **Checkpoint 1**: App Shell + Onboarding (PR #21)
- [ ] **Checkpoint 2**: AI Package + Chat Page
- [ ] **Checkpoint 3**: Mem0 Integration + Memories Page
- [ ] **Checkpoint 4**: Sources & Integrations + Sources Page
- [ ] **Checkpoint 5**: Dashboard with Real Data
- [ ] **Checkpoint 6**: API & MCP Page + MCP Server
- [ ] **Checkpoint 7**: Settings Page + Polish

### Parallel Execution Plan

Checkpoints 2-4 have independent backend work that can be built simultaneously. The dependency graph:

```
Wave 1 (parallel — zero deps between them):
├── Stream A: packages/ai + packages/ai-chat + chat API routes
├── Stream B: packages/mem0 + memory API routes
├── Stream C: packages/integrations (types, registry, adapters) + sources API routes
└── Shared:   Prisma schema (all new models in one migration)

Wave 2 (parallel — depends on Wave 1 backends):
├── Stream A: Chat UI (AssistantUI components, chat page, ThreadListSidebar)
├── Stream B: Memories UI (page, cards, filters, search) + chat tools (addMemory, searchMemories)
└── Stream C: Sources UI (page, cards, connect flow) + chat tool (listSources)

Wave 3 (sequential — depends on Wave 2):
├── CP5: Dashboard (aggregates stats from memories, sources, chats)
├── CP6: MCP server package + API key management UI
└── CP7: Settings page + polish pass
```

**Key insight**: The Prisma schema should be updated once with ALL new models (Chat, ChatMessage, Source, ContentItem, PinnedMemory) before starting any Wave 1 stream. This avoids multiple migration conflicts.

### Test Strategy

Pragmatic, low-maintenance tests that catch real regressions. No aim for coverage %, just protect core contracts.

#### 1. API Route Tests (~10 tests) — Vitest + Hono `app.request()`
No HTTP server needed. Highest value, lowest effort.

```
GET  /api/health                    → 200
POST /api/ai/chat                   → 401 without auth
GET  /api/ai/chats                  → 401 without auth
GET  /api/ai/chats                  → 200 + empty array for authed user
GET  /api/memories                  → 401 without auth
GET  /api/memories/search?q=test    → 401 without auth
GET  /api/sources                   → 401 without auth
POST /api/sources/unknown/sync      → 404 for unknown provider
GET  /api/dashboard                 → 401 without auth
```

#### 2. Package Unit Tests (~15 tests) — Vitest
Test package contracts with mocked dependencies.

```
packages/mem0:
  - client.add() calls SDK with correct params
  - client.search() passes filters correctly
  - client.delete() calls correct endpoint

packages/ai-chat/tools:
  - web-search tool schema validates correctly
  - add-memory tool schema validates correctly
  - search-memories tool schema validates correctly

packages/integrations:
  - registry.register() + registry.get() roundtrips
  - registry.get() returns undefined for unknown provider
  - registry.list() returns all registered adapters

config:
  - config shape snapshot (catches accidental breakage)
```

#### 3. Schema Validation — CI step (no custom code)
```bash
pnpm --filter @onecontext/database generate  # fails if schema is invalid
```

#### 4. Smoke E2E (3 tests) — Playwright
```
- Landing page loads, has "Get Started" CTA
- /dashboard redirects to /login when unauthenticated
- /login page renders with OAuth buttons and email form
```

#### What we deliberately skip
- React component unit tests (too much mocking for shadcn wrappers)
- Full OAuth E2E (flaky in CI, BetterAuth handles correctness)
- Chat streaming tests (hard to test SSE, trust AI SDK)
- Mem0 integration tests (requires live API key)

---

### Post-MVP considerations (not in scope):
- Browser extension for knowledge capture
- CLI app (`apps/cli` is scaffolded)
- Dockerfile / self-hosting guide
- Calendar integration as a source
- Stripe payments / usage-based billing
- Langfuse observability
- Redis for rate limiting / token tracking
