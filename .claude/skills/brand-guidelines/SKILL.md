---
name: brand-guidelines
description: Applies OneContext's official brand colors, typography, and UI patterns. Use when building or styling UI, marketing pages, docs, or any artifact that should match the OneContext visual identity (clean, minimal, developer-first).
---

# OneContext Brand Guidelines

## Overview

OneContext is the universal AI identity platform. Our visual identity is **clean, minimal**, and functional—predominantly white with dark green used sparingly as a strategic accent. Prioritize infrastructure-grade reliability over consumer-app flashiness.

**Keywords:** OneContext brand, visual identity, UI styling, colors, typography, developer-first design, Tailwind, shadcn

**Source:** `prompts/brand-guide-and-visual-identity.md`

For **tone, voice, and copy** (headlines, CTAs, landing text, docs, social), use the **brand-copy-guidelines** skill.

---

## Color System

### Primary

- **Base:** White `#FFFFFF` – dominant for backgrounds, forms, cards. The brand is intentionally minimal with lots of white space.
- **Primary accent:** Dark Green `#047857` (Tailwind `emerald-700`) – CTAs, links, active states, badges, key highlights. Use sparingly, not as broad fill.
- **Hover / focus:** Lighter Green `#10B981` (Tailwind `emerald-500`) – hover states, subtle highlights, focus rings.

### Neutrals & Semantic

- **Neutrals:** Tailwind gray scale (50–950).
- **Text (light mode):** Gray-900.
- **Text (dark mode):** Gray-50.
- **Dark backgrounds:** Near-black `#0A0A0A` / `#18181B`.
- **Error:** Red `#EF4444`.
- **Warning:** Amber `#F59E0B`.

**Rule:** The brand is *not* green-heavy. Green only for interactive/important elements.

---

## Typography

- **Primary font:** Inter or Geist (open license). Use in web/app; fallback: system sans-serif.
- **Code / mono:** Geist Mono, JetBrains Mono, or Fira Code for code, keys, CLIs.

### Hierarchy

| Element      | Size      | Weight   |
|-------------|-----------|----------|
| H1 Hero     | 48–64px   | Bold     |
| H2          | 36–40px   | Semibold |
| H3          | 24–28px   | —        |
| Body        | 16–18px   | Regular (line-height 1.6–1.7) |
| Small/caption | 14px    | —        |

---

## UI Component Patterns

- **Buttons:** Rounded 6–8px. Primary CTA = dark green; hover/focus = lighter green. Accessible contrast.
- **Cards:** White, gray border or subtle shadow, padded, clearly labeled.
- **Forms:** Labels above fields, inline validation.
- **Status:** Color-coded; icon + text; dark green for success/active.
- **Code blocks:** Dark theme, syntax highlighting, copy button.
- **Navigation:** White base; dark green underline or fill for active; mobile-responsive.
- **Spacing:** 8px grid; generous whitespace.
- **Shadows:** Subtle, only where elevation is needed.

---

## Iconography

- **Style:** Lucide or Heroicons; line-based, 24px, 1.5–2px stroke.
- Use dark green only for accent or active indicators—never as broad icon fill.
- Consistent size and color per context (sync, link, key, check, close, settings, code, user).

---

## Motion

- Reserved and fast; indicate state change, not decoration.
- Hover: ~100–150ms (e.g. green → lighter green on buttons).
- Transitions: 200–300ms; complex: 400–500ms.
- Sync in progress: spinning icon, &lt;1s loop. Page transitions: fast fade/slide &lt;200ms.

---

## Technical Integration

- **Tailwind:** Use tokens from project config (`white`, `emerald-700`, `emerald-500`, grays, reds, ambers).
- **Components:** shadcn/ui; Lucide icons; Inter (or Geist) font.
- **Assets:** Logo/icon/wordmark in `/public/brand/` (SVG primary, PNG for social); monochrome for dark/accessibility.
- **Accessibility:** Minimum WCAG AA contrast; focus indicators on all interactive elements; support light and dark backgrounds.

When creating or editing UI, marketing pages, or docs, apply these colors, type scale, and patterns so OneContext stays consistent and on-brand.

