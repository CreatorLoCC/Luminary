# 🌊 LuminaryFlow

**Project Management for Claude Code** - Part of the **[💡 Luminary](https://github.com/CreatorLoCC/Luminary)** ecosystem

Give Claude persistent memory for your projects. Plan once, remember forever.

---

**Built by**: [Luminary](https://github.com/CreatorLoCC/Luminary) - Solo AI Dev Company
**Tagline**: *"Illuminate Your Development Workflow"*

## ⚡ Quick Start

### New User? Start Here! 👋

**[📖 Read the Startup Guide](STARTUP_GUIDE.md)** - Complete walkthrough from zero to `l status`

### Already Know What to Do?

```bash
# 1. One-command setup
npm run setup

# 2. Initialize in Claude Code
/lls

# 3. Check it works
l status
```

**That's it!** ✨

---

## 📚 Documentation

- **[🚀 STARTUP_GUIDE.md](STARTUP_GUIDE.md)** - Complete guide for new users (START HERE!)
- **[⚡ QUICK_START.md](QUICK_START.md)** - Quick reference for common tasks
- **[🔧 INSTALL.md](INSTALL.md)** - Installation troubleshooting
- **[📖 GETTING_STARTED.md](GETTING_STARTED.md)** - Development workflows

---

## 🎯 What Is This?

**The Problem**: Claude forgets your project plans when the session ends.

**The Solution**: LuminaryFlow gives Claude tools to:
- 💾 **Save** project specs and tasks
- 🔄 **Retrieve** context across sessions
- 📊 **Track** progress over time

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Claude Code Session                 │
│  (You chatting with Claude)                 │
└─────────────┬───────────────────────────────┘
              │
              │ Uses MCP tools:
              │ - save_spec
              │ - get_context
              │ - list_projects
              │
┌─────────────▼───────────────────────────────┐
│      LuminaryFlow MCP Server                │
│  (Node.js process running in background)    │
└─────────────┬───────────────────────────────┘
              │
              │ Reads/Writes
              │
┌─────────────▼───────────────────────────────┐
│    .claude/luminary/projects.json           │
│  (Your project data storage)                │
└─────────────────────────────────────────────┘
```

## ✨ Features

### 💻 CLI Viewer (NEW!)

View your project data from the command line:

```bash
# View all projects
luminary status

# List all tasks
luminary tasks

# Filter tasks by status
luminary tasks --status todo

# View project details
luminary context user-auth
```

**Installation:**
```bash
cd packages/cli
npm install
npm run build
npm link  # Make 'luminary' available globally
```

See [CLI Documentation](packages/cli/README.md) for details.

### 🔧 MCP Tools (Available to Claude)

#### `save_spec`
Save a project specification with title, description, and tasks.

**Usage by Claude:**
```
During /start:specify, Claude can call:
save_spec({
  id: "user-auth",
  title: "User Authentication System",
  description: "OAuth 2.0 authentication with JWT tokens",
  tasks: [
    { id: "1", title: "Setup OAuth provider", status: "todo" },
    { id: "2", title: "Implement JWT service", status: "in-progress" }
  ],
  status: "planning"
})
```

#### `get_context`
Retrieve full project context including tasks and progress.

**Usage by Claude:**
```
To remember what was being worked on:
get_context({ id: "user-auth" })

Returns:
- Project description
- All tasks with status
- Progress metrics
- Last updated timestamp
```

#### `list_projects`
View all tracked projects with their status.

**Usage by Claude:**
```
To see what projects exist:
list_projects()

Returns:
- All projects sorted by update time
- Progress percentages
- Quick status overview
```

## 🚀 Quick Start

**TL;DR:** Just type `./lls` and you're ready to go! 🎯

### Prerequisites

- Node.js 20+ installed
- Claude Code CLI installed

### Installation

1. **Clone this repository**
   ```bash
   git clone <your-repo-url>
   cd LuminaryLightSpace
   ```

2. **Launch with the cross-platform script**
   ```bash
   ./lls          # All platforms (Git Bash, WSL, Mac, Linux)
   lls.bat        # Windows CMD
   ./lls.sh       # Mac/Linux alternative
   ```

   The launcher script will:
   - ✅ Auto-install dependencies if needed
   - ✅ Auto-build the MCP server if needed
   - ✅ Start Claude Code with MCP tools loaded

3. **That's it!** You're ready to use the MCP tools.

### Manual Setup (Alternative)

If you prefer manual control:

```bash
# 1. Install dependencies
cd packages/mcp-server
npm install

# 2. Build the project
npm run build

# 3. Start Claude with MCP config
cd ../..
claude --mcp-config .claude/mcp-config.json
```

### Global Access (Optional)

Make `lls` available from anywhere - see [INSTALL.md](INSTALL.md) for PATH setup instructions.

## 📖 Usage Examples

### Example 1: During Spec Creation

```
You: "Help me create a spec for a blog platform"

Claude: [Does planning work]
Claude: [Calls save_spec tool]
        ↓
Your spec is saved to .claude/luminary/projects.json!
```

### Example 2: Continuing Work Later

```
New session:
You: "Continue working on the blog platform"

Claude: [Calls get_context({ id: "blog-platform" })]
Claude: "I see we're building a blog platform. You have:
         - 5 tasks total
         - 2 completed
         - Currently working on the comment system

         Let's continue from there!"
```

### Example 3: Checking All Projects

```
You: "What projects do I have tracked?"

Claude: [Calls list_projects()]
Claude: "You have 3 projects:
         1. Blog Platform (planning) - 40% complete
         2. User Auth (in-progress) - 75% complete
         3. Dashboard (completed) - 100% complete"
```

## 🗂️ Project Structure

```
LuminaryLightSpace/
├── packages/
│   ├── mcp-server/              # MCP Server implementation
│   │   ├── src/
│   │   │   ├── index.ts         # Server entry point
│   │   │   ├── storage/         # JSON file storage
│   │   │   │   ├── types.ts     # TypeScript types
│   │   │   │   └── store.ts     # Storage operations
│   │   │   └── tools/           # MCP tool implementations
│   │   │       ├── save-spec.ts
│   │   │       ├── get-context.ts
│   │   │       └── list-projects.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── cli/                     # CLI Viewer (NEW!)
│       ├── src/
│       │   ├── commands/        # Command implementations
│       │   │   ├── status.ts    # View all projects
│       │   │   ├── tasks.ts     # List all tasks
│       │   │   └── context.ts   # Show project details
│       │   ├── storage.ts       # Storage utilities
│       │   ├── format.ts        # Formatting utilities
│       │   └── index.ts         # CLI entry point
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── .claude/
│   ├── mcp-config.json          # MCP configuration
│   └── luminary/
│       └── projects.json        # Project data (auto-created)
│
└── README.md                    # This file
```

## 🛠️ Development

### Running in Development Mode

```bash
cd packages/mcp-server
npm run dev  # Watches for changes and recompiles
```

### Type Checking

```bash
npm run type-check
```

### Building

```bash
npm run build
```

## 📊 Data Storage

Projects are stored in `.claude/luminary/projects.json`:

```json
{
  "version": "1.0.0",
  "projects": [
    {
      "id": "user-auth",
      "title": "User Authentication System",
      "description": "OAuth 2.0 with JWT",
      "status": "in-progress",
      "tasks": [
        {
          "id": "1",
          "title": "Setup OAuth",
          "status": "done",
          "createdAt": "2025-11-19T..."
        }
      ],
      "createdAt": "2025-11-19T...",
      "updatedAt": "2025-11-19T..."
    }
  ],
  "lastUpdated": "2025-11-19T..."
}
```

**Note:** The `.gitignore` excludes `projects.json` so your project data stays local!

## 🎓 Learning Resources

This project is perfect for learning:

### TypeScript Concepts
- Type definitions and interfaces
- Async/await patterns
- ES Modules
- Zod schema validation

### MCP Protocol
- Server setup
- Tool definitions
- Request handling
- Stdio transport

### Node.js Skills
- File I/O operations
- JSON data management
- Process management
- NPM package structure

## 🔮 Future Enhancements

### Phase 2: CLI Viewer (Coming Soon!)
```bash
luminary status              # View all projects
luminary tasks               # List all tasks
luminary context <id>        # Show project details
```

### Phase 3: TUI Dashboard
- Real-time visual dashboard
- Task kanban board
- Progress visualization

### Phase 4: Advanced Features
- Multiple project workspaces
- Task dependencies
- Export to Markdown
- Git integration

## 🐛 Troubleshooting

### MCP Server Not Starting

1. **Check build output exists:**
   ```bash
   ls packages/mcp-server/dist/index.js
   ```

2. **Verify path in mcp-config.json is correct**

3. **Test server manually:**
   ```bash
   node packages/mcp-server/dist/index.js
   ```

### Tools Not Showing in Claude

1. **Ensure you're using the --mcp-config flag:**
   ```bash
   claude --mcp-config .claude/mcp-config.json
   ```

2. **Check Claude's tool list:**
   Ask Claude: "What tools do you have available?"

### Projects Not Saving

1. **Check .claude/luminary/ directory exists**
2. **Verify write permissions**
3. **Look for errors in Claude's output**

## 🤝 Contributing

This is a learning/passion project! Contributions welcome:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use and modify!

## 🙏 Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol)
- Inspired by the Claude Code community
- Developed with AI-assisted workflows

---

## 💡 About Luminary

LuminaryFlow is part of the **Luminary** ecosystem - a solo AI dev company building production-ready, open-source tools for developers.

**Other Luminary Projects**:
- 🌊 LuminaryFlow (this project) - Project management for Claude Code
- 🔮 More coming soon...

**Connect**:
- 🐙 GitHub: [@CreatorLoCC](https://github.com/CreatorLoCC)
- 📧 Email: thecreator@thelocc.com
- 🏢 Company: [Luminary](https://github.com/CreatorLoCC/Luminary)

**Motto**: *"Solo Dev. Startup Energy. Production Quality."*

---

<div align="center">

**Happy coding with LuminaryFlow! 🚀**

Questions or feedback? [Open an issue](https://github.com/CreatorLoCC/Luminary/issues)!

Built with ❤️ and AI by **💡 Luminary**

© 2025 Luminary | CreatorLoCC

</div>
