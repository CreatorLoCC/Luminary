# 🚀 Lumi Installation Guide

**One command. Zero hassle. Start tracking immediately.**

---

## ⚡ Quick Install

### Unix/Linux/macOS

```bash
curl -fsSL https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.sh | bash
```

### Windows PowerShell

```powershell
iwr -useb https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.ps1 | iex
```

**That's it!** The installer handles everything:
- ✅ Checks prerequisites (Node.js 20+, git)
- ✅ Clones the repository
- ✅ Builds all packages
- ✅ Creates the `lumi` command
- ✅ Adds to your PATH (global install)

---

## 📋 Prerequisites

Before installing, make sure you have:

1. **Node.js 20+** ([Download here](https://nodejs.org))
   ```bash
   node -v  # Should be v20.0.0 or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm -v
   ```

3. **git** ([Download here](https://git-scm.com))
   ```bash
   git --version
   ```

---

## 🎯 Installation Modes

The installer asks you to choose:

### 1. Global Installation (Recommended) ✨

- **Location**: `~/.lumi` (or `C:\Users\<You>\.lumi` on Windows)
- **Command**: Available everywhere as `lumi`
- **Best for**: Most users
- **Use case**: Track projects across your entire system

**After install:**
```bash
# Restart terminal, then:
lumi --version
lumi init  # In any project directory
```

### 2. Local Installation (Development)

- **Location**: Current directory
- **Command**: Needs manual PATH setup
- **Best for**: Contributors, custom setups
- **Use case**: Development or specific project structure

---

## 🔧 Post-Installation

### Step 1: Verify Installation

```bash
lumi --version
# Should show: 0.3.0
```

If `lumi` command not found:
- **Unix/Mac**: Add `~/.local/bin` to PATH
  ```bash
  export PATH="$HOME/.local/bin:$PATH"
  ```
  Add this line to `~/.bashrc` or `~/.zshrc`

- **Windows**: Restart your terminal (PATH updates automatically)

### Step 2: Initialize Workspace

Go to your project directory:

```bash
cd ~/Projects/my-app
lumi init
```

Choose your mode:

#### Option 1: Multi-Project Mode
Perfect for a parent folder tracking multiple projects:
```
~/Projects/
├── app1/
├── app2/
├── app3/
└── .lumi/
    ├── config.json          # Workspace config
    └── projects/
        └── projects.json    # Tracks all above projects
```

#### Option 2: Single-Project Mode
Perfect for individual repositories:
```
~/Projects/my-app/
├── src/
└── .lumi/
    ├── config.json       # Workspace config
    └── projects.json     # Tracks only this project
```

### Step 3: Start Tracking!

```bash
# View all tracked projects
lumi status

# See all tasks
lumi tasks

# Get project context
lumi context <project-id>

# Save work from git commits
lumi save
```

---

## 🏗️ Workspace Structure

After running `lumi init`, you'll have:

### Multi-Project Mode
```
<workspace-root>/
└── .lumi/
    ├── config.json           # Workspace configuration
    └── projects/
        └── projects.json     # All projects data
```

### Single-Project Mode
```
<project-root>/
└── .lumi/
    ├── config.json           # Workspace configuration
    └── projects.json         # This project's data
```

---

## 📦 What Gets Installed?

```
~/.lumi/                          # Install directory
├── packages/
│   ├── cli/                     # The 'lumi' command
│   │   └── dist/index.js        # Entry point
│   └── mcp-server/              # MCP tools for Claude
│       └── dist/index.js        # Server entry
├── install.sh                   # Unix installer
├── install.ps1                  # Windows installer
└── README.md                    # Documentation

~/.config/claude-code/
└── mcp-config.json              # MCP configuration (auto-created)

~/.local/bin/
└── lumi                         # Global command symlink
```

---

## 🔄 Updating Lumi

To update to the latest version:

```bash
cd ~/.lumi
git pull origin master
npm install
npm run build
```

Or just re-run the installer - it will detect and update automatically!

---

## 🧹 Uninstalling

### Remove Lumi

```bash
# Remove installation directory
rm -rf ~/.lumi

# Remove command (Unix/Mac)
rm ~/.local/bin/lumi

# Remove command (Windows)
# Delete: C:\Users\<You>\.local\bin\lumi.bat

# Remove MCP config (optional)
rm ~/.config/claude-code/mcp-config.json
```

### Keep Your Data

Your project tracking data lives in `.lumi/` directories in your projects.
These are separate from the Lumi installation and won't be deleted.

To completely remove all tracking data:
```bash
# Find all .lumi directories
find ~ -name ".lumi" -type d

# Remove them individually as needed
```

---

## 🐛 Troubleshooting

### Command Not Found: `lumi`

**Cause**: `lumi` not in PATH

**Fix**:
- **Unix/Mac**: Add `~/.local/bin` to PATH in your shell profile
- **Windows**: Restart terminal (PATH updates automatically)
- **Verify**: Run `echo $PATH` (Unix) or `$env:Path` (PowerShell)

### Permission Denied

**Cause**: No write permissions to install directory

**Fix**:
```bash
# Unix/Mac: Ensure ~/.local/bin is writable
chmod +x ~/.local/bin/lumi

# Windows: Run PowerShell as Administrator
```

### Module Not Found Errors

**Cause**: Dependencies not installed

**Fix**:
```bash
cd ~/.lumi
npm install
npm run build
```

### Storage Path Issues

**Symptom**: `lumi status` shows "No projects tracked"

**Fix**:
1. Run `lumi init` in your project directory
2. Verify `.lumi/config.json` exists
3. Check Claude is using the MCP server:
   ```bash
   # View MCP config
   cat ~/.config/claude-code/mcp-config.json
   ```

---

## 🎓 Next Steps

After installation:

1. **Read the Quick Start**: [QUICK_START.md](QUICK_START.md)
2. **Learn the Commands**: Run `lumi --help`
3. **Understand Modes**: [README.md](README.md#-features)
4. **Use with Claude**: Configure MCP server in Claude Code

---

## 💡 Installation Tips

### For Development

Clone to a custom location:
```bash
git clone https://github.com/CreatorLoCC/Luminary.git ~/dev/lumi
cd ~/dev/lumi/LuminarySmartSpace
npm install
npm run build
cd packages/cli
npm link  # Makes 'lumi' command available
```

### For Multiple Machines

The installer is idempotent - run it on all your machines:
- Same install process everywhere
- Workspace configs (`.lumi/`) sync via git (if you want)
- Data stays local unless you choose to sync

### For CI/CD

Install non-interactively:
```bash
# Set install location
export LUMI_INSTALL_DIR=/opt/lumi

# Run installer with defaults
curl -fsSL https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.sh | bash -s -- --global --non-interactive
```

---

## 🤝 Need Help?

- **Issues**: [GitHub Issues](https://github.com/CreatorLoCC/Luminary/issues)
- **Docs**: [README.md](README.md)
- **Community**: [GitHub Discussions](https://github.com/CreatorLoCC/Luminary/discussions)

---

**Built with ❤️ by Luminary** | [creatorlocc](https://github.com/CreatorLoCC)

*"Install once. Track forever."*
