# 💻 LuminaryFlow CLI

**Part of the [💡 Luminary](https://github.com/CreatorLoCC/Luminary) ecosystem**

Command-line interface for viewing and managing LuminaryFlow project data.

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

### Global Installation (Optional)

```bash
# From the CLI package directory
npm link

# Now you can use 'luminary' from anywhere!
luminary status
```

## 🎯 Commands

### `luminary status`

View all projects with their status and progress.

**Example:**
```bash
luminary status
```

**Output:**
```
📂 LuminaryFlow Projects (2 total)

🔄  User Authentication System [user-auth]
   Status: in-progress | Progress: █████░░░░░░░░░░ 33% (1/3)
   Updated: 3 hours ago

📋  Blog Platform [blog-platform]
   Status: planning | Progress: ████████░░░░░░░ 50% (1/2)
   Updated: 1 day ago
```

---

### `luminary tasks`

List all tasks across all projects.

**Example:**
```bash
luminary tasks
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
```

**Filter by status:**
```bash
luminary tasks --status todo
luminary tasks --status in-progress
luminary tasks --status done
```

---

### `luminary context <project-id>`

Show detailed context for a specific project.

**Example:**
```bash
luminary context user-auth
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

This file is created and managed by the LuminaryFlow MCP server. The CLI provides read-only access for viewing your project data.

## 🎨 Features

- ✅ **Beautiful output** with colors and emojis
- ✅ **Progress visualization** with ASCII progress bars
- ✅ **Smart time formatting** (relative times like "3 hours ago")
- ✅ **Task filtering** by status
- ✅ **Cross-project task views**
- ✅ **Detailed project context**

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
│   │   ├── tasks.ts     # Tasks command implementation
│   │   └── context.ts   # Context command implementation
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

[Main Repository](https://github.com/CreatorLoCC/Luminary) | [More Projects](https://github.com/CreatorLoCC) | [Contact](mailto:thecreator@thelocc.com)

Built with ❤️ and AI by **Luminary**

*"Solo Dev. Startup Energy. Production Quality."*

</div>
