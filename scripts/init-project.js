#!/usr/bin/env node

/**
 * Luminary Project Initializer
 *
 * Initializes a project directory with Luminary tracking:
 * - Creates .claude/luminary/projects.json
 * - Creates .claude/mcp-config.json
 * - Configures MCP server connection
 */

import { mkdir, writeFile, access } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirectory(path) {
  try {
    await mkdir(path, { recursive: true });
    return true;
  } catch (error) {
    log(`❌ Failed to create directory: ${path}`, colors.red);
    log(`   Error: ${error.message}`, colors.dim);
    return false;
  }
}

async function writeJsonFile(path, data) {
  try {
    await writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    log(`❌ Failed to write file: ${path}`, colors.red);
    log(`   Error: ${error.message}`, colors.dim);
    return false;
  }
}

async function initProject(targetDir = process.cwd()) {
  log('\n🚀 Luminary Project Initializer\n', colors.bright + colors.cyan);

  // Resolve paths
  const luminaryRoot = resolve(__dirname, '..');
  const mcpServerPath = join(luminaryRoot, 'packages', 'mcp-server', 'dist', 'index.js');

  const claudeDir = join(targetDir, '.claude');
  const luminaryDir = join(claudeDir, 'luminary');
  const projectsJsonPath = join(luminaryDir, 'projects.json');
  const mcpConfigPath = join(claudeDir, 'mcp-config.json');

  log(`📂 Target directory: ${targetDir}`, colors.dim);
  log(`📦 Luminary root: ${luminaryRoot}`, colors.dim);
  log('');

  // Step 1: Create directory structure
  log('📁 Creating directory structure...', colors.cyan);

  if (!(await ensureDirectory(luminaryDir))) {
    return false;
  }

  log(`   ✅ Created: ${luminaryDir}`, colors.green);

  // Step 2: Initialize projects.json (if it doesn't exist)
  log('\n📝 Initializing projects.json...', colors.cyan);

  if (await fileExists(projectsJsonPath)) {
    log(`   ⚠️  File already exists, skipping: ${projectsJsonPath}`, colors.yellow);
  } else {
    const projectsData = {
      version: '1.0.0',
      projects: [],
      lastUpdated: new Date().toISOString(),
    };

    if (await writeJsonFile(projectsJsonPath, projectsData)) {
      log(`   ✅ Created: ${projectsJsonPath}`, colors.green);
    } else {
      return false;
    }
  }

  // Step 3: Create/update MCP config
  log('\n🔧 Configuring MCP server...', colors.cyan);

  // Check if MCP server is built
  if (!(await fileExists(mcpServerPath))) {
    log(`   ⚠️  MCP server not built at: ${mcpServerPath}`, colors.yellow);
    log(`   💡 Run: cd ${luminaryRoot} && npm run build`, colors.dim);
  }

  const mcpConfig = {
    mcpServers: {
      luminaryflow: {
        command: 'node',
        args: [mcpServerPath],
        env: {},
      },
    },
  };

  if (await writeJsonFile(mcpConfigPath, mcpConfig)) {
    log(`   ✅ Created: ${mcpConfigPath}`, colors.green);
  } else {
    return false;
  }

  // Success!
  log('\n🎉 Initialization Complete!\n', colors.bright + colors.green);
  log('✅ Directory structure created', colors.green);
  log('✅ projects.json initialized', colors.green);
  log('✅ MCP server configured', colors.green);
  log('');
  log('📚 Next Steps:', colors.bright);
  log('   1. Run: l status                    (view projects)', colors.dim);
  log('   2. Ask Claude to help you plan!     (use MCP tools)', colors.dim);
  log('   3. Run: l tasks                     (see all tasks)', colors.dim);
  log('');
  log('💡 Claude can now track your projects across sessions!', colors.cyan);
  log('');

  return true;
}

// Run the initializer
const targetDir = process.argv[2] || process.cwd();
initProject(targetDir).then((success) => {
  process.exit(success ? 0 : 1);
});
