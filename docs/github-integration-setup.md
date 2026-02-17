# GitHub Integration Setup

OneContext uses GitHub OAuth to authenticate users and sync their profile, bio, and top repositories into memory via Mem0.

## How It Works

1. **Auth** — BetterAuth handles the OAuth redirect flow (`packages/auth/auth.ts`)
2. **Sync** — The GitHub adapter (`packages/integrations/github/adapter.ts`) fetches the user's profile and top 10 repos via the GitHub API, then indexes them as memories in Mem0

### Data Synced

| Type | Source | What's stored |
|------|--------|---------------|
| Profile | `GET /user` | Name, bio, company, location, blog URL |
| Repos | `GET /user/repos` | Top 10 (by last updated), with description, language, star count |

## Setup

### 1. Create a GitHub OAuth App

1. Go to **GitHub Settings > Developer settings > OAuth Apps > New OAuth App**
   ([github.com/settings/applications/new](https://github.com/settings/applications/new))
2. Fill in:
   - **Application name:** `OneContext` (or anything you like)
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
3. Click **Register application**
4. Copy the **Client ID**
5. Click **Generate a new client secret** and copy it

### 2. Add Environment Variables

Add to `.env.local`:

```bash
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### 3. Restart the Dev Server

```bash
pnpm dev
```

## Production

For production, update the OAuth app (or create a new one) with your production domain:

- **Homepage URL:** `https://yourdomain.com`
- **Authorization callback URL:** `https://yourdomain.com/api/auth/callback/github`

Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in your production environment variables.

## Troubleshooting

**OAuth redirect fails with "redirect_uri mismatch"**
- The callback URL in the GitHub OAuth app must exactly match `{NEXT_PUBLIC_SITE_URL}/api/auth/callback/github`. Check for trailing slashes or http vs https mismatches.

**Sync completes but no memories appear**
- Verify `MEM0_API_KEY` is set. The adapter logs errors via `@onecontext/logs` — check the server console for "Mem0 add failed" messages.

**"Bad credentials" during sync**
- The OAuth access token may have expired or been revoked. Disconnect and reconnect the source.
