# 💻 LuminarySmartSpace CLI

**Part of the [💡 Luminary](https://github.com/CreatorLoCC/Luminary) ecosystem**

Command-line interface for viewing and managing LuminarySmartSpace project data.

---

**Built by Luminary** - *"Illuminate Your Development Workflow"*

## 📦 Installation

### Global Installation (Recommended)

Use the one-command installer from the main repository:

```bash
# Unix/Linux/macOS
curl -fsSL https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.sh | bash

# Windows PowerShell
iwr -useb https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.ps1 | iex
```

This automatically:
- ✅ Builds and installs the `lumi` command globally
- ✅ Adds to your PATH
- ✅ Configures Claude Code MCP server

### Local Development

```bash
# From the CLI package directory
cd packages/cli
npm install
npm run build

# Link globally (optional)
npm link
```

---

## 🎯 Commands

All commands use the `lumi` CLI tool.

### `lumi init` 🆕

Initialize a workspace in the current directory.

**Example:**
```bash
cd your-project
lumi init
```

**Prompts you to choose:**
- **Multi-project mode**: Track multiple projects from parent folder
- **Single-project mode**: Track just this project

**Output:**
```
✨ LuminarySmartSpace Workspace Initialization

Choose your mode:
1. Multi-project mode - Track multiple projects from parent folder
2. Single-project mode - Track just this project

Which mode? (1=multi-project, 2=single-project): _
```

---

### `lumi status` ⭐

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

**Options:**
```bash
lumi status                  # Interactive by default
lumi status --no-interactive # Just show list, no prompt
```

---

### `lumi select` ⭐

Interactively select a project to view full details.

**Example:**
```bash
lumi select
```

**Output:**
```
🎯 Select a Project

1. 📋 User Authentication [user-auth]
   ████████░░░░░░░ 50% • 2 hours ago

2. 🔄 Blog Platform [blog-platform]
   ██████░░░░░░░░░ 40% • 2 hours ago

Enter number (or q to quit): 1

🔄 User Authentication System

ID: user-auth
Status: in-progress

📝 Description:
Implement OAuth 2.0 authentication with JWT tokens...

📊 Progress:
███████████████░░░░░░░░░░░░░░░ 50% (2/4)
...
```

**Why use this?**
- No need to remember project IDs
- Quick browsing with numbered selection
- See overview before drilling down

---

### `lumi tasks`

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
lumi tasks                        # All tasks (interactive)
lumi tasks --status todo          # Only todo tasks
lumi tasks --status in-progress   # Only in-progress tasks
lumi tasks --status done          # Only completed tasks
lumi tasks --no-interactive       # No prompt after display
```

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

### `lumi save` 🆕

Analyze recent git commits and save them as completed tasks.

**Example:**
```bash
lumi save
```

Analyzes your recent commits and adds them to the appropriate project's task list.

**Use case**: Retroactively track work you've already completed via git commits.

---

## 📁 Data Storage

The CLI reads project data from workspace-aware locations:

### Multi-Project Mode
```
<workspace-root>/.lumi/
├── config.json
└── projects/
    └── projects.json  # All projects
```

### Single-Project Mode
```
<project-root>/.lumi/
├── config.json
└── projects.json      # This project only
```

### Legacy Fallback
```
.claude/luminary/projects.json
```

The CLI automatically detects which mode is active and reads from the correct location.

---

## 🎨 Features

- ✅ **Beautiful output** with colors and emojis
- ✅ **Interactive by default** - prompts for selection automatically
- ✅ **Workspace-aware** - Detects multi-project vs single-project modes
- ✅ **Progress visualization** with ASCII progress bars
- ✅ **Smart time formatting** (relative times like "3 hours ago")
- ✅ **Task filtering** by status
- ✅ **Cross-project task views**
- ✅ **Detailed project context**
- ✅ **Git integration** with `lumi save` command
- ✅ **Reusable selector utility** - consistent UX

---

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

---

## 📦 Package Structure

```
packages/cli/
├── src/
│   ├── commands/
│   │   ├── init.ts       # Workspace initialization
│   │   ├── status.ts     # Status command
│   │   ├── select.ts     # Interactive selector
│   │   ├── tasks.ts      # Tasks command
│   │   ├── context.ts    # Context command
│   │   └── save.ts       # Git commit analysis
│   ├── workspace-config.ts   # Workspace detection
│   ├── workspace-scanner.ts  # Multi-project scanning
│   ├── storage.ts        # Storage utilities
│   ├── format.ts         # Formatting utilities
│   └── index.ts          # CLI entry point
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md            # This file
```

---

## 🔧 Technologies

- **Commander.js** - CLI framework
- **Chalk** - Terminal colors and styling
- **TypeScript** - Type-safe development
- **Node.js** - Runtime environment

---

## 📝 License

MIT

---

<div align="center">

**Part of the 💡 Luminary ecosystem**

[Main Repository](https://github.com/CreatorLoCC/Luminary) | [More Projects](https://github.com/CreatorLoCC)

Built with ❤️ and AI by **Luminary**

*"Solo Dev. Startup Energy. Production Quality."*

</div>
