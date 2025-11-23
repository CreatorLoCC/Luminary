# 📝 Changelog

All notable changes to Lumi (LuminarySmartSpace) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.0] - 2025-11-23

### 🚀 **MAJOR RELEASE: One-Command Installation & Workspace Modes**

This is the biggest release yet! Complete installation overhaul with smart workspace detection.

**App Name**: LuminarySmartSpace (full branding in UI)
**Command Name**: `lumi` (short, memorable CLI command)
**Workspace Directory**: `.lumi/` (clean, simple)

### ✨ Added

#### Installation Revolution
- **One-command installation** via curl/iwr for Unix/Linux/macOS/Windows
- Cross-platform installer scripts (`install.sh` and `install.ps1`)
- Automatic dependency checking and installation
- Global command setup with PATH configuration
- Installation verification and troubleshooting

#### Workspace System
- **Workspace configuration system** (`.lumi/config.json`)
- **Multi-project mode**: Track multiple projects from a parent directory
- **Single-project mode**: Focus on individual project tracking
- Smart workspace root detection (walks up directory tree)
- Dynamic storage path resolution based on workspace mode
- Backward compatibility with legacy `.claude/luminary/` paths

#### New Commands
- `lumi init` - Interactive workspace initialization
  - Choose between multi-project and single-project modes
  - Auto-detect project name from directory or git
  - Guided setup with clear explanations
  - Reinitialize protection with confirmation prompt

#### CLI Improvements
- Renamed from `luminary`/`lm` to **`lumi`** (cleaner, shorter!)
- Updated all command references and help text
- Enhanced version to 0.3.0
- Improved error messages for workspace issues

#### MCP Server Updates
- **Auto-configuration during installation** - Installer creates `~/.config/claude-code/mcp-config.json` automatically!
- Workspace-aware storage paths
- Dynamic path resolution for multi/single-project modes
- Maintains backward compatibility with existing installations
- MCP server name: `luminarysmartspace`
- MCP tools: `save_spec`, `get_context`, `list_projects`, `sync_work`

#### Documentation
- **[QUICK_SETUP.md](QUICK_SETUP.md)** - NEW! 3-minute setup guide with troubleshooting
- **[INSTALLATION.md](INSTALLATION.md)** - Comprehensive installation guide
- **[CHANGELOG.md](CHANGELOG.md)** - Professional release notes (this file!)
- Updated README.md with complete feature overview
- Updated CLI README with correct command references
- Version bumps across all packages

### 🔄 Changed

- **CLI binary name**: `luminary`/`lm` → `lumi`
- **Storage paths**: Now workspace-aware
  - Multi-project: `<root>/.lumi/projects/projects.json`
  - Single-project: `<root>/.lumi/projects.json`
  - Legacy: `.claude/luminary/projects.json` (fallback)
- **Package version**: 0.2.0 → 0.3.0
- **Installation method**: From manual npm commands to one-line installer
- **Configuration location**: Moved to `.lumi/` for consistency
- **Install directory**: `~/.lumi/` (clean and simple)

### 🛠️ Technical Details

#### New Modules
- `packages/cli/src/workspace-config.ts` - Workspace detection and management
- `packages/cli/src/commands/init.ts` - Workspace initialization command
- `packages/mcp-server/src/storage/workspace-config.ts` - Server-side workspace support
- `install.sh` - Unix/Linux/macOS installer
- `install.ps1` - Windows PowerShell installer

#### Updated Modules
- `packages/cli/src/storage.ts` - Dynamic path resolution
- `packages/mcp-server/src/storage/store.ts` - Workspace-aware storage
- `packages/cli/src/index.ts` - New command registration
- `packages/cli/package.json` - Binary name and version updates
- Root `package.json` - Version and description updates

### 📊 Impact

**User Experience**:
- Installation time: 5-10 minutes → 2-3 minutes ⚡
- Setup steps: ~8 manual steps → 1 command + 1 init 🎯
- Context issues: Common → Eliminated ✅
- Multi-project support: None → Full support 🗂️

**Developer Experience**:
- Clear workspace modes
- Automatic path resolution
- No more CWD confusion
- Backward compatible

---

## [0.2.0] - 2025-11-21

### Added
- Interactive selection mode (now default for `status` and `tasks`)
- `lm save` command for git commit analysis
- Git integration for retroactive work tracking
- `sync_work` MCP tool

### Changed
- Interactive mode is now DEFAULT (use `--no-interactive` to disable)
- Improved task display and formatting

---

## [0.1.0] - 2025-11-19

### Initial Release

#### Core Features
- MCP server implementation with stdio transport
- Three MCP tools: `save_spec`, `get_context`, `list_projects`
- CLI viewer with multiple commands
- Project and task tracking with JSON storage
- TypeScript implementation with full type safety

#### CLI Commands
- `luminary status` - View all projects
- `luminary tasks` - List all tasks
- `luminary context <id>` - Show project details
- `luminary select` - Interactive project selection

#### Storage
- JSON file storage in `.claude/luminary/projects.json`
- Automatic directory creation
- Pretty-printed JSON for readability

---

## Legend

- ✨ **Added**: New features
- 🔄 **Changed**: Changes to existing functionality
- 🐛 **Fixed**: Bug fixes
- 🗑️ **Removed**: Removed features
- 🛡️ **Security**: Security improvements
- 📝 **Documentation**: Documentation changes
- ⚡ **Performance**: Performance improvements

---

## Upgrade Guide

### From 0.2.0 to 0.3.0

1. **Recommended: Fresh Install**
   ```bash
   # Run the new installer
   curl -fsSL https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.sh | bash
   ```

2. **Or: Manual Upgrade**
   ```bash
   cd ~/.lumi  # Or your install location
   git pull origin master
   npm install
   npm run build
   ```

3. **Restart Claude Code** (if using MCP integration)

4. **Initialize Workspace**
   ```bash
   cd your-project
   lumi init  # Choose your mode
   ```

5. **Migrate Data (if needed)**
   - Old data in `.claude/luminary/projects.json` still works!
   - New workspaces use `.lumi/` for consistency
   - Backward compatibility maintained - no migration required!

---

**Note**: This changelog covers major releases. For detailed commit history, see the [GitHub repository](https://github.com/CreatorLoCC/Luminary).
