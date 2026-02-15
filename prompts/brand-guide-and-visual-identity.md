# OneContext: Brand Guide & Visual Identity

### TL;DR

OneContext is the universal AI identity platform, built for developers who want one source of truth for their digital footprint—seamlessly connected and constantly updated. Our brand and visual identity reflect a technical, trustworthy, open, and developer-first approach, designed to be *clean, minimal*, and functional, prioritizing infrastructure-grade reliability over consumer app flashiness. The design is predominantly white for clarity, with dark green (#047857, Tailwind Emerald-700) used sparingly as a strategic accent for CTAs and key UI elements.

---

## Goals

### Business Goals

* Achieve brand recognition among developer communities as the de facto AI identity layer.

* Drive 2,000+ GitHub stars and 5+ significant open source integrations within the first quarter.

* Attract 500+ hosted signups in the first 60 days post-launch.

* Ensure brand assets are consistently used across all touchpoints: web, GitHub, social, and docs.

### User Goals

* Empower users to set up their AI identity once and reuse it across any tool or agent.

* Provide clarity and trust through transparent, cohesive brand visuals that feel developer-first and production-ready.

* Ensure accessibility and usability across all platforms (light/dark, desktop/mobile, visual impairments).

* Allow developers to easily plug OneContext into their own workflows and products, with clear, minimal branding friction.

### Non-Goals

* No pursuit of flashy, consumer-oriented or overly decorative design motifs.

* No proprietary visual assets that restrict community modification or remixing—everything open source.

* No support for non-digital/print applications in this phase.

---

## User Stories

**End User/Developer**

* As a developer, I want clear branding and iconography, so I can trust the product’s professionalism and reliability.

* As a user, I want high-contrast, legible UI elements, so I never struggle to read or interpret my dashboard.

* As a self-hoster, I want brand assets available in open formats, so I can customize or use them in my fork.

**Integrator/AI Product Owner**

* As an AI tools developer, I want to display the OneContext logo and badges easily in my UI, so my users are reassured of compatibility.

* As a documentation owner, I want logo assets that work well in both dark and light themes, so my docs always look polished.

**Designer/Maintainer**

* As a designer contributing to OneContext, I want a clear style guide with hex codes and type specs, so PR reviews are straightforward and consistent.

---

## Functional Requirements

### Brand Assets & Logo System (Priority: High)

* **Wordmark:** Professional “OneContext” wordmark, geometric, sans-serif.

* **Icon:** Abstract, geometric representation of connection/sync (e.g., interconnected nodes/refresh/bridge). Clean lines, works at 16–32px.

* **Formats:** SVG (primary), PNG (social), monochrome version.

* **Logo Variations:**

  * Full logo (icon + wordmark)

  * Icon only (square, for avatars, favicons, badges)

  * Wordmark only (for app headers, docs)

### Color System (Priority: High)

* **Primary Base:** White (#FFFFFF) – dominant throughout UI, backgrounds, forms, and cards.

* **Accents:**

  * Dark Green (#047857 / Tailwind Emerald-700) – *primary accent, used for CTA buttons, links, active states, badges, and key highlights.*

  * Lighter Green (#10B981 / Tailwind Emerald-500) – *hover states, subtle highlights, focus rings*.

* **Neutrals:** Tailwind gray scale (50–950).

* **Error/Warning:** Red (#EF4444), Amber (#F59E0B).

* **Light/Dark backgrounds:** White (#FFFFFF), Near-black for dark mode (#0A0A0A/#18181B).

* **Text colors:** Gray-900 (light mode), Gray-50 (dark mode).

* **Palette exported in Tailwind config, plus plain hex format.**

* **Emphasis:** The brand is intentionally minimal, with lots of white space and green accents used only for interactive/important elements. The brand is *not* green-heavy.

### Typography (Priority: High)

* **Primary font:** Inter or Geist (selectable in web/app, open license).

* **Fallbacks:** System sans-serif stack.

* **Code/Mono:** Geist Mono, JetBrains Mono, or Fira Code for code, keys, CLIs.

* **Hierarchy:**

  * H1 Hero: 48–64px, bold.

  * H2: 36–40px, semibold.

  * H3: 24–28px.

  * Body: 16–18px regular (1.6–1.7 line height).

  * Small/caption: 14px.

* **Usage guidance included.**

### UI Component Patterns (Priority: High)

* **Buttons:** Rounded (6–8px), dark green for primary CTA, lighter green on hover/focus, accessible.

* **Cards:** White with gray border or subtle shadow, padded, clearly labeled.

* **Forms:** Labels above fields, inline validation.

* **Status indicators:** Color-coded; clear icon + text, dark green for success/active.

* **Code blocks:** Dark theme, syntax highlighting, copy button.

* **Navigation:** White base, dark green underline or fill for active state, mobile-responsive.

* **Spacing:** 8px grid increments, generous whitespace.

* **Shadows:** Subtle, elevation only where functionally necessary.

### Iconography (Priority: Medium)

* **Icon style:** Lucide or Heroicons (line-based, 24px, 1.5–2px stroke).

* **Use cases:** Sync/refresh, link/connection, key, check, close, settings, code brackets, platform logos, user/profile.

* **Consistent sizing and color per status context.**

* **Use dark green only for accent or active indicators—never as broad icon fill.**

### Photography & Imagery (Priority: Medium)

* **Style:** Strictly minimal—actual code screenshots, dashboard previews, Excalidraw diagrams.

* **Avoid:** People stock photos, AI art, complex 3D, gradient/mesh backgrounds.

* **Export:** SVG/PNG for diagrams, high-res PNG for dashboards, use Carbon for code.

### Animation & Motion (Priority: Medium)

* **Motion:** Reserved, fast, uses to indicate state change or context (not decoration).

* **Key cases:**

  * Sync in progress (spinning icon, <1s loop)

  * Page transitions (fast fade/slide, <200ms)

  * Hover (subtle color/scale, e.g., green-to-lighter green on buttons)

  * Connection/OAuth (fluid sheet/modal)

* **Timings:** 100–150ms (hover), 200–300ms (core transition), 400–500ms (complex).

* **Framer Motion defaults, documented for contributors.**

### Brand Applications (Priority: High)

* **Website:** Hero headline, live code, dark mode toggle, mobile support.

* **GitHub:** Banner, badges, quick install, clean feature shots.

* **Social:** Icon, header, announcement templates using brand font/colors.

* **Docs:** Sidebar nav, syntax-highlighted code blocks, clear hierarchy.

* **Product UI:** Consistent status, accessible contrasts, on-brand cards.

* **Email:** Plaintext first, minimal HTML for onboarding.

### Design System Resources (Priority: High)

* **Tailwind color tokens:** Provided in /styles/ (`white`, `emerald-700`, `emerald-500`, grays, reds, ambers)

* **SVG assets:** In /public/brand/ (logo, icon, wordmark)

* **Components:** shadcn/ui, Lucide icons, Inter font

* **Figma library:** Optional, file provided if design needed.

* **Exports:** Logo pack (SVG/PNG/mono), style guide PDF, Tailwind config snippet.

---

## User Experience

**Entry Point & First-Time User Experience**

* Discover assets on the website, in the GitHub README, or from docs.

* Download/clone brand asset pack (/public/brand or direct SVG/PNG links).

* Access clear usage guidance, including color/text/background pairings.

**Core Experience**

* **Step 1:** Designer/dev chooses appropriate logo format for context

  * Clear file names, size options (icon-wordmark, icon only, mono, etc.).

  * Guidance in README for use in web, social, or docs.

* **Step 2:** Implements component/color in product

  * Tailwind config, Inter font/CDN import, code block for palette included.

  * UI components reference spacing, color, font, icon principles.

* **Step 3:** Publishes app, docs, or integration using on-brand assets.

* **Step 4:** User feedback loop—can quickly update assets when new versions published.

**Advanced Features & Edge Cases**

* Power users can customize SVG/brand colors (full open file access).

* Monochrome version for dark docs or strict accessibility.

* Guidance for minimum/maximum sizing, clear space rules.

* Fallbacks for platform constrains (e.g., social, GitHub), tested.

**UI/UX Highlights**

* Minimum WCAG AA contrast.

* Focus indicators for all interactive elements.

* Responsive layout for every major component/template.

* All icons/text support dark/light backgrounds.

---

## Narrative

Alex, a backend engineer building an AI-powered agent, is frustrated. Every new AI tool asks them to rebuild or re-upload their user profile, bio, and knowledge—again. Alex discovers OneContext, and instantly recognizes a brand that “feels right”: technical, clear, no-nonsense, just like Stripe or Vercel. The website’s headline is bold, the copy honest, the palette *clean and white with crisp, meaningful green highlights*, the icons and code blocks look exactly as they expect.

Alex clones the repo and sees that the SVG assets and code-ready colors are easy to implement. Integration cards in their dashboard match the neutral, confident style; the status badges quickly show what’s synced. Whenever Alex needs a logo for docs or social, the well-labeled assets are always readable, and the guidelines show exactly how to keep their app on brand. Over time, every user and contributor benefits—no visual surprises, frictionless integration, and a universal trust that’s only possible with open, usable, and consistent design. OneContext’s visual and voice clarity builds the same trust as its backend infrastructure.

---

## Success Metrics

* **Brand Asset Adoption:** # of external repos/products using official logo/component pack (measured via CDN or GitHub references)

* **Design Consistency:** % of PRs/feature pages conforming to style/brand guide (tracked via design review process)

* **User Feedback:** 90%+ approval in user/designer brand satisfaction survey (quarterly)

* **Accessibility Score:** 100% passing on WCAG AA checks for all primary components/pages

* **Marketing Impact:** Increase in GitHub stars and hosted signups post-brand relaunch (benchmarked before/after)

### User-Centric Metrics

* Rate of brand asset downloads/package installs

* User-reported ease of integrating assets (after onboarding feedback)

* Self-serve vs. support tickets related to visual/brand questions

### Business Metrics

* Growth in external references (as a measure of mindshare)

* Conversion rate improvement post-rebrand (landing -> signup)

* Social engagement on branded content/announcements

### Technical Metrics

* Zero unavailable/broken asset links in production

* Component library build passes/tests (CI)

* Asset load times <200ms (web)

### Tracking Plan

* Downloads of brand asset packs

* NPM/Tailwind config pull frequency

* Docs page views for style guide sections

* GitHub clones/stars of Figma/component repo

---

## Technical Considerations

### Technical Needs

* Resilient storage/distribution for assets (CDN or static in repo)

* Clear, versioned Tailwind config and SVG asset pack

* Automated color/contrast testing for accessibility

### Integration Points

* shadcn/ui and Lucide/heroicons component libraries

* Inter font via Google Fonts or npm

* Compatibility across Vercel/Next.js and HonoJS stack

### Data Storage & Privacy

* No sensitive user data; branding assets are public/open

* License (e.g., MIT or CC-BY-4.0) clearly specified

### Scalability & Performance

* Serve assets from CDN with compression (SVG/PNG)

* Plan for high volume repo traffic during launch

* Fallback for offline/CLI (asset pack downloadable as zip)

### Potential Challenges

* Community pull requests with off-brand visual updates

  * Solution: PR review against guide, reference Figma and PDF as single source of truth

---

## Milestones & Sequencing

### Project Estimate

* Small: 1–2 weeks for v1 complete (all assets, guide, Tailwind config, documentation)

### Team Size & Composition

* Small Team: 1–2 people (1 designer/brand owner, 1 engineer for integration/examples/content updates)

### Suggested Phases

**Phase 1: Asset Design & Guide (1 week)**

* Key Deliverables: Designer—SVG/PNG logo/icon/wordmark, color palette, Figma library, style guide draft, Tailwind config.

* Dependencies: Design tool access (Figma/Illustrator), existing font/CDN.

**Phase 2: Brand Integration (1 week)**

* Key Deliverables: Engineer—publish assets to /public/brand, add Tailwind config, document usage in README & docs site, component stubs in UI.

* Dependencies: shadcn/ui/Lucide setup, Tailwind config in project, web hosting.

**Phase 3: Launch & Community (ongoing)**

* Key Deliverables: Update GitHub README and website, promote on social/dev platforms, collect feedback for v2.

* Dependencies: Asset completeness, initial website/docs deployment.

---