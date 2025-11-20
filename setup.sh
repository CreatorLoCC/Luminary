#!/bin/bash

# Luminary Auto-Setup Script
# Installs, builds, and links everything automatically

set -e  # Exit on error

echo ""
echo "🚀 Luminary Setup"
echo "================"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 2: Build packages
echo "🔨 Building packages..."
npm run build
echo "✅ Packages built"
echo ""

# Step 3: Link CLI globally
echo "🔗 Linking CLI globally..."
cd packages/cli
npm link
cd ../..
echo "✅ CLI linked (l command available)"
echo ""

# Success message
echo "🎉 Setup Complete!"
echo ""
echo "✅ Dependencies installed"
echo "✅ MCP server built"
echo "✅ CLI built and linked"
echo ""
echo "📚 Next Steps:"
echo "   1. Initialize a project:"
echo "      npm run init-project /path/to/your/project"
echo ""
echo "   2. Or use the /lls command in Claude Code:"
echo "      /lls"
echo ""
echo "   3. Verify installation:"
echo "      l status"
echo ""
echo "💡 Luminary is ready to track your projects!"
echo ""
