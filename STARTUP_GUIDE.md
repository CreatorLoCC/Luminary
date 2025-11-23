# 🚀 LuminarySmartSpace Startup Guide

**The definitive guide for new users** - From zero to `ls status` in under 2 minutes!

---

## 📋 What You'll Get

By the end of this guide, you'll have:
- ✅ LuminarySmartSpace installed and built
- ✅ The `lm` command available globally in any terminal
- ✅ Your projects tracked and visible with `lm status`
- ✅ Claude Code integrated with MCP tools for persistent project memory

---

## 🎯 Prerequisites

Before you start, ensure you have:
- **Node.js 20+** installed ([Download here](https://nodejs.org/))
- **Claude Code** installed ([Get it here](https://claude.com/claude-code))
- **Git** (for cloning the repository)

---

## ⚡ Quick Start (Recommended Path)

### Step 1: Clone the Repository

```bash
git clone https://github.com/CreatorLoCC/Luminary.git
cd LuminarySmartSpace
```

### Step 2: Run the Setup Command

```bash
npm run setup
```

This single command will:
- Install all dependencies
- Build the MCP server and CLI packages
- Link the `lm` command globally

**That's it for the LuminarySmartSpace installation!** ✨

### Step 3: Open Claude Code

Navigate to your projects folder (where you want to track projects):

```bash
cd /path/to/your/projects
claude
```

### Step 4: Initialize with `/lls`

In Claude Code, type:

```
/lls
```

Claude will automatically:
- Detect the LuminarySmartSpace installation
- Create the `.claude/luminary/` directory structure
- Initialize `projects.json`
- Configure the MCP server connection
- Link the CLI globally (if not already done)
- Verify everything works

You'll see a success message like:

```
🎉 Luminary Launch System - READY!

✅ Dependencies installed
✅ Packages built
✅ Project structure initialized (.claude/luminary/)
✅ MCP server configured
✅ CLI linked (lm command available globally)
```

### Step 5: Test It Out

Open a **fresh terminal** and run:

```bash
lm status
```

You should see your projects listed! 🎉

---

## 🔄 Daily Workflow

Once set up, here's how you use LuminarySmartSpace every day:

### Opening a Fresh Terminal

Just run:
```bash
lm status
```

That's your command to see everything at a glance!

### Common Commands

```bash
# View all projects with progress
lm status

# Select a project interactively (no ID needed!)
lm select

# List all tasks across all projects
lm tasks

# Filter tasks by status
lm tasks --status todo
lm tasks --status in-progress
lm tasks --status done

# View specific project details (if you know the ID)
lm context <project-id>
```

### Working with Claude

Just ask Claude to help with your projects:
- "Help me plan a new feature for user authentication"
- "Continue working on the blog platform project"
- "What's the status of my projects?"

Claude will automatically:
- Save project specifications using `save_spec`
- Retrieve context using `get_context`
- Track progress across sessions

---

## 🎯 Understanding the Setup

### What `/lls` Does

The `/lls` command is a **Luminary Launch System** that:

1. **Detects Environment**: Finds your LuminarySmartSpace installation
2. **Installs Dependencies**: Runs `npm install` if needed
3. **Builds Packages**: Compiles TypeScript to JavaScript
4. **Initializes Structure**: Creates `.claude/luminary/projects.json`
5. **Configures MCP**: Sets up `.claude/mcp-config.json` with the correct path
6. **Links CLI**: Makes `lm` command available globally
7. **Verifies**: Tests that `lm status` works

### Where Your Data Lives

All project data is stored in:
```
.claude/luminary/projects.json
```

This file contains:
- Project specifications
- Task lists
- Progress tracking
- Timestamps

**Note**: This file is `.gitignore`d by default, so your project data stays local!

### How the MCP Server Works

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
│      LuminarySmartSpace MCP Server                │
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

---

## 🐛 Troubleshooting

### Issue: `lm` command not found

**Solution**:
```bash
cd /path/to/LuminarySmartSpace/packages/cli
npm link
```

If that doesn't work, check your npm global bin path:
```bash
npm config get prefix
```

The `lm` command should be in `<prefix>/bin/lm`.

### Issue: MCP server not connecting in Claude Code

**Solution**:
1. Verify the path in `.claude/mcp-config.json` is absolute
2. Check the MCP server is built:
   ```bash
   ls /path/to/LuminarySmartSpace/packages/mcp-server/dist/index.js
   ```
3. Rebuild if needed:
   ```bash
   cd /path/to/LuminarySmartSpace
   npm run build:server
   ```

### Issue: Projects not showing up

**Solution**:
1. Check `.claude/luminary/projects.json` exists
2. Verify it contains valid JSON
3. Try running `lm status` from different directories (Luminary scans workspace)

### Issue: `/lls` command not found in Claude Code

**Solution**:
1. The `/lls` command file should be in `.claude/commands/lls.md`
2. If missing, copy it from LuminarySmartSpace:
   ```bash
   cp /path/to/LuminarySmartSpace/.claude/commands/lls.md /path/to/your/project/.claude/commands/
   ```
3. Restart Claude Code

---

## 🎨 Example Workflows

### Workflow 1: Starting a New Project

```bash
# 1. Create your project
mkdir my-awesome-app
cd my-awesome-app

# 2. Initialize with Claude Code
claude
# In Claude: /lls

# 3. Ask Claude to help plan
"Help me create a spec for a blog platform with user auth"

# 4. Claude saves the spec automatically

# 5. View it in terminal
lm status
lm tasks
```

### Workflow 2: Continuing Work Across Sessions

```bash
# Morning: Check what's pending
lm tasks --status todo

# Pick a task and work on it
# ...

# Ask Claude to help
"Continue working on the authentication system"

# Claude retrieves context automatically
# Claude: "I see we're building auth. Last session we completed
#          the OAuth setup. Let's work on JWT tokens next."
```

### Workflow 3: Multi-Project Management

```bash
# You have multiple projects tracked
lm status

# Output:
# 📂 LuminarySmartSpace Projects (3 total)
#
# 📋  Blog Platform [blog-platform]
#    Status: in-progress | Progress: ████████░░ 60%
#
# 🔄  E-commerce Site [ecommerce]
#    Status: planning | Progress: ███░░░░░░░ 25%
#
# ✅  Portfolio Site [portfolio]
#    Status: completed | Progress: ██████████ 100%

# View specific project
lm context blog-platform
```

---

## 🚀 Advanced Setup

### Manual Installation (Alternative to `/lls`)

If you prefer manual control:

```bash
# 1. Install and build
cd /path/to/LuminarySmartSpace
npm install
npm run build

# 2. Link CLI globally
cd packages/cli
npm link

# 3. Create project structure
cd /path/to/your/project
mkdir -p .claude/luminary

# 4. Initialize projects.json
cat > .claude/luminary/projects.json << 'EOF'
{
  "version": "1.0.0",
  "projects": [],
  "lastUpdated": "2025-11-20T00:00:00.000Z"
}
EOF

# 5. Configure MCP server
cat > .claude/mcp-config.json << 'EOF'
{
  "mcpServers": {
    "lumi": {
      "command": "node",
      "args": [
        "/absolute/path/to/LuminarySmartSpace/packages/mcp-server/dist/index.js"
      ],
      "env": {}
    }
  }
}
EOF
# Remember to replace /absolute/path/to/LuminarySmartSpace with your actual path!

# 6. Test
lm status
```

### Workspace Mode (Multiple Projects)

LuminarySmartSpace automatically scans your workspace for all projects!

```
Projects/
  ├── LuminarySmartSpace/      # Luminary installation
  ├── my-app/
  │   └── .claude/luminary/    # Project 1 tracking
  ├── another-project/
  │   └── .claude/luminary/    # Project 2 tracking
  └── third-project/
      └── .claude/luminary/    # Project 3 tracking
```

Running `lm status` from **anywhere** shows ALL projects! 🎉

---

## 📚 Additional Resources

- **[README.md](README.md)** - Full project documentation
- **[QUICK_START.md](QUICK_START.md)** - Condensed quick reference
- **[INSTALL.md](INSTALL.md)** - Detailed installation guide
- **[CLI Documentation](packages/cli/README.md)** - CLI command reference
- **[LUMINARY_BRAND.md](LUMINARY_BRAND.md)** - Brand guidelines and philosophy

---

## 🎓 Understanding LuminarySmartSpace

### The Problem It Solves

**Without LuminarySmartSpace**:
- Claude forgets your project plans when sessions end
- You have to re-explain context every time
- No persistent tracking of progress
- Manual status updates

**With LuminarySmartSpace**:
- Claude remembers your projects across sessions
- Context is automatically retrieved
- Progress is tracked automatically
- Visual progress bars and status updates

### What Makes It Special

- **Zero-friction setup** - One command (`/lls`) and you're ready
- **Workspace-aware** - Automatically finds all your projects
- **Shell-friendly** - Simple `l` command for quick access
- **Claude-integrated** - MCP tools give Claude persistent memory
- **Privacy-focused** - All data stays local (`.gitignore`d by default)

---

## 💡 Pro Tips

### Tip 1: Alias for Even Faster Access

Add to your `.bashrc` or `.zshrc`:
```bash
alias lms='lm status'    # Quick status check
alias lmt='lm tasks'     # Quick task list
```

### Tip 2: Use It for Personal Projects Too

LuminarySmartSpace isn't just for coding projects! Track:
- Writing projects
- Learning goals
- Home improvement projects
- Any multi-step initiative

### Tip 3: Back Up Your Projects

The `projects.json` file is `.gitignore`d, so back it up:
```bash
# Create a backup
cp .claude/luminary/projects.json .claude/luminary/projects.backup.json

# Or sync to cloud storage
cp .claude/luminary/projects.json ~/Dropbox/luminary-backup/
```

### Tip 4: Share Specs (Not Data)

Want to share a project plan with teammates?
```bash
# Extract a specific project
lm context my-project > project-spec.md
```

They can then ask Claude to import it into their own LuminarySmartSpace!

---

## 🤝 Getting Help

### Community & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/CreatorLoCC/Luminary/issues)
- **Discussions**: Share workflows and tips

### Common Questions

**Q: Does LuminarySmartSpace work with other AI assistants?**
A: The CLI (`lm status`, etc.) works standalone. The MCP tools are Claude-specific.

**Q: Can I use it without Claude Code?**
A: Yes! The CLI works independently. You just won't have the MCP integration.

**Q: Is my data sent to any servers?**
A: No! Everything is stored locally in `.claude/luminary/projects.json`.

**Q: Can I edit `projects.json` directly?**
A: Yes, it's just JSON. But be careful with the format!

**Q: What if I have multiple workspaces?**
A: Run `/lls` in each workspace. They'll be tracked separately.

---

## 🎉 You're Ready!

Congratulations! You now have LuminarySmartSpace set up and ready to use.

**Your next steps**:
1. Open a terminal and run `lm status`
2. Ask Claude to help plan your first project
3. Watch as Claude automatically tracks your progress
4. Enjoy persistent project memory across all sessions!

**Remember**: In any fresh terminal, just type `lm status` to see your entire project universe! 🚀

---

<div align="center">

**Built with ❤️ and AI by 💡 Luminary**

*Solo Dev. Startup Energy. Production Quality.*

© 2025 Luminary | CreatorLoCC

</div>
