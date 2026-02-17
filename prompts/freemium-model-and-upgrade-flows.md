# OneContext: Freemium Model & Upgrade Flows

## Executive Summary

OneContext is launching a plug-and-play AI identity and memory platform tailored for both individual developers and AI product teams. Our MVP launch targets users who need a persistent, auto-updating knowledge profile, with a focus on frictionless onboarding and rapid third-party integration. Launching July 2024, we will target early adopters via Product Hunt, developer Twitter, and open source AI communities. Our 90-day goal is to achieve a 10% free-to-paid conversion rate with at least $1,000 in MRR, validating demand for a tightly-scoped freemium model.

---

## Market Analysis

### Market Size

* **TAM:** Hundreds of thousands of knowledge workers and devs using AI tools, plus thousands of AI tool SaaS vendors globally—estimated $1B market for "AI identity/context" infrastructure.

* **SAM:** AI-enabled productivity SaaS builders and users in North America/EU/Asia (\~250k) and their developer teams.

* **SOM:** Realistically, 5,000-10,000 initial end users within the first year via direct outreach and distribution in developer/AI product channels.

### Target Segments

* **Individual Developers & Builders**

  * **Who:** Freelance/indie devs, solopreneurs working on or using generative AI tools (small teams, pre-Series A, 1-10 employees)

  * **Why:** They want reusable AI context sync across projects/tools, hate repeated onboarding, want a shortcut to "it just works".

  * **Where:** Twitter/X, Product Hunt, r/LocalLLaMA, Vercel + Vercel AI social, indiehackers, Discord groups

  * **Current Solution:** Manual profile entry for each tool, DIY data sync, rarely automated—time-consuming, error-prone, not scalable.

* **Small AI Product Startups**

  * **Who:** Teams building AI-powered SaaS (content tools, agents, automated researchers, etc.)

  * **Why:** Need robust, ready-made user context with integrations so they don’t rebuild OAuth and sync logic, and want to onboard users with one click.

  * **Where:** YC Demo Day lists, Product Hunt, open source collaborating startups, founder-focused newsletters.

  * **Current Solution:** Custom forms, asking users to fill out extensive fields or integrate their own accounts, lots of dropoff, poor onboarding.

### Competitive Landscape

* **Mem0**: Underlying memory infra, not a plug-and-play user platform; no paywall, UI, or integration library.

* **Auth0, Clerk, Supabase**: Offer authentication, not persistent AI context/memory or data sync.

* **Custom Build/DIY**: Most teams waste 2–3 months building context sync and onboarding UIs.

* **Your Differentiation**: Only full-stack, ready-to-integrate solution focused on AI context and memory, not just “identity” or authentication. Live upgrades, instant usage limits, and a clear UX ladder drive paid subscriptions.

---

## Product Positioning

### Positioning Statement

For developers and AI startups who need a persistent, up-to-date user context, OneContext is an AI identity layer that provides seamless sync, memory, and integrations out of the box. Unlike manual forms or authentication-only solutions, OneContext delivers instant value, real limits, and rapid extensibility for any AI-powered product.

### Messaging Hierarchy

* **Primary message:** "OneContext syncs your AI identity and memory—connect once, use everywhere. Free to try, $9 to unlock everything."

* **Supporting messages:**

  1. “Connect all your sources—Twitter, GitHub, and more—no code required.”

  2. “Never hit a wall again: store unlimited memories, auto-sync, and enjoy full API access on Pro.”

  3. “Upgrade instantly, no complexity—just Free or Pro with all features unlocked for $9/month or $99/year.”

* **Proof points:**

  * User testimonials: “I set up in 2 minutes—my AI tools just work now.”

  * Demo: Upgrade flow shows hard memory/source limits and instant feature unlock.

  * Metrics: Conversion rate, high NPS, zero onboarding tickets for integrations.

### Tone & Voice

Technical but approachable. Crisp, instructional UI copy. “Get started” and “Unlock everything” are prominent—no jargon, no marketing fluff. Branded with emerald accents, bright and friendly, but clearly a professional tool.

---

## Pricing Strategy

### Pricing Model

* **Model type:** Freemium-to-subscription (monthly/annual)

* **Tiers:**

  * **Free:** 1 source connection (Twitter or GitHub, user's choice), 25 memories, manual sync, API (100 calls/day), community support via Discord/GitHub.

  * **Pro:** $9/month or $99/year (save $9), unlimited sources, unlimited memories, daily auto-sync, API (10,000 calls/day), priority email support, early access integrations.

* **Price points:** $9/month, $99/year (8.25/mo effective)

### Competitive Context

* **Compared to alternatives:** Lower friction and more features than pure infra (Mem0 at $49/mo), much richer than generic auth or Zapier-style integrations. No “add-ons”, just a straight value ladder for $9 or $99.

* **Anchoring:** Not “premium” but also not disposable—priced to prove value fast, not to maximize ARPU early. Clearly undercuts custom build or indirect alternatives.

### Metrics

* **Target conversion rate:** 10% free → paid within 30 days.

* **Target ARPU:** $8–$10/month in first 90 days.

* **Expansion path:** Annual billing, upcoming B2B/team tier.

---

## Promotional Plan

### Launch Channels

### Content Plan

* Launch blog: “Launching OneContext: Your AI Identity, Now Freemium”

* 60s demo video—shows account creation, hitting 25-memory limit, upgrading, connecting new source

* 2 customer testimonial minis (with GIFs)

* Social media calendar: 1 thread, 2 tweets/week for first month, GIF/upgrade moments

* Knowledge repo/FAQ for “How to add new source integrations”

### PR & Partnerships

* Founder-driven press outreach to select AI/infra newsletters

* Potential partnership with Mem0: “Best plug-and-play user memory platform powered by Mem0”

* Pre-arranged testimonial from 1-2 “friendly” AI tool founders

---

## Sales Strategy

### Sales Motion

* **Self-serve (primary):** Users upgrade themselves when blocked (hard limit) or after seeing value on dashboard/chat/sources.

* **Sales-assisted:** For inbound B2B leads (AI product teams), founder walks through integration flow.

* **Outbound:** Targeted outreach to indie/seed-level AI SaaS teams—demo via API or widget for rapid onboarding.

* **Hybrid:** Trigger sales-assisted only if user is company role or integrates into their product/app.

### Sales Enablement

* Sales one-pager (exportable from website)

* Demo video script: new user → limit → upgrade → features unlocked

* Objection handling FAQ: “Why pay $9 vs DIY?” “What if I need more sources/memories?”

* Competitive grid and switching guide for teams

### Partner & Channel Sales

* Targeting future: Mem0 partnership, Notion/Twitter API mentions, open source plugin directory for integration

* Marketplace inclusion post-MVP (not required for launch)

---

## Success Metrics

### 30-Day Targets

* **Awareness:** 3,000 website visits, 500 signups, 350 completed onboarding

* **Activation:** 200 users connect source + add memory, 100 hit free plan limit

* **Revenue:** $500 in MRR (≈56 Pro upgrades at $9)

### 90-Day Targets

* **Retention:** Day-30: 50% of Pro users active, Day-60: 30%

* **Growth:** Month-over-month user growth 20%

* **Satisfaction:** NPS ≥ 45, >75% of surveyed users say “Upgrade process was clear and fair”

### Tracking

* **Tools:** Mixpanel (product events), Stripe (payment), Internal admin dashboard, Email reports weekly

* **Process:** Product lead + growth lead review metrics biweekly

* **Escalation:** If conversion or retention underperforms, workshop blockers; pivot paywall copy, pricing A/B, or upgrade triggers

---

## Pricing & Plan Structure

A two-tier model emphasizes simplicity and strong upgrade pressure for MVP.

**Free Tier:**

* 1 source connection (user chooses: Twitter OR GitHub)

* 25 memories maximum

* Manual sync only (Sync Now button)

* Basic API access (100 calls/day)

* Community support (Discord & GitHub)

**Pro Tier:**

* $9 per month (billed monthly), OR $99 per year (save $9/year, $8.25/mo effective)

* Unlimited sources and memories

* Auto-sync daily (background updates)

* Full API (10,000 calls/day)

* Priority email support, early access to new integrations

**Messaging:**  

*Free to try. $9 to unlock everything.*  

No confusing tiers, no early adopter offers—just a clear upgrade path.

---

## Limit Enforcement Points

**Hard & soft limits are checked/enforced at these moments:**

**Source Connection Limit:**

* *Where:* Sources page, when user clicks "Connect" on a 2nd integration

* *Behavior:* All "Connect" buttons are disabled for free users with one source; clicking triggers upgrade modal

* *Visuals:* Pro badge on unavailable sources, tooltip: "Pro feature – upgrade to connect"

**Memory Limit:**

* *Where:* Chat page (adding 26th memory), Memories page (visual counter), Dashboard stats

* *Behavior:*

  * Warn at 20/25: amber warning banner ("5 memories left")

  * Block at 25/25: cannot add, assistant says "limit reached, please upgrade or delete"

  * UI: Counter shown as X/25, progress bar amber at 20, red at 25

**Auto-Sync Toggle:**

* *Where:* Sources sync section, Settings sync preferences

* *Behavior:* Toggle disabled for free users ("Upgrade to enable auto-sync"); non-blocking but visually clear in UI

**API Rate Limit:**

* *Where:* API requests, API & MCP usage stats

* *Behavior:* Warn at 80/100 calls ("upgrade for 10,000 per day"), block at 100/100 (API 429 error with upgrade url)

**All limits reset/controlled predictably (API calls reset daily, manual actions off cumulative total, sync by plan).**

---

## Upgrade Modal UI Sketch

Triggered when the user hits a hard limit:

```
┌──────────────────────────────────────────┐
│                                          │
│              🔒                          │
│                                          │
│    Connect unlimited sources             │
│                                          │
│  Free plan includes 1 source.            │
│  Upgrade to Pro for unlimited            │
│  sources and auto-sync.                  │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │         Pro Plan                   │ │
│  │                                    │ │
│  │      $9/mo  or  $99/year           │ │
│  │                                    │ │
│  │  ✓ Unlimited sources               │ │
│  │  ✓ Unlimited memories              │ │
│  │  ✓ Auto-sync daily                 │ │
│  │  ✓ Full API (10k calls/day)        │ │
│  │  ✓ Priority support                │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  \[Upgrade to Pro - $9/mo\]                │
│  \[Maybe later\]                           │
└──────────────────────────────────────────┘
```

* Centered modal, cannot dismiss by clicking backdrop.

* "Upgrade" button (emerald), "Maybe later" (secondary).

* Clicking "Upgrade" sends to `/settings/billing`.

---

## Settings Billing Page Sketch

**For a free user:**

```
┌────────────────────────────────────────────────┐
│  💳 Billing & Subscription                     │
├────────────────────────────────────────────────┤
│                                                 │
│  Current Plan                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Free Plan                                │  │
│  │                                           │  │
│  │  You're currently on the Free plan        │  │
│  │                                           │  │
│  │  Usage:                                   │  │
│  │  ━━━━━━━━━━━━━━━━━━━━ 92%  (23/25)        │  │
│  │  • Sources: 1 of 1                        │  │
│  │  • Memories: 23 of 25                     │  │
│  │  • API calls today: 45 of 100             │  │
│  │                                           │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Upgrade to Pro                                │
│  ┌─────────────────┬─────────────────────────┐ │
│  │   Monthly       │   Annual         SAVE   │ │
│  ├─────────────────┼─────────────────────────┤ │
│  │                 │                         │ │
│  │   $9/month      │   $99/year              │ │
│  │                 │   ($8.25/mo)            │ │
│  │                 │                         │ │
│  │ ✓ Unlimited     │ ✓ Everything in Monthly │ │
│  │   sources       │ ✓ Save $9/year          │ │
│  │ ✓ Unlimited     │ ✓ One payment           │ │
│  │   memories      │                         │ │
│  │ ✓ Auto-sync     │                         │ │
│  │ ✓ Full API      │                         │ │
│  │                 │                         │ │
│  │ \[Subscribe\]     │ \[Subscribe\]             │ │
│  │                 │                         │ │
│  └─────────────────┴─────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**For a Pro user:**

```
┌────────────────────────────────────────────────┐
│  💳 Billing & Subscription                     │
├────────────────────────────────────────────────┤
│                                                 │
│  Current Plan                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Pro Plan - $9/month              ✓       │ │
│  │                                           │ │
│  │  Status: Active                           │ │
│  │  Next billing: March 17, 2026             │ │
│  │                                           │ │
│  │  Current usage:                           │ │
│  │  • Sources: 3 connected                   │ │
│  │  • Memories: 234 stored                   │ │
│  │  • API calls today: 1,234 / 10,000        │ │
│  │                                           │ │
│  │  \[Manage Subscription\]  \[Cancel Plan\]     │ │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Switch to Annual Billing                      │
│  ┌──────────────────────────────────────────┐ │
│  │  Save $9 per year                         │ │
│  │  Pay $99/year instead of $9/month         │ │
│  │  (Effective rate: $8.25/month)            │ │
│  │                                           │ │
│  │  \[Switch to Annual\]                       │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  Billing History                               │
│  ┌──────────────────────────────────────────┐ │
│  │  Feb 17, 2026    $9.00      \[Invoice ↓\]  │ │
│  │  Jan 17, 2026    $9.00      \[Invoice ↓\]  │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

* Manage Subscription opens Stripe’s self-service portal.

* Cancel Plan triggers a confirmation dialog with plan downgrade details.

* Switching to annual billing credits leftover time and confirms total.

---

## In-Product Upgrade Nudges

* **Dashboard for Free Users:** Upgrade card in sidebar or main area for engaged users (15+ memories or try to connect another source).

* **Sources Page:** Disabled "Connect" buttons with Pro badge/tooltips; only shows modal if clicked.

* **Memory Counter in Chat:** Appears subtly when user has 15+ memories ("23/25 used — Upgrade for unlimited").

* **Near Limit Warning Banner:** At 20/25, amber banner top of dashboard; can dismiss. (Reappears if still near limit.)

* **Feature Tooltips:** Disabled toggles have Prp tooltips with a small upgrade link; similar for any Pro-only UI.

* **(Optional) Email Nudges:** Low priority, max 1/wk to engaged users with clear unsubscribe ("You are almost at memory limit" after Day 7 if 20+ memories).

---

## Upgrade Flow User Journey

1. **Trigger:** User is blocked (tries to connect 2nd source, add 26th memory), or clicks an Upgrade button anywhere.

2. **Upgrade Modal/Billing:** Modal shows feature list and "Upgrade to Pro" button or direct link to `/settings/billing`.

3. **Plan Selection:** Pick monthly ($9) or annual ($99), side-by-side cards, features listed.

4. **Checkout:** Redirect to Stripe for secure payment (pre-filled email).

5. **Processing:** Payment → webhook updates user to Pro; redirect back to `/settings/billing?success=true`.

6. **Success State:** "Welcome to Pro!" alert, confetti, new features now live, links to key pages (“Go to Sources”, “Add knowledge in Chat”).

7. **Feature Activation:** All previously locked features instantly active (sources, auto-sync toggle, memory limit, API rate).

8. **Cancellation:** Cancel in settings; confirm downgrade and final date, all features stay until period end, then revert to Free (with graceful data handling).

---

## Dashboard Upgrade Nudges

**Quick Stats Card:**

```
┌────────────────────────────────────┐
│  Quick Stats                       │
├────────────────────────────────────┤
│                                    │
│  23        1         Free          │
│  Memories  Sources   Plan          │
│  (25 max)  (1 max)   \[Upgrade\]     │
│                                    │
└────────────────────────────────────┘
```

* Usage shown with gray limits for free plan; amber/red when at 20+/25.

* Plan column shows "Free" with clickable Upgrade link.

**Upgrade Card:**

```
┌────────────────────────────────────┐
│  🚀 Unlock Unlimited                │
├────────────────────────────────────┤
│                                    │
│  Connect all your sources,         │
│  store unlimited memories,         │
│  auto-sync daily                   │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Pro - $9/mo or $99/year     │  │
│  │  • Unlimited sources         │  │
│  │  • Unlimited memories        │  │
│  │  • Auto-sync daily           │  │
│  │  • Full API access           │  │
│  └──────────────────────────────┘  │
│                                    │
│  \[Upgrade to Pro\]                  │
└────────────────────────────────────┘
```

* Appears after engagement; card has emerald border/background; dismissible.

**Near Limit Banner:**

```
┌────────────────────────────────────────────┐
│  ⚠️  Almost at your limit                  │
│                                            │
│  You've used 23 of 25 memories.            │
│  Upgrade to Pro for unlimited.             │
│                                    \[Dismiss\]│
│  \[Upgrade to Pro\]                          │
└────────────────────────────────────────────┘
```

* Banner, amber/yellow; disappears when dismissed or after upgrade.

---

## Sources Page Upgrade Flow

**Free user at limit:**

```
┌────────────────────────────────────────────┐
│  🔌 Sources                                 │
├────────────────────────────────────────────┤
│                                             │
│  Connected (1)                              │
│  ┌──────────────────┐                      │
│  │  Twitter     ✓   │                      │
│  │  @yourusername   │                      │
│  │  \[Sync Now\]      │                      │
│  │  \[Disconnect\]    │                      │
│  └──────────────────┘                      │
│                                             │
│  Available                                  │
│  ┌──────────────┬──────────────┐          │
│  │  GitHub      │  LinkedIn    │          │
│  │              │              │  \[Pro\]   │
│  │  \[Connect\]   │  \[Connect\]   │  badge   │
│  │  (disabled)  │  (disabled)  │          │
│  └──────────────┴──────────────┘          │
│                                             │
│  ℹ️  Upgrade to Pro to connect unlimited    │
│     sources and enable auto-sync            │
│  \[Upgrade to Pro - $9/mo\]                   │
└────────────────────────────────────────────┘
```

* Disabled Connect buttons, Pro badge, info banner, triggers modal if clicked.

* Pro: all integrations enabled, no badges/restrictions.

---

## Chat Page Limit Handling

**Approaching limit (20-24):**

```
┌────────────────────────────────────────────┐
│  \[Message input box...\]                    │
│  \[Send button\]                             │
│                                            │
│  23/25 memories used • Upgrade for unlimited│
│  (small gray text with emerald link)       │
└────────────────────────────────────────────┘
```

**At limit (25/25):**

```
┌────────────────────────────────────────────┐
│  User: I'm building a new feature for      │
│        OneContext                          │
│                                            │
│  Agent: I'd love to add that to your       │
│         memories, but you've reached       │
│         your free plan limit (25/25).      │
│                                            │
│         To continue adding memories:       │
│         \[Upgrade to Pro - $9/mo\]           │
│         or                                 │
│         \[View & Delete Old Memories\]       │
└────────────────────────────────────────────┘
```

* Conversational block, inline upgrade and view/delete buttons. Unlimited: counter disappears.

---

## Memories Page Limit Indicators

**Header with Counter:**

```
┌────────────────────────────────────────────┐
│  📝 Memories                    \[+ Add\]    │
├────────────────────────────────────────────┤
│                                            │
│  You have 23 of 25 memories (Free plan)    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━░░ 92%          │
│                                            │
│  Upgrade to Pro for unlimited memories     │
│  \[Upgrade - $9/mo\]                         │
└────────────────────────────────────────────┘
```

**At Limit (25/25):**

```
┌────────────────────────────────────────────┐
│  📝 Memories                    \[+ Add\]    │
│                                 (disabled) │
├────────────────────────────────────────────┤
│                                            │
│  ⚠️  Memory limit reached (25/25)          │
│                                            │
│  To add more memories:                     │
│  • Upgrade to Pro for unlimited            │
│  • Or delete some old memories below       │
│                                            │
│  \[Upgrade to Pro - $9/mo\]  \[Stay on Free\] │
└────────────────────────────────────────────┘
```

* Progress bar turns amber/red at thresholds; Add button disables, tooltips give reason.

---

## Post-Upgrade Experience

After payment, user lands on:

```
┌────────────────────────────────────────────┐
│  🎉 Welcome to Pro!                         │
├────────────────────────────────────────────┤
│                                             │
│  Your account has been upgraded             │
│                                             │
│  What's new:                                │
│                                             │
│  ✓ Connect unlimited sources                │
│    → Go to Sources                          │
│  ✓ Store unlimited memories                 │
│    → Add knowledge in Chat                  │
│  ✓ Auto-sync enabled                        │
│    Your profile updates daily automatically │
│  ✓ Full API access (10k calls/day)          │
│    → API & MCP setup                        │
│                                             │
│  \[Go to Dashboard\]                          │
└────────────────────────────────────────────┘
```

* Success alert, brief confetti, links direct to unlocked areas. All usage limits and UI blocks instantly removed.

---

## Downgrade & Cancellation Flow

**Cancel plan dialogue:**

```
┌────────────────────────────────────────────┐
│  Cancel Pro subscription?                  │
├────────────────────────────────────────────┤
│                                             │
│  If you cancel, you'll lose:                │
│  ✗ Unlimited sources (keep only 1)          │
│  ✗ Auto-sync (manual sync only)             │
│  ✗ Unlimited memories (keep first 25)       │
│                                             │
│  Your subscription will remain active       │
│  until March 17, 2026, then you'll be       │
│  moved to the Free plan.                    │
│                                             │
│  ⚠️  We'll disconnect extra sources and     │
│     hide memories beyond 25 (not deleted).  │
│                                             │
│  \[Keep Pro\]           \[Yes, cancel\]         │
└────────────────────────────────────────────┘
```

* Active until period end, then downgrade. Email sent, sources/memories hidden not deleted.

**Grace period/"canceling" state:**  

Billing shows countdown to downgrade and “Reactivate Subscription” button.

After period end, only 1 source and 25 newest memories accessible; other data hidden and restorable when upgrading again.

---

## Usage Counters & Limit Tracking

* **User Model Fields:**

  * `sourcesConnected`: incremented/decremented on connect/disconnect

  * `memoriesCount`: incremented/decremented as memories added/removed

  * `apiCallsToday`: incremented per call, resets midnight UTC

  * `lastApiResetAt`: timestamp for resets, daily cron job

* **Where checked:** API middleware for all limit-protected endpoints, frontend for all blocked UI actions, and background jobs.

* **Caching:** Limits cached in session and React Query for 5min, refresh on upgrade/downgrade.

---

## Pricing Page Design

Standalone `/pricing` page (optional, not MVP-hard requirement):

```
┌────────────────────────────────────────────────────┐
│  Pricing                                           │
├────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┬──────────────────────────┐  │
│  │      Free        │         Pro              │  │
│  ├──────────────────┼──────────────────────────┤  │
│  │    $0            │    $9/mo or $99/year     │  │
│  ├──────────────────┼──────────────────────────┤  │
│  │ Sources: 1       │ Unlimited                │  │
│  │ Memories: 25     │ Unlimited                │  │
│  │ Sync: Manual     │ Auto-sync                │  │
│  │ API: 100/day     │ 10,000/day               │  │
│  │ Support: Community│ Priority email           │  │
│  ├──────────────────┼──────────────────────────┤  │
│  │ \[Get Started\]    │ \[Subscribe Now\]          │  │
│  └──────────────────┴──────────────────────────┘  │
│                                                     │
│  FAQ (“Can I switch?” “What happens to my data?”)   │
└────────────────────────────────────────────────────┘
```

* Clean table emphasizes value and simplicity.

---

## Business Rules & Edge Cases

* **Pro → Free downgrade:** System keeps most recent source, disconnects others with email explaining; keeps 25 most recent memories visible, hides remainder but never deletes (all visible again after re-upgrade).

* **Mid-chat limit hit:** Assistant replies helpfully; suggests upgrade or deletion, doesn’t disrupt chat.

* **API call over limit:** Returns 429 error with upgrade url, external tools handle softly, MCP can serve cached profile.

* **Upgrading mid-cycle (monthly→annual):** Stripe manages pro-ration; billing date/future cycles update automatically.

* **Payment failure:** Stripe retries 3×/2 weeks; gives warning banners/emails; after grace period, user downgraded.

* **Free tier forever:** Users can stay on free if tight limits suit them; upgrade path is purely value-driven, never urgent or time-based.

---

## Metrics & Analytics for Pricing

* **User behavior:** Free→pro conversion (goal 10%), time to conversion, what triggered upgrade, churn rate (<5%), downgrade reasons.

* **Limit events:** Track frequency of source, memory, api limit hits; modal impression→upgrade conversion.

* **Revenue:** MRR, ARPU, LTV, churn analysis, monthly/annual split.

* **Experiments:** A/B test memory limit (25 vs 50), source limit (1 vs 2), annual discount ($99 vs $89), Pro price ($9 vs higher).

* **Dashboards:** Admin dashboard with plan distribution, funnel conversion, limit hit frequency, revenue MRR, cohort retention.

* **User-facing stats (Pro):** Show personal usage over time, reinforcing value and aiding retention.

---

*This document provides pragmatic, actionable product specifications and UX flows for implementing a simple, high-converting freemium model for OneContext MVP. All key paywall locations, upgrade journeys, business edge cases, and customer experience rules are addressed to enable rapid, confident engineering and design implementation.*