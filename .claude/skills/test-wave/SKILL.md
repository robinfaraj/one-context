---
name: test-wave
description: Spawn a parallel agent team to create and run tests for recently implemented code. Agents analyze changes, write tests, and extend the existing test suite.
user-invocable: true
---

# Test Wave

You are orchestrating a parallel test-writing team. Your job is to:

1. **Analyze what was recently implemented** — look at git diff, recent changes, and the existing test suite
2. **Split work into parallel streams** — each stream covers a different package or route group
3. **Spawn agents that write and run tests** — each agent extends the existing test suite

## Steps

### 1. Discover what needs testing

Run these commands to understand what changed:

```bash
git diff --name-only HEAD~5  # or whatever range covers recent work
git diff --stat
```

Read the existing test suite at `packages/api/src/__tests__/routes.test.ts` to understand the current coverage and patterns.

### 2. Identify test streams

Group the changes into 2-4 parallel streams. Examples:
- **Stream A**: API route tests (auth guards, authenticated endpoints, error cases)
- **Stream B**: Package unit tests (ai-chat, mem0, integrations)
- **Stream C**: Edge cases and validation tests

### 3. Create the team and spawn agents

Create a team called `test-wave` and spawn one agent per stream. Each agent should:

- Read the existing test patterns and follow the same conventions
- Use `vitest` with Hono's `app.request()` for API tests
- Use `describe.runIf(!!DEV_API_KEY)` for tests that need auth/DB
- Add tests to the existing file or create new test files in `packages/<pkg>/src/__tests__/`
- Run the tests to verify they pass before finishing

### 4. Test conventions

```typescript
// Unauthenticated tests (always run)
it("should return 401 for GET /api/endpoint without auth", async () => {
  const res = await app.request("/api/endpoint");
  expect(res.status).toBe(401);
});

// Authenticated tests (only with DEV_API_KEY + test DB)
describe.runIf(!!DEV_API_KEY)("Authenticated", () => {
  it("should return data with auth", async () => {
    const res = await app.request("/api/endpoint", { headers: authHeaders! });
    expect(res.status).toBe(200);
  });
});
```

### 5. Verify and report

After all agents complete:
- Run `pnpm --filter @onecontext/api test` to verify all tests pass
- Report the total test count and what was covered

## Philosophy: PRAGMATIC, NOT PERFECT

This is the most important section. Internalize this before writing a single test.

- **NO complex tests** — if a test needs more than 10 lines of setup, skip it
- **NO mocking hell** — don't mock internal modules, don't build test fixtures, don't create test factories
- **NO 100% coverage** — only test what's easy to test and will actually catch regressions
- **NO edge case rabbit holes** — test the happy path + 1-2 obvious error cases, that's it
- **YES simple request/response** — hit the endpoint, check status code and response shape
- **YES status codes** — 200, 401, 404, 400 are the main ones to verify
- **YES response shape** — check that the JSON has the right keys, not every value
- **YES fast tests** — each test should run in <100ms, no external API calls, no complex DB setup

Think of these tests as smoke tests that run in CI to catch obvious breakage. If something is hard to test, don't test it. Move on.

## Other notes

- Follow existing patterns in the test suite
- Don't mock what you can test directly via `app.request()`
- The test script loads env vars via `dotenv -c -e ../../.env.local`
- Use `subagent_type: "general-purpose"` for agents that need to write code
