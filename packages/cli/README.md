# 💻 LuminarySmartSpace CLI

**Part of the [💡 Luminary](https://github.com/CreatorLoCC/Luminary) ecosystem**

Command-line interface for viewing and managing LuminarySmartSpace project data.

---

**Built by Luminary** - *"Illuminate Your Development Workflow"*

## 📦 Installation

### Local Development

```bash
# From the CLI package directory
cd packages/cli
npm install
npm run build
```

### Global Installation (Recommended)

```bash
# From the CLI package directory
npm link

# Now you can use luminarysmartspace or the shorthand luminarysmartspace from anywhere!
lumi status
lumi status        # Shorthand - same command, fewer keystrokes!
```

## 🎯 Commands

**Tip**: Use `lumi` as shorthand for `lumi` - e.g., `lumi status` instead of `lumi status`!

### `lumi status` (or `lumi status`) ⭐

View all projects with their status and progress. **Interactive by default** - automatically prompts for project selection!

**Example:**
```bash
lumi status
```

**Output:**
```
📂 LuminarySmartSpace Projects (2 total)

1. 🔄  User Authentication System [user-auth]
   Status: in-progress | Progress: █████░░░░░░░░░░ 33% (1/3)
   Updated: 3 hours ago

2. 📋  Blog Platform [blog-platform]
   Status: planning | Progress: ████████░░░░░░░ 50% (1/2)
   Updated: 1 day ago

🎯 Select a Project

Enter number (or q to quit): _
```

**New in v0.2.0:** Just type a number to view full project details! Use `--no-interactive` to disable the prompt.

---

### `lumi select` (or `lumi select`) ⭐ NEW!

Interactively select a project to view full details.

**Example:**
```bash
lumi select
```

**Output:**
```
🎯 Select a Project

1. 📋 AuraMechanics Development [auramechanics-roadmap]
   ████████░░░░░░░ 50% • 2 hours ago

2. 🔄 Luminary Development Roadmap [luminary-roadmap]
   ██████░░░░░░░░░ 40% • 2 hours ago

Enter number (or q to quit): 1

📋 AuraMechanics Development

ID: auramechanics-roadmap
Status: planning
Source: AuraMechanics

📝 Description:
Human Design analysis platform with accurate chart calculations...

📊 Progress:
███████████████░░░░░░░░░░░░░░░ 50% (4/8)
...
```

**Why use this?**
- No need to remember project IDs
- Quick browsing with numbered selection
- See overview before drilling down
- Perfect for daily standup reviews!

---

### `lumi tasks` ⭐

List all tasks across all projects. **Interactive by default** - automatically prompts for project selection after showing tasks!

**Example:**
```bash
lumi tasks
```

**Output:**
```
📋 All Tasks

Summary:
  ⬜ Todo: 2 | 🔄 In Progress: 1 | ✅ Done: 2

🔄 In Progress
  🔄  Implement JWT service [user-auth/2]
      Project: User Authentication System

⬜ Todo
  ⬜  Add refresh token logic [user-auth/3]
      Project: User Authentication System

🎯 Select a Project

Enter number (or q to quit): _
```

**Filter by status:**
```bash
lumi tasks --status todo           # Interactive by default
lumi tasks --no-interactive        # Just show tasks, no prompt
lumi tasks --status in-progress
lumi tasks --status done
```

**New in v0.2.0:** After viewing tasks, you're prompted to select a project for full details!

---

### `lumi context <project-id>`

Show detailed context for a specific project.

**Example:**
```bash
lumi context user-auth
```

**Output:**
```
🔄 User Authentication System

ID: user-auth
Status: in-progress

📝 Description:
Implement OAuth 2.0 authentication with JWT tokens for secure user login

📊 Progress:
██████████░░░░░░░░░░░░░░░░░░░░ 33% (1/3)

  ✅ Done: 1
  🔄 In Progress: 1
  ⬜ Todo: 1

📋 Tasks:
  🔄  Implement JWT service [2]
  ⬜  Add refresh token logic [3]
  ✅  Setup OAuth provider configuration [1]

🕒 Timeline:
  Created: 19/11/2025, 09:00:00
  Last Updated: 20/11/2025, 08:30:00 (3 hours ago)
```

---

## 📁 Data Location

The CLI reads project data from:
```
.claude/luminary/projects.json
```

This file is created and managed by the LuminarySmartSpace MCP server. The CLI provides read-only access for viewing your project data.

## 🎨 Features

- ✅ **Beautiful output** with colors and emojis
- ✅ **Interactive by default** - prompts for selection automatically ⭐ NEW!
- ✅ **Reusable selector utility** - consistent UX across all commands
- ✅ **Progress visualization** with ASCII progress bars
- ✅ **Smart time formatting** (relative times like "3 hours ago")
- ✅ **Task filtering** by status
- ✅ **Cross-project task views**
- ✅ **Detailed project context**
- ✅ **Workspace-aware** scanning for multi-project setups
- ✅ **Git integration** with `lumi save` command

## 🛠️ Development

### Build
```bash
npm run build
```

### Development Mode (Watch)
```bash
npm run dev
```

### Type Check
```bash
npm run type-check
```

## 📦 Package Structure

```
packages/cli/
├── src/
│   ├── commands/
│   │   ├── status.ts    # Status command implementation
│   │   ├── select.ts    # Interactive project selector (NEW!)
│   │   ├── tasks.ts     # Tasks command implementation
│   │   └── context.ts   # Context command implementation
│   ├── workspace-scanner.ts  # Multi-project workspace scanning
│   ├── storage.ts       # Storage utilities
│   ├── format.ts        # Formatting utilities
│   └── index.ts         # CLI entry point
├── dist/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Technologies

- **Commander.js** - CLI framework
- **Chalk** - Terminal colors and styling
- **TypeScript** - Type-safe development
- **Node.js** - Runtime

## 📝 License

MIT

---

<div align="center">

**Part of the 💡 Luminary ecosystem**

[Main Repository](https://github.com/CreatorLoCC/Luminary) | [More Projects](https://github.com/CreatorLoCC)

Built with ❤️ and AI by **Luminary**

*"Solo Dev. Startup Energy. Production Quality."*

</div>
