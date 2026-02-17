

## **UI Flows & Pages (Complete Sketch)**

### **Page Structure:**

```
┌─────────────────────────────────────────────────┐
│  Sidebar (always visible)                       │
│  ├─ 🏠 Dashboard                                │
│  ├─ 💬 Chat (Add Knowledge)                     │
│  ├─ 🔌 Sources                                  │
│  ├─ 📝 Memories                                 │
│  ├─ 🔑 API & MCP                                │
│  └─ ⚙️  Settings                                │
└─────────────────────────────────────────────────┘
```

---

### **1. Dashboard (`/dashboard`)**

```
┌───────────────────────────────────────────────────┐
│  OneContext                              [Avatar] │
├───────────────────────────────────────────────────┤
│                                                    │
│  Profile Summary Card                             │
│  ┌──────────────────────────────────────────────┐│
│  │ Robin Sadeghpour                             ││
│  │ Founder & Full-Stack Developer               ││
│  │ 🌍 Location | 🔗 postel.app                  ││
│  │                                              ││
│  │ Bio: Building Postel and OneContext...       ││
│  │                                              ││
│  │ Last synced: 2 minutes ago                   ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  Connected Sources                                │
│  ┌─────┬─────┬─────┬─────┐                       │
│  │  X  │ GH  │ LI  │ +   │                       │
│  │ ✓   │ ✓   │ ⊕   │ Add │                       │
│  │ 2m  │ 5m  │     │     │                       │
│  └─────┴─────┴─────┴─────┘                       │
│                                                    │
│  Quick Stats                                      │
│  234 Memories | 2 Sources | 12 Projects          │
│                                                    │
│  Recent Activity                                  │
│  ┌──────────────────────────────────────────────┐│
│  │ 🐦 Tweet: "Just shipped..."         2m ago  ││
│  │ 💻 Commit: "Add MCP server"         5m ago  ││
│  │ 📝 Manual: "Building OneContext"   10m ago  ││
│  │ 🐦 Tweet: "OpenClaw is..."         1h ago  ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  Quick Actions                                    │
│  [💬 Add Knowledge] [🔑 Copy API Key]            │
│                                                    │
└───────────────────────────────────────────────────┘
```

**Purpose:** Overview of identity, status, recent activity  
**Key Actions:** Quick add, connect source, view activity

---

### **2. Chat Page (`/chat`)**

```
┌───────────────────────────────────────────────────┐
│  💬 Add Knowledge                                 │
├───────────────────────────────────────────────────┤
│                                                    │
│  [Empty State - First Visit]                      │
│                                                    │
│              💬                                    │
│     What would you like to add?                   │
│                                                    │
│     Just type naturally - I'll figure it out      │
│                                                    │
│     Try these:                                    │
│     ┌────────────────────────────────────────┐   │
│     │ "I'm building OneContext..."          │   │
│     ├────────────────────────────────────────┤   │
│     │ "Add skills: React, TypeScript..."    │   │
│     ├────────────────────────────────────────┤   │
│     │ "Connect my Twitter"                  │   │
│     └────────────────────────────────────────┘   │
│                                                    │
│  ────────────────────────────────────────────────│
│                                                    │
│  [Message input box...]                           │
│  Type, paste, or drag files here...               │
│                                                    │
└───────────────────────────────────────────────────┘

[With Conversation]
┌───────────────────────────────────────────────────┐
│  💬 Add Knowledge                      [New Chat] │
├───────────────────────────────────────────────────┤
│                                                    │
│  You: I'm building OneContext, an AI identity     │
│       platform using Next.js and Mem0             │
│                                                    │
│  Agent: Got it! I've added:                       │
│         ✅ Project: OneContext                    │
│         📝 Description: AI identity platform      │
│         🛠️ Tech Stack: Next.js, Mem0             │
│                                                    │
│         Want me to track this project's progress? │
│         [Yes, track it] [No thanks]               │
│                                                    │
│  You: Yes, and add these skills: React, TypeScript│
│                                                    │
│  Agent: Perfect! Added 2 skills.                  │
│         Also noticed you mentioned Next.js -      │
│         should I add that as a skill too?         │
│                                                    │
│  ────────────────────────────────────────────────│
│  [Message input...]                               │
└───────────────────────────────────────────────────┘
```

**Purpose:** Natural language interface for adding/updating knowledge  
**Key Features:** Suggestions, confirmations, multi-turn conversation

---

### **3. Sources Page (`/sources`)**

```
┌───────────────────────────────────────────────────┐
│  🔌 Sources                                        │
├───────────────────────────────────────────────────┤
│                                                    │
│  Connected (2)                                    │
│  ┌──────────────────┬──────────────────┐         │
│  │  X/Twitter       │  GitHub          │         │
│  │  ────────────    │  ────────────    │         │
│  │  🐦 @yourusername│  💻 yourusername │         │
│  │                  │                  │         │
│  │  Status: Active  │  Status: Active  │         │
│  │  Last: 2m ago    │  Last: 5m ago    │         │
│  │  234 memories    │  45 memories     │         │
│  │                  │                  │         │
│  │  [Sync Now]      │  [Sync Now]      │         │
│  │  [Disconnect]    │  [Disconnect]    │         │
│  └──────────────────┴──────────────────┘         │
│                                                    │
│  Available                                        │
│  ┌──────────────────┬──────────────────┐         │
│  │  LinkedIn        │  Notion          │         │
│  │  ────────────    │  ────────────    │         │
│  │  Sync your       │  Connect your    │         │
│  │  professional    │  workspace and   │         │
│  │  profile         │  pages           │         │
│  │                  │                  │         │
│  │  [Connect]       │  [Connect]       │         │
│  └──────────────────┴──────────────────┘         │
│                                                    │
│  ┌──────────────────┬──────────────────┐         │
│  │  YouTube         │  Substack        │         │
│  │  [Connect]       │  [Connect]       │         │
│  └──────────────────┴──────────────────┘         │
│                                                    │
│  Manual Entry                                     │
│  ┌──────────────────────────────────────────────┐│
│  │ [+ Add Note] [+ Add Project] [📎 Upload File]││
│  └──────────────────────────────────────────────┘│
│                                                    │
└───────────────────────────────────────────────────┘
```

**Purpose:** Manage integrations, see sync status  
**Key Actions:** Connect/disconnect sources, manual sync, add manual entries

---

### **4. Memories Page (`/memories`)**

```
┌───────────────────────────────────────────────────┐
│  📝 Memories                           [+ Add]     │
├───────────────────────────────────────────────────┤
│                                                    │
│  [🔍 Search memories...]                          │
│                                                    │
│  Filters:                                         │
│  [All Sources ▾] [All Types ▾] [All Time ▾]      │
│                                                    │
│  279 memories                                     │
│  ┌──────────────────────────────────────────────┐│
│  │ 🐦 Tweet                           2m ago    ││
│  │ "Just shipped Postel v2 with..."             ││
│  │ Tags: product, launch                        ││
│  │ [View] [Edit] [Pin] [Delete]                 ││
│  ├──────────────────────────────────────────────┤│
│  │ 💻 Commit                          5m ago    ││
│  │ "Add MCP server implementation"              ││
│  │ Repo: onecontext                             ││
│  │ [View] [Edit] [Pin] [Delete]                 ││
│  ├──────────────────────────────────────────────┤│
│  │ 📝 Project                         10m ago   ││
│  │ "OneContext - AI identity platform"          ││
│  │ Tech: Next.js, Mem0                          ││
│  │ ⭐ Pinned                                     ││
│  │ [View] [Edit] [Unpin] [Delete]               ││
│  ├──────────────────────────────────────────────┤│
│  │ 🐦 Tweet                           1h ago    ││
│  │ "OpenClaw is game-changing for..."           ││
│  │ Tags: AI, tools                              ││
│  │ [View] [Edit] [Pin] [Delete]                 ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  [Load More]                                      │
│                                                    │
└───────────────────────────────────────────────────┘
```

**Purpose:** Browse all memories, search, filter, manage  
**Key Actions:** Search, filter, pin, edit, delete

---

### **5. API & MCP Page (`/api`)**

```
┌───────────────────────────────────────────────────┐
│  🔑 API & MCP                                      │
├───────────────────────────────────────────────────┤
│                                                    │
│  MCP Server Setup                                 │
│  ┌──────────────────────────────────────────────┐│
│  │ Connect with Claude, OpenClaw, and more      ││
│  │                                              ││
│  │ 1. Install MCP server:                       ││
│  │ ┌──────────────────────────────────────────┐││
│  │ │ npm install -g @onecontext/mcp-server    │││
│  │ │                              [Copy]      │││
│  │ └──────────────────────────────────────────┘││
│  │                                              ││
│  │ 2. Add to your AI tool config:               ││
│  │ ┌──────────────────────────────────────────┐││
│  │ │ {                                        │││
│  │ │   "contextServer": "...",                │││
│  │ │   "apiKey": "oc_abc123..."               │││
│  │ │ }                            [Copy]      │││
│  │ └──────────────────────────────────────────┘││
│  │                                              ││
│  │ [View Full Setup Guide]                      ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  API Keys                                         │
│  ┌──────────────────────────────────────────────┐│
│  │ Personal API Key                             ││
│  │ oc_abc123...xyz                [Copy] [Show]││
│  │ Created: Feb 15, 2026                        ││
│  │ Last used: 2 minutes ago                     ││
│  │                                              ││
│  │ [Generate New Key] [Revoke]                  ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  REST API Endpoints                               │
│  ┌──────────────────────────────────────────────┐│
│  │ GET  /api/profile/:userId                    ││
│  │ POST /api/memories/search                    ││
│  │ GET  /api/mcp/context                        ││
│  │                                              ││
│  │ [View API Documentation]                     ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  Usage Statistics                                 │
│  This month: 1,234 API calls                     │
│  MCP requests: 567                                │
│                                                    │
└───────────────────────────────────────────────────┘
```

**Purpose:** Setup MCP, manage API keys, view docs  
**Key Actions:** Copy config, generate keys, view docs

---

### **6. Settings Page (`/settings`)**

```
┌───────────────────────────────────────────────────┐
│  ⚙️ Settings                                       │
├───────────────────────────────────────────────────┤
│                                                    │
│  Profile                                          │
│  ┌──────────────────────────────────────────────┐│
│  │ Name:     [Robin Sadeghpour        ]         ││
│  │ Email:    robin@postel.app                   ││
│  │ Bio:      [Founder of Postel...    ]         ││
│  │                                              ││
│  │ [Save Changes]                               ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  Sync Settings                                    │
│  ┌──────────────────────────────────────────────┐│
│  │ Auto-sync frequency: [Daily ▾]               ││
│  │ ☑ Sync at night (off-peak)                   ││
│  │ ☑ Notify me of sync errors                   ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  Privacy                                          │
│  ┌──────────────────────────────────────────────┐│
│  │ Profile visibility: [Private ▾]              ││
│  │ ☐ Allow public profile link                  ││
│  │ ☑ Require API key for all access             ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  Danger Zone                                      │
│  ┌──────────────────────────────────────────────┐│
│  │ [Export All Data]                            ││
│  │ [Delete Account]                             ││
│  └──────────────────────────────────────────────┘│
│                                                    │
└───────────────────────────────────────────────────┘
```

**Purpose:** Account settings, privacy, data export  
**Key Actions:** Edit profile, configure sync, export/delete data

---

## **User Flows**

### **Flow 1: First-Time User Onboarding**

```
1. Sign up (/signup)
   → Enter email/password or OAuth

2. Onboarding wizard
   → "Tell us about yourself"
   → Name, role, bio (optional)
   → [Skip] or [Continue]

3. Connect first source
   → "Connect your first account"
   → Show available sources (X, GitHub, Manual)
   → Click "Connect Twitter"
   → OAuth flow
   → Success: "Syncing your tweets..."

4. Dashboard
   → See populated profile
   → "Your profile is ready! Here's how to use it:"
   → Show MCP setup guide
   → [Copy MCP Config] or [Explore Dashboard]

5. Success state
   → Profile active
   → Can use in AI tools immediately
```

---

### **Flow 2: Adding Knowledge via Chat**

```
1. Click "💬 Chat" in sidebar
   → Opens /chat page

2. Type natural language
   → "I'm building OneContext with Next.js and Mem0"

3. Agent processes
   → Shows typing indicator
   → Extracts entities (project, tech stack)

4. Agent confirms
   → "Got it! I've added:
      ✅ Project: OneContext
      🛠️ Tech: Next.js, Mem0
      Want me to track this project?"

5. User confirms
   → "Yes"
   → Agent: "Great! I'll watch for updates."

6. Memory created
   → Stored in Mem0
   → Appears in Dashboard & Memories
   → Available via MCP immediately
```

---

### **Flow 3: Connecting New Source**

```
1. Go to /sources
   → See connected + available sources

2. Click "Connect" on LinkedIn
   → OAuth modal opens

3. Authorize on LinkedIn
   → Redirect back to app

4. Syncing state
   → "Syncing your LinkedIn profile..."
   → Progress indicator

5. Complete
   → "✅ LinkedIn connected!"
   → Shows sync status: "Last synced: Just now"
   → Shows memory count: "12 new memories added"

6. View memories
   → [View LinkedIn Memories] button
   → Filters memories by source=linkedin
```

---

## **Integration Extension Pattern**

To make adding new integrations easy:

```
integrations/
├── _template/           ← Copy this for new integration
│   ├── adapter.ts       ← Transform platform data → Memory
│   ├── oauth.ts         ← OAuth flow
│   ├── sync.ts          ← Sync logic
│   └── types.ts         ← Platform-specific types
├── twitter/
│   ├── adapter.ts
│   ├── oauth.ts
│   ├── sync.ts
│   └── types.ts
├── github/
│   ├── adapter.ts
│   ├── oauth.ts
│   ├── sync.ts
│   └── types.ts
└── registry.ts          ← Register all integrations
```

**Adding TikTok integration = 4 files:**
1. Copy `_template/` → `tiktok/`
2. Implement adapter, OAuth, sync
3. Add to `registry.ts`
4. Add UI card in `/sources` page

That's it!

---

Now let me update the Product Brief with the correct tech stack: Perfect! I've updated the Product Brief with:

✅ **Chat Interface**: AssistantUI (copy from Postel) + Vercel AI SDK + Vercel AI Gateway  
✅ **Memory/RAG**: Mem0 for semantic search and storage  
✅ **Tool Design**: Vercel AI SDK function calling (reference Postel implementation)  
✅ **Architecture**: HonoJS for MCP + APIs (already correct)  
✅ **References**: Specific instructions to copy patterns from Postel project

---

## **Summary: What You Have Now**

### **✅ Complete UI Flows (6 pages sketched)**
1. Dashboard - Overview & quick actions
2. Chat - Natural language add/update interface
3. Sources - Connect/manage integrations
4. Memories - Browse/search/filter all data
5. API & MCP - Setup guides & keys
6. Settings - Profile, privacy, data management

### **✅ Easy Integration Extension**
- Template-based approach
- 4 files per integration
- Registry pattern
- Just copy → implement → register

### **✅ Updated Product Brief**
- AssistantUI for chat (from Postel)
- Vercel AI SDK + AI Gateway
- Mem0 for RAG/memory
- Tool implementation patterns
- References to Postel codebase

---

## **Ready to Build**

**You can now:**
1. Hand this to an AI coding assistant (Claude, Cursor)
2. Reference Postel project for chat/tool patterns
3. Start with Dashboard + Sources (traditional UI)
4. Add Chat page week 2 (AssistantUI implementation)
5. Integration pattern makes adding sources trivial

**Everything is spec'd out and aligned with your existing Postel stack.**