# ⚡ Quick Setup - LuminarySmartSpace

**Get up and running in 3 minutes!**

---

## 🚀 Step 1: Install (30 seconds)

**Unix/Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.sh | bash
```

**Windows PowerShell:**
```powershell
iwr -useb https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.ps1 | iex
```

**What this does:**
- ✅ Downloads and builds LuminarySmartSpace
- ✅ Creates the `lumi` command
- ✅ **Automatically configures Claude Code!** ⭐
- ✅ Adds to your PATH

---

## 🔄 Step 2: Restart Claude Code (10 seconds)

**IMPORTANT:** You MUST restart Claude Code for it to load the MCP server.

```bash
# Close Claude Code completely, then reopen it
```

**Why?** Claude Code loads MCP servers on startup. The installer configured it, but Claude needs to restart to see it.

---

## ✅ Step 3: Verify MCP Server is Loaded (10 seconds)

In Claude Code, ask:

```
What MCP tools do you have available?
```

**You should see:**
- ✅ `mcp__luminarysmartspace__save_spec`
- ✅ `mcp__luminarysmartspace__get_context`
- ✅ `mcp__luminarysmartspace__list_projects`
- ✅ `mcp__luminarysmartspace__sync_work`

**If you DON'T see these:**
1. Check the config was created: `~/.config/claude-code/mcp-config.json`
2. Make sure you restarted Claude Code
3. Check the [Troubleshooting](#troubleshooting) section below

---

## 🎯 Step 4: Initialize Your Project (30 seconds)

```bash
cd your-project
lumi init
```

**Choose your mode:**
- **Multi-project**: Track multiple projects from a parent folder
- **Single-project**: Track just this project

---

## 🎉 Step 5: Start Using It!

### Option A: Use with Agentic Startup Commands

```
/start:specify "Build user authentication"
```

Claude will:
1. Create a detailed spec
2. **Automatically save it** via `save_spec` MCP tool
3. Store in `.lumi/projects.json`

```
/start:implement user-auth
```

Claude will:
1. **Automatically load** the spec via `get_context`
2. Implement the features
3. **Save progress** as tasks complete

### Option B: View with CLI

```bash
lumi status        # See all projects
lumi tasks         # See all tasks
lumi context <id>  # See project details
```

---

## 🔧 Troubleshooting

### MCP Tools Not Showing

**Problem:** Claude says "I don't have those tools"

**Solutions:**

1. **Check config exists:**
   ```bash
   # Unix/Mac
   cat ~/.config/claude-code/mcp-config.json

   # Windows
   type %USERPROFILE%\.config\claude-code\mcp-config.json
   ```

2. **Verify path is correct:**
   The config should point to where you installed (usually `~/.lumi/` or `C:\Users\<You>\.lumi\`)

3. **Restart Claude Code:**
   Must completely quit and reopen (not just reload window)

4. **Check Node.js:**
   ```bash
   node --version  # Should be 20+
   ```

5. **Test MCP server manually:**
   ```bash
   node ~/.lumi/packages/mcp-server/dist/index.js
   ```
   Should start without errors

---

### `lumi` Command Not Found

**Problem:** Terminal says "command not found: lumi"

**Solutions:**

1. **Restart terminal** (PATH updates need new shell)

2. **Add to PATH manually** (if needed):
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export PATH="$HOME/.local/bin:$PATH"
   ```

3. **Verify it was installed:**
   ```bash
   ls ~/.local/bin/lumi  # Unix/Mac
   ```

---

### Projects Not Saving

**Problem:** `/start:specify` doesn't persist data

**Solutions:**

1. **Verify MCP tools are loaded** (see above)

2. **Check workspace was initialized:**
   ```bash
   ls .lumi/config.json
   ```

3. **Run `lumi init` in your project:**
   ```bash
   cd your-project
   lumi init
   ```

4. **Check permissions:**
   ```bash
   # Make sure you can write to .lumi/
   touch .lumi/test && rm .lumi/test
   ```

---

## 📚 Next Steps

Once everything is working:

- **Read:** [INSTALLATION.md](INSTALLATION.md) - Full installation guide
- **Read:** [README.md](README.md) - Feature documentation
- **Read:** [CHANGELOG.md](CHANGELOG.md) - What's new in v0.3.0

---

## 💡 Quick Reference

### The Complete Flow

```
1. Install → 2. Restart Claude → 3. Init workspace → 4. Use!

curl ... | bash
    ↓
Close & reopen Claude Code
    ↓
lumi init
    ↓
/start:specify "your feature"
    ↓
lumi status  # See it saved!
```

### File Locations

```
~/.lumi/                          # Install directory
~/.local/bin/lumi                 # CLI command
~/.config/claude-code/            # Claude config
  └── mcp-config.json             # MCP server config

your-project/.lumi/               # Project workspace
  ├── config.json                 # Workspace config
  └── projects.json               # Project data
```

---

**Questions?** [Open an issue](https://github.com/CreatorLoCC/Luminary/issues)

**Working?** Start tracking your projects! 🚀
