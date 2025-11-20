---
description: Initialize The Agentic Startup framework in your Claude Code environment
tags: [setup, initialization, configuration]
---

# /start:init - Initialize The Startup Framework

Welcome to **The Agentic Startup** framework! This command sets up your environment for high-velocity, quality-first development.

## What Gets Initialized

1. **MCP Server** - Persistent project memory across sessions
2. **Slash Commands** - `/start:*` workflow automation
3. **Development Tools** - Linting, formatting, testing configs
4. **Launcher Scripts** - `lls` for quick startup

## Initialization Workflow

### Check Current Setup

First, verify what's already configured:

```bash
ls -la .claude/
ls -la packages/mcp-server/dist/
```

### Components Checklist

- [ ] `.claude/commands/` - Slash commands directory
- [ ] `.claude/mcp-config.json` - MCP configuration
- [ ] `packages/mcp-server/` - MCP server code
- [ ] `packages/mcp-server/dist/` - Built MCP server
- [ ] `lls` launcher scripts
- [ ] `.eslintrc.json`, `.prettierrc.json` - Dev tools

### Setup Instructions

Based on what's missing, provide setup steps:

#### If MCP Server Not Built
```bash
cd packages/mcp-server
npm install
npm run build
cd ../..
```

#### If Commands Missing
```
The /start:* commands are now installed!

Available commands:
- /start:specify <description> - Create comprehensive specs
- /start:implement <spec-id> - Execute implementation
- /start:analyze <area> - Discover and document patterns
- /start:refactor <component> - Safe code refactoring
- /start:list - View all projects
- /start:context <spec-id> - View project details
```

#### If MCP Config Missing
```json
{
  "mcpServers": {
    "luminarysmartspace": {
      "command": "node",
      "args": ["<absolute-path>/packages/mcp-server/dist/index.js"]
    }
  }
}
```

### Verify Installation

```bash
# Test MCP server builds
cd packages/mcp-server && npm run build

# Test launcher
./lls --help

# Verify commands
ls .claude/commands/
```

## Welcome Message

```
🚀 The Agentic Startup Framework - Initialized!

✅ What's Ready:
- MCP Server: Persistent project memory
- Slash Commands: /start:* workflows
- Dev Tooling: Linting, formatting
- Launcher: Type `lls` to start

📚 Quick Start Guide:

1. CREATE A SPEC
   /start:specify "Build a blog platform"
   → Creates comprehensive specification
   → Auto-saves to MCP storage

2. IMPLEMENT IT
   /start:implement blog-platform
   → Loads spec from MCP
   → Executes tasks systematically
   → Tracks progress across sessions

3. VIEW PROGRESS
   /start:list
   → See all your projects
   → Check completion status

4. ANALYZE & IMPROVE
   /start:analyze security
   → Discover patterns
   → Document findings
   → Create improvement specs

🎯 Key Features:

PERSISTENT MEMORY
Your specs persist across Claude sessions via MCP.
Stop and resume work anytime!

SYSTEMATIC EXECUTION
Specifications → Tasks → Implementation
No guessing, no forgetting

QUALITY BUILT-IN
Security reviews, refactoring workflows,
documentation integrated

STARTUP VELOCITY
Parallel agents, rapid iteration,
deliver fast AND good

💡 Pro Tips:

- Use `./lls` to start Claude with MCP loaded
- Specs use lowercase-hyphen IDs: "user-auth", "blog-platform"
- All progress auto-saves to .claude/luminary/projects.json
- Commands work together: specify → implement → analyze → refactor

📖 Documentation:
- README.md - Overview and quick start
- OPTIMIZATION_COMPLETE.md - Code quality details
- CODE_REVIEW_SUMMARY.md - Security and best practices

🎉 You're ready to build! Try:
   /start:specify "your first project idea"
```

## Troubleshooting

### MCP Tools Not Available
```
Problem: Claude doesn't see mcp__luminarysmartspace__* tools

Solution:
1. Restart Claude with: ./lls
2. Or manually: claude --mcp-config .claude/mcp-config.json
3. Verify MCP server is built: ls packages/mcp-server/dist/
```

### Commands Not Found
```
Problem: /start:* commands not recognized

Solution:
1. Check .claude/commands/ exists
2. Verify .md files are present
3. Restart Claude Code
```

### Build Failures
```
Problem: npm run build fails

Solution:
1. Install dependencies: npm install
2. Check Node version: node --version (need 20+)
3. Review error messages
```

## Next Steps

After initialization:

1. **Create Your First Spec**
   ```
   /start:specify "Build a task management system"
   ```

2. **Explore the Codebase**
   ```
   /start:analyze technical
   ```

3. **Review Documentation**
   - Read OPTIMIZATION_COMPLETE.md
   - Check CODE_REVIEW_SUMMARY.md

4. **Start Building!**
   ```
   /start:implement <your-spec-id>
   ```

---

Welcome to The Startup way: Fast AND good! 🚀
