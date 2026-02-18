## **Perfect - Let's Design the Right Onboarding**

Focus: **Connect → Import → Show What We Learned → Give Them Tools to Use It**

---

## **Refined Onboarding Flow:**

```
┌─────────────────────────────────────────────────┐
│  Step 1: Sign Up                                │
│  ─────────────────────────────                  │
│                                                  │
│  [Sign up with GitHub]                          │
│  [Sign up with Twitter]                         │
│  [Sign up with Email]                           │
│                                                  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Step 2: Connect Everything (Full Screen)       │
│  ─────────────────────────────                  │
│                                                  │
│         🎯                                       │
│     Connect your sources                        │
│                                                  │
│     We'll import automatically to build         │
│     your AI identity                            │
│                                                  │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │  [🐦 Connect Twitter]  ✓ Connected       │ │
│  │                        (if signed up w/ X)│ │
│  │                                           │ │
│  │  [💻 Connect GitHub]   [Connect]         │ │
│  │                        (OAuth button)     │ │
│  │                                           │ │
│  │  [💼 Connect LinkedIn] [Connect]         │ │
│  │                        (grayed if free)   │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                  │
│  Connected: 1 source                            │
│  (Free plan: 2 sources max)                     │
│                                                  │
│  [Continue]  (enabled after 1+ sources)         │
│  [Skip for now]                                 │
│                                                  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Step 3: Interactive Import Animation           │
│  ─────────────────────────────                  │
│                                                  │
│         🔄 (animated, pulsing)                   │
│                                                  │
│     Building your AI identity...                │
│                                                  │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │  🐦 Twitter                               │ │
│  │  ▓▓▓▓▓▓▓▓░░░░ 75%                         │ │
│  │  ✓ Imported profile                       │ │
│  │  ✓ Found 47 tweets                        │ │
│  │  • Extracting projects...                 │ │
│  │                                           │ │
│  │  💻 GitHub                                │ │
│  │  ▓▓▓▓░░░░░░░░ 30%                         │ │
│  │  ✓ Imported profile                       │ │
│  │  • Analyzing repos...                     │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                  │
│  This usually takes 10-15 seconds               │
│                                                  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Step 4: "Here's What We Learned" (AHA!)        │
│  ─────────────────────────────                  │
│                                                  │
│         ✨ Your AI Identity is Ready            │
│                                                  │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │  From your Twitter & GitHub, we learned:  │ │
│  │                                           │ │
│  │  👤 Robin Sadeghpour                      │ │
│  │     Founder & Full-Stack Developer        │ │
│  │                                           │ │
│  │  🚀 Current Projects:                     │ │
│  │     • Postel (X content creation)         │ │
│  │     • OneContext (AI identity)            │ │
│  │                                           │ │
│  │  🛠️  Tech Stack:                          │ │
│  │     Next.js, React, TypeScript, HonoJS,   │ │
│  │     Tailwind, Supabase                    │ │
│  │                                           │ │
│  │  💬 Recent Activity:                      │ │
│  │     • "Just shipped Postel v2..." (2d ago)│ │
│  │     • Committed to onecontext (5h ago)    │ │
│  │                                           │ │
│  │  📊 Imported:                             │ │
│  │     47 tweets, 12 repos, 234 commits      │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                  │
│  This auto-updates weekly (daily with Pro)      │
│                                                  │
│  ────────────────────────────────               │
│                                                  │
│  Use it with your favorite AI tool:             │
│                                                  │
│  ┌─────────────┬─────────────┬──────────────┐  │
│  │   MCP       │    API      │     CLI      │  │
│  │             │             │              │  │
│  │ For Claude  │ For custom  │ For agents   │  │
│  │ & OpenClaw  │ integrations│ & automation │  │
│  │             │             │              │  │
│  │ [Copy MCP]  │ [Copy API]  │ [Copy CLI]   │  │
│  └─────────────┴─────────────┴──────────────┘  │
│                                                  │
│  [Go to Dashboard]                              │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## **Why This Works:**

### **✅ Shows Intelligence:**
- Not just "imported 47 tweets"
- Shows "extracted 2 projects, tech stack, recent activity"
- Proves AI understanding, not just data storage

### **✅ Immediate Value:**
- See your actual data
- See it organized intelligently
- Proof it works in 1 minute

### **✅ Multiple Use Paths:**
- MCP users copy config
- API users copy key
- CLI users copy command
- All three options visible (user picks relevant one)

### **✅ No Profile Form:**
- Name from OAuth
- Bio from Twitter/GitHub
- Projects extracted from content
- Zero typing required

### **✅ Clear Next Action:**
- Copy one of three options (MCP/API/CLI)
- Or explore dashboard
- User chooses based on their needs

---

## **The Copy Buttons:**

```
┌──────────────────────────────────────┐
│   MCP (Model Context Protocol)      │
│                                      │
│   For Claude Desktop & OpenClaw      │
│                                      │
│   ┌────────────────────────────────┐│
│   │ {                              ││
│   │   "mcp": {                     ││
│   │     "server": "onecontext",    ││
│   │     "key": "octx_abc123..."    ││
│   │   }                            ││
│   │ }                  [Copy]      ││
│   └────────────────────────────────┘│
│                                      │
│   [View Setup Guide]                 │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│   REST API                           │
│                                      │
│   For custom integrations            │
│                                      │
│   ┌────────────────────────────────┐│
│   │ API Key: octx_abc123...        ││
│   │                    [Copy] [Show]││
│   └────────────────────────────────┘│
│                                      │
│   ┌────────────────────────────────┐│
│   │ GET /api/profile/:userId       ││
│   │                      [Copy]    ││
│   └────────────────────────────────┘│
│                                      │
│   [View API Docs]                    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│   CLI                                │
│                                      │
│   For AI agents & automation         │
│                                      │
│   ┌────────────────────────────────┐│
│   │ npx @onecontext/cli \          ││
│   │   --key octx_abc123...         ││
│   │                    [Copy]      ││
│   └────────────────────────────────┘│
│                                      │
│   [View CLI Docs]                    │
└──────────────────────────────────────┘
```

**Presented as tabs or three cards side-by-side.**

User picks what's relevant to them.

---

## **Variant B: Even Simpler (Just MCP for MVP)**

```
After "Here's What We Learned":

────────────────────────────────

Ready to use it?

Copy this to Claude or OpenClaw:

┌────────────────────────────────────┐
│ {                                  │
│   "mcp": {                         │
│     "server": "onecontext",        │
│     "key": "octx_abc123..."        │
│   }                                │
│ }                      [Copy]      │
└────────────────────────────────────┘

Need API or CLI instead? 
[View all options in Dashboard]

[Go to Dashboard]
```

**Simpler.** Focus on MCP (most common use case for OpenClaw users).

Hide API/CLI in dashboard for those who need it.

---

## **Interactive Loading Details:**

### **Make the wait delightful:**

```
Syncing from Twitter...

┌────────────────────────────────────────┐
│  🐦 Twitter                            │
│  ━━━━━━━━░░░░░░░░ 45%                 │
│                                        │
│  ✓ Fetched profile                    │
│  ✓ Imported 47 tweets                 │
│  ✓ Found 3 projects mentioned         │
│  • Analyzing topics...                │
│                                        │
└────────────────────────────────────────┘

Progress updates every 2 seconds:
- Fetched profile (2s)
- Imported tweets (4s)
- Found projects (6s)
- Analyzing topics (8s)
- Extracting tech stack (10s)
- Done! (12s)
```

**Real progress, not fake.** Show actual steps happening.

---

## **If They Skip (No Sources Connected):**

```
Dashboard shows:

┌────────────────────────────────────────┐
│  👋 Welcome!                           │
│                                        │
│  Your AI identity is empty.            │
│  Let's add some knowledge:             │
│                                        │
│  Quick options:                        │
│  [Connect Twitter]                     │
│  [Connect GitHub]                      │
│  [Chat with Assistant]                 │
│                                        │
│  No sources? No problem.               │
│  Use Chat to add knowledge manually.   │
│                                        │
└────────────────────────────────────────┘
```

**Not blocking. Just helpful.**

---

## **Summary: Refined Onboarding**

### **The Perfect Flow:**

1. **Sign up** (OAuth or email) - 10 sec
2. **"Connect your sources"** screen with all options visible - 10 sec
   - Twitter, GitHub, LinkedIn (shows all, grayed if at limit)
   - User picks 1-2 (free allows 2)
3. **Interactive import** with real progress - 15 sec
   - Shows what's happening
   - Builds anticipation
4. **"Here's what we learned"** - AHA MOMENT - 30 sec
   - Shows extracted data
   - Proves intelligence
   - No profile form needed
5. **"Use it now"** - Three options (MCP/API/CLI) - 20 sec
   - User copies relevant one
   - Or explores dashboard
6. **Done** - User in dashboard with real data

**Total: ~90 seconds to fully onboarded with working profile**

**No forms. No typing. Just connections and immediate value.**

---

**Want me to create a detailed onboarding flow document with these ASCII mockups and exact copy/microcopy for each screen?**