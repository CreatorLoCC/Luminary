#
# LuminarySmartSpace Installer for Windows PowerShell
#
# One-command installation:
#   iwr -useb https://raw.githubusercontent.com/CreatorLoCC/Luminary/main/install.ps1 | iex
#
# Or download and run:
#   .\install.ps1
#

# Require PowerShell 5.1+
#Requires -Version 5.1

$ErrorActionPreference = "Stop"

# Configuration
$RepoUrl = "https://github.com/CreatorLoCC/Luminary.git"
$InstallDir = Join-Path $env:USERPROFILE ".lumi"
$BinDir = Join-Path $env:USERPROFILE ".local\bin"

# Banner
Write-Host ""
Write-Host "✨ Lumi Installer" -ForegroundColor Cyan
Write-Host "LuminarySmartSpace - Smart project tracking for Claude Code" -ForegroundColor DarkGray
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor DarkGray

# Check Node.js
try {
    $nodeVersion = node -v
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')

    if ($nodeMajor -lt 20) {
        Write-Host "⚠️  Node.js version is $nodeVersion, but 20+ is recommended" -ForegroundColor Yellow
    }

    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Please install Node.js 20+ from: https://nodejs.org" -ForegroundColor DarkGray
    exit 1
}

# Check npm
try {
    $npmVersion = npm -v
    Write-Host "✓ npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    Write-Host "   npm should come with Node.js" -ForegroundColor DarkGray
    exit 1
}

# Check git
try {
    $gitVersion = git --version
    Write-Host "✓ $gitVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ git not found!" -ForegroundColor Red
    Write-Host "   Please install git from: https://git-scm.com" -ForegroundColor DarkGray
    exit 1
}

Write-Host ""

# Ask installation type
Write-Host "Where would you like to install Lumi?" -ForegroundColor White
Write-Host ""
Write-Host "1." -NoNewline -ForegroundColor White
Write-Host " Global installation (recommended)" -ForegroundColor DarkGray
Write-Host "   Install to ~/.lumi and add to PATH" -ForegroundColor DarkGray
Write-Host "   Available everywhere with 'lumi' command" -ForegroundColor DarkGray
Write-Host ""
Write-Host "2." -NoNewline -ForegroundColor White
Write-Host " Current directory" -ForegroundColor DarkGray
Write-Host "   Install in $(Get-Location)" -ForegroundColor DarkGray
Write-Host "   For development or custom setup" -ForegroundColor DarkGray
Write-Host ""

$choice = Read-Host "Choose (1 or 2)"

if ($choice -eq "1") {
    $InstallTarget = $InstallDir
    $GlobalInstall = $true
} elseif ($choice -eq "2") {
    $InstallTarget = Join-Path (Get-Location) "LuminarySmartSpace"
    $GlobalInstall = $false
} else {
    Write-Host "❌ Invalid choice. Please run again and choose 1 or 2." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing to: " -NoNewline -ForegroundColor DarkGray
Write-Host $InstallTarget -ForegroundColor Cyan
Write-Host ""

# Clone or update repository
if (Test-Path $InstallTarget) {
    Write-Host "⚠️  Directory already exists. Updating..." -ForegroundColor Yellow
    Set-Location $InstallTarget
    git pull origin master
    if ($LASTEXITCODE -ne 0) {
        git pull origin main
    }
} else {
    Write-Host "Cloning repository..." -ForegroundColor DarkGray
    git clone $RepoUrl $InstallTarget
    Set-Location $InstallTarget
}

Write-Host "✓ Repository ready" -ForegroundColor Green
Write-Host ""

# Install dependencies and build
Write-Host "Installing dependencies..." -ForegroundColor DarkGray
npm install --silent 2>$null

Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

Write-Host "Building packages..." -ForegroundColor DarkGray
npm run build --silent 2>$null

Write-Host "✓ Build complete" -ForegroundColor Green
Write-Host ""

# Setup global command if requested
if ($GlobalInstall) {
    Write-Host "Setting up global command..." -ForegroundColor DarkGray

    # Create bin directory if it doesn't exist
    if (-not (Test-Path $BinDir)) {
        New-Item -ItemType Directory -Path $BinDir | Out-Null
    }

    # Create batch wrapper for Windows
    $batPath = Join-Path $BinDir "lumi.bat"
    $jsPath = Join-Path $InstallTarget "packages\cli\dist\index.js"

    @"
@echo off
node "$jsPath" %*
"@ | Out-File -FilePath $batPath -Encoding ASCII

    Write-Host "✓ Global command created" -ForegroundColor Green
    Write-Host ""

    # Check if bin directory is in PATH
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$BinDir*") {
        Write-Host "⚠️  $BinDir is not in your PATH" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Adding to PATH automatically..." -ForegroundColor DarkGray

        # Add to user PATH
        [Environment]::SetEnvironmentVariable(
            "Path",
            "$userPath;$BinDir",
            "User"
        )

        # Also update current session
        $env:Path = "$env:Path;$BinDir"

        Write-Host "✓ PATH updated (restart terminal for full effect)" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "✓ PATH is configured correctly" -ForegroundColor Green
        Write-Host ""
    }
}

# Success!
Write-Host "🎉 Lumi installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor DarkGray

if ($GlobalInstall) {
    Write-Host "  1. Restart your terminal (or run: " -NoNewline -ForegroundColor DarkGray
    Write-Host "refreshenv" -NoNewline -ForegroundColor Cyan
    Write-Host ")" -ForegroundColor DarkGray
    Write-Host "  2. Run " -NoNewline -ForegroundColor DarkGray
    Write-Host "lumi init" -NoNewline -ForegroundColor Cyan
    Write-Host " in your project directory" -ForegroundColor DarkGray
} else {
    Write-Host "  1. Add " -NoNewline -ForegroundColor DarkGray
    Write-Host "$InstallTarget\packages\cli\dist\index.js" -NoNewline -ForegroundColor Cyan
    Write-Host " to your PATH" -ForegroundColor DarkGray
    Write-Host "  2. Run " -NoNewline -ForegroundColor DarkGray
    Write-Host "lumi init" -NoNewline -ForegroundColor Cyan
    Write-Host " in your project directory" -ForegroundColor DarkGray
}

Write-Host "  3. Choose multi-project or single-project mode" -ForegroundColor DarkGray
Write-Host "  4. Start tracking with " -NoNewline -ForegroundColor DarkGray
Write-Host "lumi status" -ForegroundColor Cyan
Write-Host ""
Write-Host "Need help? Run " -NoNewline -ForegroundColor DarkGray
Write-Host "lumi --help" -ForegroundColor Cyan
Write-Host ""

# Verify installation
if ($GlobalInstall) {
    try {
        $testLumi = Get-Command lumi -ErrorAction SilentlyContinue
        if ($testLumi) {
            Write-Host "✓ Verified: 'lumi' command is available" -ForegroundColor Green
        } else {
            Write-Host "⚠️  'lumi' command not immediately available" -ForegroundColor Yellow
            Write-Host "   Restart your terminal to use the command" -ForegroundColor DarkGray
        }
    } catch {
        Write-Host "⚠️  'lumi' command not immediately available" -ForegroundColor Yellow
        Write-Host "   Restart your terminal to use the command" -ForegroundColor DarkGray
    }
    Write-Host ""
}
