# OneContext: Universal AI Identity & Memory Platform - Product Brief

---

## tl;dr

OneContext eliminates the pain of repeatedly setting up your identity and context across AI tools such as ChatGPT, Claude, OpenClaw, Cursor, and more. It’s a universal AI identity platform that auto-syncs your digital footprint—pulling from X (Twitter), GitHub, Notion, and calendar—to create one profile that plugs into any AI via the Model Context Protocol (MCP), REST API, or a browser extension. Open source with a paid hosted option and built to capture the current OpenClaw momentum wave, OneContext is the “set-it-once, use-everywhere” identity system for AI.

---

## Goals

### Business Goals

* **Launch MVP within 2–4 weeks**: Release on GitHub and Product Hunt to ride the OpenClaw trend.

* **Capture 500+ GitHub stars in first month** to establish developer traction.

* **Secure 100+ early adopter signups in 2 weeks** to prove need.

* **Validate product-market fit through active user engagement**; target 60%+ activation, 40%+ WAU.

* **Establish an open source community** and gain 10+ code contributors in 3 months.

* **Achieve 20% paid conversion on hosted offering and $5k MRR within 3 months**.

### User Goals

* **Set up AI identity once, not repeatedly across tools.**

* **Have their profile and context always up to date via auto-sync with connected accounts.**

* **Seamlessly use their identity across any AI tool via API, MCP, or extension.**

* **Maintain control and privacy over their data, with ability to self-host or delete.**

* **Minimize onboarding friction and wasted time setting up AI tool after AI tool.**

### Non-Goals

* **Not building another AI chat interface**—this is not a ChatGPT/Claude/OpenClaw clone.

* **Not storing or processing chatbot history**; only handles identity/context, not ongoing chat logs.

* **Not an enterprise knowledge management platform**; focus is on personal identity sync, not org-wide KM.

---

## User Stories

### Primary Persona: AI Power User (developers, founders, creators using 3+ AI tools daily)

* As a power user, I want to set up my AI identity once, so that I don’t have to repeat myself when using new agents or platforms.

* As a power user, I want my digital footprint (X, GitHub) auto-synced, so that my current projects and info stay fresh across all AI tools.

* As a power user, I want to manually edit and curate my profile, so that I can fix or clarify how AI understands me.

* As a power user, I want to export my profile or access it via MCP/API, so that I can plug it into any AI tool in seconds.

* As a power user, I want to review an activity log, so I can see exactly what updates were pulled from integrations.

### Secondary Persona: Privacy-Conscious Developer (wants to self-host, inspect, and control data)

* As a privacy-minded developer, I want a self-hosted OneContext option, so I control where and how my data is stored.

* As a privacy-minded developer, I want to inspect the open source codebase, so I can verify there’s no tracking or data leaks.

* As a privacy-minded developer, I want to bring my own API keys for integrations, so tokens don’t touch managed servers.

* As a privacy-minded developer, I want granular control over data retention and deletion, so I can comply with my own privacy policies.

### Tertiary Persona: OpenClaw Early Adopter (just discovered OpenClaw, frustrated by setup)

* As an OpenClaw user, I want to import my personal context automatically, so I don’t have to fill out my background, projects, and goals yet again.

* As an OpenClaw user, I want my OneContext profile to work instantly with OpenClaw via MCP, so I experience zero friction onboarding.

* As an OpenClaw user, I want guidance on integrating OneContext into my agent’s config, so it “just works.”

* As an OpenClaw user, I want the option to connect more integrations (like Notion) over time, in one unified profile.

---

## Functional Requirements

* **Identity Management (P0)**

  * Profile Creation Form: User enters bio, occupation, goals, interests, ongoing projects.

  * Manual Editing: Allow user to edit their profile at any time.

  * View Profile Dashboard: Display all identity/context fields in one place.

* **Integration Management (P0)**

  * OAuth for X/Twitter and GitHub: Secure flows for connecting accounts.

  * Connection Status Dashboard: Show status (active/error/disconnected) for each integration.

  * Disconnect Capability: User can revoke integration access.

* **Auto-Sync System (P1)**

  * Daily Cron Sync: Automatically update profile from integrations.

  * Activity Log: Timestamped log of which fields were updated, from which source.

  * Last Synced Timestamp: Clear indicator of when each integration was last refreshed.

* **API & Export (P0)**

  * MCP Server Implementation: Serve context following Anthropic’s specification.

  * REST API: Expose profile fields, secured by API key.

  * Public Profile Endpoints: Sharable read-only profile (optional, per-user setting).

* **Authentication (P0)**

  * Sign up/Login with Clerk: Handles local/email and social logins.

  * API Key Generation: Web interface to create/manage API keys.

  * User Settings: Manage account preferences, data deletion.

* **Admin Dashboard (P1)**

  * View all Connected Accounts: For personal oversight or multi-profile admin.

  * Manage Integrations: Enable/disable, sync on demand.

  * Export Data: Download identity/context in JSON.

* **P2/Nice-to-Have**

  * Notion Integration (OAuth & sync pages/databases).

  * Browser Extension: Inject identity into AI tools on the web.

  * Webhook Support: Notify applications when identity updates.

  * Team Profiles: Manage and sync multi-user org profiles.

---

## User Experience

### Entry Point & First-Time Experience

* User lands on homepage with clear value proposition (“Stop repeating yourself to AI: set up your profile once”).

* Signup via email or OAuth (handled by Clerk).

* Guided onboarding—the initial profile form prompts for bio, occupation, goals, interests, and current projects.

* After signup, user sees an empty dashboard with “Connect your first account” CTA.

### Core Experience

* **Step 1:** Connect X/Twitter account via OAuth (flow handled by Clerk + Twitter API).

  * UI: Modal with OAuth button, stateful loading/connection indicator.

* **Step 2:** System fetches bio, recent tweets, and populates relevant profile fields. User preview displays extracted and editable data.

  * UI: Inline editable fields with review/check UI.

* **Step 3:** 'Profile Active' state shown on dashboard, with last synced timestamp for each integration.

  * UI: Color-coded integration badges, “Last updated: 2m ago.”

* **Step 4:** Dashboard displays personal API key and one-click copy command for MCP server integration (npm install/copy config).

  * UI: Code snippet component, “Copied!” feedback.

* **Step 5:** Activity log and integration status table keep user up-to-date; user can request a manual sync or edit fields directly.

### Edge Cases

* **OAuth Fails:** Show clear error message, allow retry. Tooltip with “why might this fail” info.

* **API Rate Limit:** Graceful degrade, badge with “sync delayed - rate limit hit,” auto-retry with exponential backoff.

* **Empty Data:** Suggest manual entry or “Connect another account” prompt.

* **Expired Token:** Prompt for re-authentication, don’t block access to profile editing.

* **No Integrations Connected:** Show onboarding tutorial and “why integrations matter” help section.

---

## Narrative

Alex, a founder and developer, uses ChatGPT, Claude, OpenClaw, and Cursor daily to build and ship new features. Eager to get started with OpenClaw’s new workflow agent, Alex finds the onboarding screen frustrating—again asked to fill out personal background, goals, and current projects, despite already providing this info to ChatGPT, Claude, and even in their company’s Notion and GitHub profiles. After another round of painstaking copy-pasting and rewriting, Alex realizes this process wastes valuable time and breaks the “AI just works” promise.

Discovering OneContext, Alex signs up effortlessly, completing a concise profile form. With a few clicks, Alex connects X and GitHub via secure OAuth. Instantly, OneContext compiles a unified AI identity—auto-populating bio, recent tweets about the startup, and active GitHub repos. The profile needs minimal editing, so Alex tweaks one or two project summaries, then copies the MCP integration command straight into OpenClaw’s config. On relaunch, OpenClaw immediately recognizes Alex’s background, current goals, and technical expertise.

The next day, Alex tweets about launching a new feature. Overnight, OneContext syncs everything—now, any AI tool Alex uses, from Claude Projects to future apps, instantly “knows” the latest. Alex no longer dreads new AI onboarding; their up-to-date profile flows automatically wherever it’s needed. Relief and productivity, finally—AI context management just works.

---

## Success Metrics

### User Metrics

* **GitHub Stars:** 500+ in first month

* **Early Signups:** 100+ within two weeks

* **Activation Rate:** 60%+ of users connect at least one integration

* **Weekly Active Users:** 40%+ repeat usage, return to dashboard or use API

* **Integration Success:** 80%+ users successfully access profile via MCP/API on first attempt

* **Avg Integrations per User:** 2.5

### Business Metrics

* **20% Paid Conversion** to hosted plan within 3 months

* **$5,000 MRR** at 3 months

* **10+ Open Source Contributors** in code repo

### Technical Metrics

* **API Uptime:** 99%+

* **Avg API Response Time:** < 500ms

* **Sync Job Success Rate:** 95%+

* **OAuth Flow Error Rate:** < 5%

### Key Events to Track

---

## Technical Considerations

* **OAuth Security:** Token encryption at rest with fine-grained scoping.

* **Cron Reliability:** Use robust job queue, handle external API rate limits with exponential backoff retries.

* **API Versioning:** v1 from day one; plan for future protocol changes to MCP and REST API.

* **Standards Compliance:** MCP server must fully match Anthropic’s Model Context Protocol spec.

* **Scalability:** Design for horizontal scaling; stateless backend where possible.

* **Privacy/Security:** Enforce row-level security (Supabase RLS), precise audit logging, unambiguous data deletion/retention controls.

* **Self-Hosting:** Official Dockerfile and one-command deploy scripts; detailed self-host docs.

* **Open Source Contributions:** Modular monorepo structure, clear CONTRIBUTING.md, separate integration adapters by platform.

* **Webhook/Push:** Consider webhooks for real-time syncs; target GraphQL in later versions for flexible querying by consuming AI tools.

---

## Architecture

* Turbo Mono Repo - We basically copy Postel v2 and throw out everything what we don’t need

* 2 Apps: UI, CLI

* API (Public & Private) + MCP Server using honojs - can copy Postel

* Use abstractions + generic patterns so adding new integrations because just like adding one or two new files! 

## UI Architecture

* **Framework:** Next.js 16 

* **Component Library:** shadcn/ui for modern, accessible UI elements

* **Styling:** Tailwind CSS utility framework

* **State Management:** React Query (TanStack) for server/cache state, Zustand for UI state (modals, toggles)

* **Animations:** Framer Motion for transitions, modal pop, connection status changes

* **Responsive Design:** Mobile-first, all dashboards and forms usable on smartphones, tablets, desktops

* **Accessibility:** Full WCAG 2.1 AA compliance, keyboard-first navigation, all controls ARIA-labeled, modals focus-trapped, screen reader optimized

---

## API & Backend

* **Framework:** Next.js API routes for MVP (move to HonoJS or tRPC if necessitated by scale/complexity)

* **Database:** PostgreSQL via Supabase (row-level security enabled)

* **ORM:** Prisma for type-safe queries/migrations

* **Authentication:** BetterAuth - copying Postel

* **Hosting:** Vercel (UI and API), Supabase (DB/cron/Edge)

* 

* **Key Endpoints:**

  * `POST /api/auth/signup` — create user

  * `GET /api/profile/:userId` — fetch user profile

  * `PATCH /api/profile/:userId` — update profile

  * `POST /api/integrations/connect` — start OAuth flow

  * `GET /api/integrations` — list integrations

  * `POST /api/integrations/:id/sync` — manual sync trigger

  * `DELETE /api/integrations/:id` — disconnect

  * `GET /api/keys` — list API keys

  * `POST /api/keys` — generate new key

  * `GET /api/mcp/context` — serve Anthropic MCP context

* **MCP Server:** Published as npm package `@onecontext/mcp-server`; connects to hosted or self-hosted API + honojs mcp

---

## Performance & Scalability

* **Optimizations:**

  * React Server Components for initial load speed

  * Profile reads cached for 5 minutes; cache bust on update/sync

  * Lazy load config panels for integrations

  * Next.js `Image` component to optimize avatars/social images

  * Edge deploy (Vercel Edge Functions, Cloudflare Workers) for low-latency public API

* **Accessibility:**

  * WCAG 2.1 AA, all core flows tested with keyboard and screen readers

  * Keyboard shortcuts for connect, copy API key

  * Skip navigation links, high-contrast theme toggle

  * Descriptive error/recovery messages

* **Scalability:**

  * 1,000 users targeted in month 1, 10,000 in month 3

  * Supabase Pooler for DB pooling; read replicas as needed

  * BullMQ/Inngest for sync job queueing

  * Static assets on Vercel CDN; rate limiting (100 req/min/user, 1,000 req/min/api key)

* **Monitoring:**

  * Sentry for error tracking

  * Vercel Analytics for frontend performance

  * PostHog for product analytics/events

  * Better Uptime for uptime/alerting

  * Custom dashboard for sync/API job status

---

## Integration Points