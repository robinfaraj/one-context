---
name: coding-style
description: Coding standards, architecture patterns, and project conventions for the OneContext monorepo
allowed-tools: Read, Grep, Glob
user-invocable: true
model: sonnet
context: fork
---

# OneContext Coding Style

Apply these conventions when writing or refactoring code in this monorepo.

## Reference Files

| File | Scope |
|------|-------|
| `coding-style.mdc` | General code quality — commenting, control flow, type derivation, business logic hygiene |
| `frontend.mdc` | React component patterns, composition, hooks, module organization |
| `backend.mdc` | Layered architecture, Hono route patterns, Zod validation, API design |
| `project-structure.mdc` | Monorepo layout, package descriptions, where to place new code |

## Key Principles

- **Self-documenting code** — comment only to explain *why*, not *what*
- **Early returns** — flatten logic with guard clauses; avoid deep nesting
- **Derive types from source** — Prisma → Zod → API → frontend; avoid duplicate definitions
- **Follow project structure** — domain-first organization; place code where it belongs
- **Biome for formatting** — do not manually format; let the toolchain handle it
- **Prefer Server Components** — limit `use client` to interactive UI concerns
- **UI / visual:** Apply **brand-guidelines** for colors, typography, spacing. **Copy / messaging:** Apply **brand-copy-guidelines** for headlines, CTAs, landing copy, docs, social (tone, voice, word choice).