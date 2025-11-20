# 🚀 Getting Started with LuminarySmartSpace

**5-Minute Setup Guide** - Get up and running fast!

---

## 📦 Quick Install

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Everything
```bash
npm run build
```

### 3. Install CLI Globally
```bash
cd packages/cli
npm link
```

**Done!** You now have the `lm` command available globally. ⚡

---

## 🎯 Using the CLI

### View All Projects
```bash
lm status
```

### Select a Project Interactively
```bash
lm select
```
Pick from a numbered list - easiest way to view project details!

### List All Tasks
```bash
lm tasks
```

### Filter Tasks
```bash
lm tasks --status todo
lm tasks --status in-progress
lm tasks --status done
```

### View Project Details (by ID)
```bash
lm context <project-id>
```

---

## 🔧 Using the MCP Server (with Claude Code)

### 1. Build the Server
```bash
npm run build:server
```

### 2. Start Claude Code with MCP
```bash
claude --mcp-config .claude/mcp-config.json
```

### 3. Available MCP Tools

Claude can now use these tools:

**`save_spec`** - Save a project specification
```javascript
save_spec({
  id: "my-project",
  title: "My Project",
  description: "What I'm building",
  tasks: [
    { id: "1", title: "First task", status: "todo" }
  ],
  status: "planning"
})
```

**`get_context`** - Retrieve project context
```javascript
get_context({ id: "my-project" })
```

**`list_projects`** - See all projects
```javascript
list_projects()
```

---

## 📂 Where's My Data?

All project data is stored in:
```
.claude/luminary/projects.json
```

This file is automatically created and managed by the MCP server.

---

## 🎨 Common Workflows

### Workflow 1: Planning a New Project
1. Ask Claude to help you plan
2. Claude uses `save_spec` to store the project
3. Use `lm status` to view your project

### Workflow 2: Continuing Work
1. Run `lm tasks --status todo` to see what's next
2. Pick a task and work on it
3. Ask Claude to update the task status

### Workflow 3: Checking Progress
1. Run `lm status` for overview
2. Run `lm context <project-id>` for details
3. Celebrate completed tasks! 🎉

---

## 🐛 Troubleshooting

### CLI Command Not Found
```bash
cd packages/cli
npm link
```

### MCP Server Not Working
```bash
# Rebuild the server
npm run build:server

# Check it exists
ls packages/mcp-server/dist/index.js
```

### Projects Not Showing
Check that `.claude/luminary/projects.json` exists and is valid JSON.

---

## 📚 Learn More

- **Main README**: [README.md](README.md)
- **CLI Docs**: [packages/cli/README.md](packages/cli/README.md)
- **Brand Guide**: [LUMINARY_BRAND.md](LUMINARY_BRAND.md)

---

## 💡 Tips

- **Shorthand**: Use `lm` instead of `luminary` for speed
- **Filter**: Use `--status` to focus on specific tasks
- **JSON**: Edit `.claude/luminary/projects.json` directly if needed
- **Backup**: The projects.json file is gitignored - back it up!

---

**Need Help?** [Open an issue](https://github.com/CreatorLoCC/Luminary/issues)

Built with ❤️ by **💡 Luminary**
