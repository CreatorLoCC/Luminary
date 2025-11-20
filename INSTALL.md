# 🚀 Luminary Installation Guide

**One-command setup for project management in Claude Code**

---

## Quick Install

### From LuminaryLightSpace Directory

```bash
npm run setup
```

That's it! This will:
- ✅ Install all dependencies
- ✅ Build MCP server and CLI packages
- ✅ Link the `l` command globally

---

## Initialize a Project

### Method 1: Using the `/lls` Slash Command (Recommended)

In Claude Code, from your project directory:
```
/lls
```

Claude will automatically:
- Create `.claude/luminary/` structure
- Initialize `projects.json`
- Configure MCP server connection
- Verify everything is working

### Method 2: Using the Init Script

From any project directory:
```bash
cd /path/to/your/project
node /path/to/LuminaryLightSpace/scripts/init-project.js
```

Or from LuminaryLightSpace:
```bash
npm run init-project /path/to/your/project
```

### Method 3: Manual Setup

Create the following structure in your project:

```
your-project/
  .claude/
    luminary/
      projects.json
    mcp-config.json
```

**projects.json**:
```json
{
  "version": "1.0.0",
  "projects": [],
  "lastUpdated": "2025-11-20T00:00:00.000Z"
}
```

**mcp-config.json**:
```json
{
  "mcpServers": {
    "luminaryflow": {
      "command": "node",
      "args": [
        "/absolute/path/to/LuminaryLightSpace/packages/mcp-server/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

---

## Verify Installation

### Check CLI is Available
```bash
l status
```

You should see:
```
📂 LuminaryFlow Projects (X total)
```

### Check MCP Server
The MCP server will be automatically available to Claude Code when configured.

---

## Workspace Setup

Luminary automatically scans your workspace for all projects!

**Example workspace structure**:
```
Projects/
  ├── LuminaryLightSpace/      # Luminary installation
  │   └── .claude/luminary/
  ├── my-app/                   # Your project 1
  │   └── .claude/luminary/
  ├── another-project/          # Your project 2
  │   └── .claude/luminary/
  └── third-project/            # Your project 3
      └── .claude/luminary/
```

Running `l status` from **anywhere** will show ALL projects!

---

## Troubleshooting

### Command `l` not found

The CLI wasn't linked globally. Run:
```bash
cd /path/to/LuminaryLightSpace/packages/cli
npm link
```

### MCP Server not connecting

1. Check the path in `.claude/mcp-config.json` is absolute
2. Verify the MCP server is built:
   ```bash
   ls /path/to/LuminaryLightSpace/packages/mcp-server/dist/index.js
   ```
3. Rebuild if needed:
   ```bash
   cd /path/to/LuminaryLightSpace
   npm run build:server
   ```

### Projects not showing up

1. Make sure `.claude/luminary/projects.json` exists
2. Check the file is valid JSON
3. Run `l status` to see all projects across workspace

---

## Uninstall

### Remove Global CLI
```bash
npm unlink -g luminary
```

### Remove Project Tracking
Simply delete the `.claude/luminary/` directory from your projects.

---

## Need Help?

- 📚 [Getting Started Guide](GETTING_STARTED.md)
- 📖 [Main README](README.md)
- 🐛 [Report Issues](https://github.com/CreatorLoCC/Luminary/issues)

---

Built with ❤️ by **💡 Luminary**
