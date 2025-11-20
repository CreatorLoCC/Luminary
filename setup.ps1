# Luminary Auto-Setup Script (PowerShell)
# Installs, builds, and links everything automatically

Write-Host ""
Write-Host "🚀 Luminary Setup" -ForegroundColor Cyan
Write-Host "================"
Write-Host ""

# Step 1: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 2: Build packages
Write-Host "🔨 Building packages..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build packages" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Packages built" -ForegroundColor Green
Write-Host ""

# Step 3: Link CLI globally
Write-Host "🔗 Linking CLI globally..." -ForegroundColor Cyan
Set-Location packages\cli
npm link
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Warning: npm link may require administrator privileges" -ForegroundColor Yellow
}
Set-Location ..\..
Write-Host "✅ CLI linked (l command available)" -ForegroundColor Green
Write-Host ""

# Success message
Write-Host "🎉 Setup Complete!" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host "✅ MCP server built" -ForegroundColor Green
Write-Host "✅ CLI built and linked" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Initialize a project:"
Write-Host "      npm run init-project C:\path\to\your\project"
Write-Host ""
Write-Host "   2. Or use the /lls command in Claude Code:"
Write-Host "      /lls"
Write-Host ""
Write-Host "   3. Verify installation:"
Write-Host "      l status"
Write-Host ""
Write-Host "💡 Luminary is ready to track your projects!" -ForegroundColor Cyan
Write-Host ""
