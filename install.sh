#!/usr/bin/env bash
#
# LuminarySmartSpace Installer for Unix/Linux/macOS
#
# One-command installation:
#   curl -fsSL https://raw.githubusercontent.com/CreatorLoCC/Luminary/master/install.sh | bash
#
# Or download and run:
#   ./install.sh
#

set -e  # Exit on error

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
DIM='\033[0;2m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/CreatorLoCC/Luminary.git"
INSTALL_DIR="$HOME/.lumi"
BIN_DIR="$HOME/.local/bin"

# Banner
echo ""
echo -e "${CYAN}${BOLD}✨ Lumi Installer${NC}"
echo -e "${DIM}LuminarySmartSpace - Smart project tracking for Claude Code${NC}"
echo ""

# Check prerequisites
echo -e "${DIM}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found!${NC}"
    echo -e "${DIM}   Please install Node.js 20+ from: https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${YELLOW}⚠️  Node.js version is $NODE_VERSION, but 20+ is recommended${NC}"
fi

echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found!${NC}"
    echo -e "${DIM}   npm should come with Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm $(npm -v) found${NC}"

# Check git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ git not found!${NC}"
    echo -e "${DIM}   Please install git from: https://git-scm.com${NC}"
    exit 1
fi

echo -e "${GREEN}✓ git $(git --version | cut -d ' ' -f 3) found${NC}"
echo ""

# Ask installation type
echo -e "${BOLD}Where would you like to install Lumi?${NC}"
echo ""
echo -e "${BOLD}1.${NC} ${DIM}Global installation (recommended)${NC}"
echo -e "   ${DIM}Install to ~/.lumi and add to PATH${NC}"
echo -e "   ${DIM}Available everywhere with 'lumi' command${NC}"
echo ""
echo -e "${BOLD}2.${NC} ${DIM}Current directory${NC}"
echo -e "   ${DIM}Install in $(pwd)${NC}"
echo -e "   ${DIM}For development or custom setup${NC}"
echo ""

read -p "$(echo -e ${BOLD}"Choose (1 or 2): "${NC})" INSTALL_TYPE

if [ "$INSTALL_TYPE" = "1" ]; then
    INSTALL_TARGET="$INSTALL_DIR"
    GLOBAL_INSTALL=true
elif [ "$INSTALL_TYPE" = "2" ]; then
    INSTALL_TARGET="$(pwd)/LuminarySmartSpace"
    GLOBAL_INSTALL=false
else
    echo -e "${RED}❌ Invalid choice. Please run again and choose 1 or 2.${NC}"
    exit 1
fi

echo ""
echo -e "${DIM}Installing to: ${CYAN}$INSTALL_TARGET${NC}"
echo ""

# Clone or update repository
if [ -d "$INSTALL_TARGET" ]; then
    echo -e "${YELLOW}⚠️  Directory already exists. Updating...${NC}"
    cd "$INSTALL_TARGET"
    git pull origin master
else
    echo -e "${DIM}Cloning repository...${NC}"
    git clone "$REPO_URL" "$INSTALL_TARGET"
    cd "$INSTALL_TARGET"
fi

echo -e "${GREEN}✓ Repository ready${NC}"
echo ""

# Install dependencies and build
echo -e "${DIM}Installing dependencies...${NC}"
npm install --silent

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${DIM}Building packages...${NC}"
npm run build --silent

echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Setup global command if requested
if [ "$GLOBAL_INSTALL" = true ]; then
    echo -e "${DIM}Setting up global command...${NC}"

    # Create bin directory if it doesn't exist
    mkdir -p "$BIN_DIR"

    # Create symlink
    ln -sf "$INSTALL_TARGET/packages/cli/dist/index.js" "$BIN_DIR/lumi"
    chmod +x "$INSTALL_TARGET/packages/cli/dist/index.js"

    echo -e "${GREEN}✓ Global command created${NC}"
    echo ""

    # Check if bin directory is in PATH
    if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
        echo -e "${YELLOW}⚠️  $BIN_DIR is not in your PATH${NC}"
        echo ""
        echo -e "${DIM}Add this to your shell profile (~/.bashrc, ~/.zshrc, etc.):${NC}"
        echo -e "${CYAN}export PATH=\"\$HOME/.local/bin:\$PATH\"${NC}"
        echo ""
        echo -e "${DIM}Then reload your shell:${NC}"
        echo -e "${CYAN}source ~/.bashrc${NC}  ${DIM}# or ~/.zshrc${NC}"
        echo ""
    else
        echo -e "${GREEN}✓ PATH is configured correctly${NC}"
        echo ""
    fi
fi

# Success!
echo -e "${GREEN}${BOLD}🎉 Lumi installed successfully!${NC}"
echo ""
echo -e "${DIM}Next steps:${NC}"

if [ "$GLOBAL_INSTALL" = true ]; then
    echo -e "  1. Run ${CYAN}${BOLD}lumi init${NC} in your project directory"
else
    echo -e "  1. Add ${CYAN}${INSTALL_TARGET}/packages/cli/dist/index.js${NC} to your PATH"
    echo -e "  2. Run ${CYAN}${BOLD}lumi init${NC} in your project directory"
fi

echo -e "  2. Choose multi-project or single-project mode"
echo -e "  3. Start tracking with ${CYAN}${BOLD}lumi status${NC}"
echo ""
echo -e "${DIM}Need help? Run ${CYAN}${BOLD}lumi --help${NC}"
echo ""

# Verify installation
if [ "$GLOBAL_INSTALL" = true ]; then
    if command -v lumi &> /dev/null; then
        echo -e "${GREEN}✓ Verified: 'lumi' command is available${NC}"
        echo ""
    else
        echo -e "${YELLOW}⚠️  'lumi' command not immediately available${NC}"
        echo -e "${DIM}   You may need to restart your shell or update PATH${NC}"
        echo ""
    fi
fi
