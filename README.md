# ✨ LuminarySmartSpace

**Smart project tracking for Claude Code** - Part of the **[💡 Luminary](https://github.com/CreatorLoCC/Luminary)** ecosystem

Give Claude persistent memory for your projects. Plan once, remember forever.

---

**Built by**: [Luminary](https://github.com/CreatorLoCC/Luminary) - Solo AI Dev Company
**App Name**: LuminarySmartSpace
**Command**: `lumi` (short, memorable!)
**Tagline**: *"Install once. Track forever."*

---

## ⚡ One-Command Installation

**Get started in 3 minutes!** 🚀

### Unix/Linux/macOS
```bash
curl -fsSL https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.sh | bash
```

### Windows PowerShell
```powershell
iwr -useb https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.ps1 | iex
```

**That's it!** The installer:
- ✅ Checks prerequisites (Node.js 20+, git)
- ✅ Builds and installs LuminarySmartSpace
- ✅ Creates the global `lumi` command
- ✅ **Auto-configures Claude Code MCP server** ⭐
- ✅ Adds to your PATH automatically

---

## 🎯 Quick Start

**After installation:**

1. **RESTART Claude Code** (critical - loads the MCP server!)
2. **Initialize your workspace:**
   ```bash
   cd your-project
   lumi init
   ```
3. **Choose your mode:**
   - Multi-project: Track multiple projects from parent folder
   - Single-project: Track just this project
4. **Start tracking!**
   ```bash
   lumi status
   ```

📖 **New to LuminarySmartSpace?** Read [QUICK_SETUP.md](QUICK_SETUP.md) - **START HERE!** ⭐

---

## 🌟 What is LuminarySmartSpace?

**The Problem**: Claude Code forgets your project context between sessions. Every new conversation requires re-explanation.

**The Solution**: LuminarySmartSpace gives Claude persistent memory through:
- 📋 **Specifications** - Detailed project requirements and plans
- ✅ **Task Tracking** - Progress monitoring across all your work
- 🔄 **Automatic Sync** - Save work from git commits with `lumi save`
- 🧠 **Smart Context** - Claude remembers everything about your projects

**Works With**: The [Agentic Startup](https://github.com/CreatorLoCC/Luminary) framework or standalone CLI

---

## 🚀 Features

### 🗂️ Flexible Workspace Modes

**Multi-Project Mode:**
```
~/Projects/
├── app1/
├── app2/
├── app3/
└── .lumi/
    ├── config.json
    └── projects/
        └── projects.json  # Tracks all projects
```
Perfect for managing multiple projects from a parent directory.

**Single-Project Mode:**
```
~/Projects/my-app/
├── src/
├── .lumi/
│   ├── config.json
│   └── projects.json  # Tracks just this project
└── package.json
```
Perfect for focused work on individual repositories.

### 💻 Powerful CLI

```bash
# View all projects with interactive selection
lumi status

# See all tasks across projects
lumi tasks

# Get detailed project context
lumi context <project-id>

# Save work from recent commits
lumi save

# Initialize workspace
lumi init
```

### 🤖 MCP Server Integration

**Automatic Tools for Claude Code:**
- `mcp__luminarysmartspace__save_spec` - Save project specifications
- `mcp__luminarysmartspace__get_context` - Load project context
- `mcp__luminarysmartspace__list_projects` - List all tracked projects
- `mcp__luminarysmartspace__sync_work` - Sync work from commits

**The installer configures this automatically!** Just restart Claude Code.

### 🔄 Git Integration

Track completed work retroactively:
```bash
lumi save
```
Analyzes recent commits and adds them as completed tasks.

---

## 📚 Documentation

- **[QUICK_SETUP.md](QUICK_SETUP.md)** - 3-minute setup guide ⚡ **START HERE!**
- **[INSTALLATION.md](INSTALLATION.md)** - Comprehensive installation guide
- **[CHANGELOG.md](CHANGELOG.md)** - Release notes and version history
- **[packages/cli/README.md](packages/cli/README.md)** - CLI command reference

---

## 🎓 Usage Examples

### With Agentic Startup Commands

```bash
# In Claude Code:
/start:specify "Build user authentication"
```
Claude will:
1. Create detailed spec
2. **Automatically save** via MCP `save_spec` tool
3. Store in `.lumi/projects.json`

```bash
/start:implement user-auth
```
Claude will:
1. **Automatically load** spec via MCP `get_context` tool
2. Implement features
3. Track progress as tasks complete

### Standalone CLI Usage

```bash
# View all projects
lumi status

# Interactive selection
# Output:
# 📂 LuminarySmartSpace Projects (2 total)
#
# 1. 🔄 User Authentication [user-auth]
#    Status: in-progress | Progress: █████░░░░░ 33% (1/3)
#
# Enter number (or q to quit): _

# See all tasks
lumi tasks --status in-progress

# View specific project
lumi context user-auth

# Save work from git
lumi save
```

---

## 🏗️ How It Works

### Storage Architecture

```
.lumi/
├── config.json          # Workspace configuration
└── projects.json        # Project data (single-project)

# OR (multi-project):

.lumi/
├── config.json
└── projects/
    └── projects.json    # All projects
```

### Workspace Detection

LuminarySmartSpace walks up the directory tree to find `.lumi/config.json`, ensuring commands work from any subdirectory within your project.

### Backward Compatibility

Legacy `.claude/luminary/projects.json` paths still work! No migration required.

---

## 🔧 Requirements

- **Node.js 20+** ([Download](https://nodejs.org))
- **npm** (comes with Node.js)
- **git** ([Download](https://git-scm.com))
- **Claude Code** (for MCP integration)

---

## 🛠️ Development

### Build from Source

```bash
# Clone repository
git clone https://github.com/CreatorLoCC/Luminary.git
cd Luminary/LuminarySmartSpace

# Install dependencies
npm install

# Build all packages
npm run build

# Link CLI globally (optional)
cd packages/cli
npm link
```

### Project Structure

```
LuminarySmartSpace/
├── packages/
│   ├── cli/              # CLI viewer (lumi command)
│   └── mcp-server/       # MCP server for Claude Code
├── install.sh            # Unix/Linux/macOS installer
├── install.ps1           # Windows PowerShell installer
├── QUICK_SETUP.md        # Quick start guide
├── INSTALLATION.md       # Full installation docs
└── README.md            # This file
```

---

## 🔄 Updating

**Easy update via installer:**
```bash
# Re-run installer (detects existing installation)
curl -fsSL https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.sh | bash
```

**Or manual update:**
```bash
cd ~/.lumi
git pull origin master
npm install
npm run build
```

---

## 🐛 Troubleshooting

### MCP Tools Not Available in Claude Code

**Problem**: Claude says "I don't have those tools"

**Solution**:
1. Verify config exists:
   ```bash
   cat ~/.config/claude-code/mcp-config.json
   ```
2. **Restart Claude Code completely** (quit and reopen)
3. Ask Claude: "What MCP tools do you have available?"
4. Should see: `mcp__luminarysmartspace__save_spec`, `get_context`, etc.

### `lumi` Command Not Found

**Problem**: Terminal says "command not found: lumi"

**Solution**:
- **Unix/Mac**: Add `~/.local/bin` to PATH:
  ```bash
  export PATH="$HOME/.local/bin:$PATH"
  ```
  Add to `~/.bashrc` or `~/.zshrc` for persistence
- **Windows**: Restart terminal (PATH updates automatically)

### Projects Not Saving

**Problem**: `/start:specify` doesn't persist data

**Solution**:
1. Verify MCP server is loaded (see above)
2. Run `lumi init` in your project:
   ```bash
   cd your-project
   lumi init
   ```
3. Check workspace exists:
   ```bash
   ls .lumi/config.json
   ```

**More help**: See [QUICK_SETUP.md](QUICK_SETUP.md) troubleshooting section

---

## 📊 Version History

**Current Version**: `0.3.0` (2025-11-23)

**Latest Changes**:
- ✨ One-command installation
- 🗂️ Workspace modes (multi-project / single-project)
- 🤖 Auto-MCP configuration
- 🎯 Interactive CLI with `lumi init`
- ⚡ 80% faster setup (15 min → 3 min)

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## 🤝 Contributing

Built with ❤️ by [Luminary](https://github.com/CreatorLoCC)

**Issues**: [GitHub Issues](https://github.com/CreatorLoCC/Luminary/issues)
**Community**: [GitHub Discussions](https://github.com/CreatorLoCC/Luminary/discussions)

---

## 📝 License

MIT License - See LICENSE file for details

---

<div align="center">

**Part of the 💡 Luminary ecosystem**

[Main Repository](https://github.com/CreatorLoCC/Luminary) | [More Projects](https://github.com/CreatorLoCC)

Built with ❤️ and AI by **Luminary**

*"Solo Dev. Startup Energy. Production Quality."*

**Install once. Track forever.** 🚀

</div>
