# OneContext: Universal AI Identity & Memory Platform - Product Brief

---

## tl;dr

OneContext eliminates the pain of repeatedly setting up your identity and context across AI tools such as ChatGPT, Claude, OpenClaw, Cursor, and more. It’s a universal AI identity platform that auto-syncs your digital footprint—pulling from X (Twitter), GitHub, Notion, and calendar—to create one profile that plugs into any AI via the Model Context Protocol (MCP), REST API, or a browser extension. Open source with a paid hosted option and built to capture the current OpenClaw momentum wave, OneContext is the “set-it-once, use-everywhere” identity system for AI.

---

## Goals

\[No changes—section maintained as instructed.\]

---

## User Stories

\[No changes—section maintained as instructed.\]

---

## Functional Requirements

\[No changes—section maintained as instructed.\]

---

## User Experience

\[No changes—section maintained as instructed.\]

---

## Narrative

\[No changes—section maintained as instructed.\]

---

## Success Metrics

\[No changes—section maintained as instructed.\]

---

## Technical Considerations

\[No changes—section maintained as instructed.\]

---

## Architecture

* **Monorepo**: Turbo Repo structure (copy from Postel, drop chatbot pipeline)

* **Apps**: UI (Next.js 16, see Postel), CLI (minimal), MCP server (honojs, see Postel)

* **API**: HonoJS for MCP, public, and private endpoints (inspired by Postel API organization)

* **Integrations**: Source adapters—each new integration is a drop-in file (plugin model for easy extension, per Postel pattern)

* **Memory/RAG**: Mem0 powers all user context and semantic search for RAG; all memory storage and retrieval handled via Mem0 client (reference Mem0 usage in Postel)

* **Function Calling/Tools**: Use Vercel AI SDK’s tool API (see Postel project) for agent function calls and integration logic

* **Self-host**: Official Dockerfile, one-command deploy, modular adapters

---

## UI Architecture

* **Framework:** Next.js 16, copying structure/components from Postel project for rapid delivery

* **Component Library:** shadcn/ui

* **Styling:** Tailwind CSS

* **Chat Interface:** **AssistantUI–replica of Postel’s chat/assistant interface** using Vercel AI SDK and Vercel AI Gateway as the backend (copy flows/UX from Postel for chat agent throughout OneContext)

* **State Management:** React Query (TanStack) for cache/server state, Zustand for UI state

* **Animations:** Framer Motion

* **Responsive:** Mobile-first

* **Accessibility:** Full WCAG 2.1 AA compliance (as in Postel)

* **Extensible Integrations:** “Add Integration” creates new source adapter file—minimal config, instant UI availability (plugin pattern, as seen in Postel)

---

## Chat Agent UI

* **AssistantUI (copied from Postel):** AI-driven chat assistant as a persistent sidebar button (“Add Knowledge”) or a dedicated /chat page.

* **Entry points:** Big sidebar button or command palette opens AssistantUI as a drawer/modal; chat agent can add/edit data, connect integrations, or answer questions, using natural language.

* **Integration with Mem0:** Any submitted knowledge, notes, or bulk imports via chat are immediately persisted as semantic memories in Mem0.

* **UI/UX behaviors, onboarding, error handling, and clarification flows:** Directly reference and copy AssistantUI and agent flows from Postel project for consistency and speed.

---

## Tool & Function Implementation

* **Tools:** All assistant actions (add project/memory, connect integration, edit profile, semantic search) exposed as functions/tools using Vercel AI SDK’s “tools” API—reuse and adapt all tool design from Postel.

* **Backend:** Vercel AI Gateway proxies and rate-limits chat/completion requests (as in Postel).

* **Extensibility:** Function calling is abstracted; adding a new capability/adapter requires only a new tool definition—quick to extend as more service integrations are built out.

---

## API & Backend

* **Framework:** Next.js API routes, with plans to migrate higher volume endpoints to HonoJS (MCP/public/private APIs) as done in Postel

* **Database:** PostgreSQL via Supabase

* **ORM:** Prisma

* **Auth:** BetterAuth (reference Postel)

* **Hosting:** Vercel (UI/API), Supabase (DB)

* **Key Endpoints:** \[kept unchanged, see original\]

* **MCP Server:** Packaged as npm package, public/private APIs implemented with HonoJS per Postel project pattern

---

## Performance & Scalability

\[No changes—section maintained as instructed.\]

---

## Integration Points

---

**All technical architecture and UI patterns should be implemented by default as seen in Postel project, including AssistantUI, Vercel AI SDK tool abstraction, and easy/extensible integration adapters.**