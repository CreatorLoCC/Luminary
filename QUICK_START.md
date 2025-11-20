# ⚡ Luminary Quick Start

**Get Luminary running in under 60 seconds!**

---

## 🚀 One-Time Setup (LuminarySmartSpace)

```bash
cd /path/to/LuminarySmartSpace
npm run setup
```

**Done!** The `lm` command is now available globally.

---

## 🎯 Initialize Any Project

### Option 1: Automatic Script
```bash
cd /path/to/your/project
node /path/to/LuminarySmartSpace/scripts/init-project.js
```

### Option 2: From LuminarySmartSpace
```bash
cd /path/to/LuminarySmartSpace
npm run init-project /path/to/your/project
```

### Option 3: Use `/lls` in Claude Code
1. Navigate to your project directory in Claude Code
2. Run: `/lls`
3. Claude will auto-initialize everything!

**Note**: The `/lls` command may require restarting Claude Code after first copying the command file.

---

## ✅ Verify It Works

```bash
lm status
```

You should see your projects listed!

---

## 🎨 Daily Usage

### View All Projects
```bash
lm status
```

### Select a Project Interactively ⭐
```bash
lm select
```
Pick from a numbered list - no need to remember project IDs!

### View All Tasks
```bash
lm tasks
```

### View Specific Project (by ID)
```bash
lm context <project-id>
```

### Filter Tasks by Status
```bash
lm tasks --status todo
lm tasks --status in-progress
lm tasks --status done
```

---

## 💡 Working with Claude

Once initialized, Claude can:
- **Save project specs** using the `save_spec` MCP tool
- **Retrieve context** using the `get_context` MCP tool
- **List all projects** using the `list_projects` MCP tool

Just ask Claude to help plan your project, and it will automatically track everything!

---

## 🌟 Workspace Mode

Luminary automatically aggregates ALL projects in your workspace!

```
Projects/
  ├── project-1/.claude/luminary/
  ├── project-2/.claude/luminary/
  └── project-3/.claude/luminary/
```

Run `lm status` from **anywhere** and see all 3 projects! 🎉

---

## 🆘 Need Help?

- **CLI not found?** → Run `npm run setup` from LuminarySmartSpace
- **Projects not showing?** → Check `.claude/luminary/projects.json` exists
- **MCP not working?** → Verify `.claude/mcp-config.json` has correct path

📚 Full docs: [INSTALL.md](INSTALL.md)

---

**Now go build something amazing!** 💪
