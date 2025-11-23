/**
 * lumi init - Initialize a LuminarySmartSpace workspace
 *
 * Interactive command that sets up either:
 * - Multi-project mode: Track multiple projects in subdirectories
 * - Single-project mode: Track this specific project only
 */

import chalk from 'chalk';
import { createInterface } from 'readline';
import { initWorkspace, loadWorkspaceConfig, getWorkspaceInfo } from '../workspace-config.js';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Create a simple readline interface for prompts
 */
function createPrompt(): ReturnType<typeof createInterface> {
  return createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask a question and return the user's answer
 */
function question(rl: ReturnType<typeof createInterface>, query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Detect if we're in a git repository
 */
function isGitRepo(): boolean {
  return existsSync(join(process.cwd(), '.git'));
}

/**
 * Main init command
 */
export async function initCommand(): Promise<void> {
  console.log(chalk.bold.cyan('\n✨ LuminarySmartSpace Workspace Initialization\n'));

  // Check if already initialized
  const info = await getWorkspaceInfo();
  if (info.configured) {
    console.log(chalk.yellow('⚠️  This directory is already part of a LuminarySmartSpace workspace!'));
    console.log(chalk.dim(`   Mode: ${info.mode}`));
    console.log(chalk.dim(`   Root: ${info.root}`));
    console.log('');

    const rl = createPrompt();
    const answer = await question(rl, chalk.bold('Reinitialize? This will overwrite existing config (y/N): '));
    rl.close();

    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log(chalk.dim('\n✋ Initialization cancelled.\n'));
      return;
    }
    console.log('');
  }

  // Show intro
  console.log(chalk.dim('LuminarySmartSpace can track projects in two modes:\n'));
  console.log(chalk.bold('1. Multi-project mode') + chalk.dim(' - Track multiple projects in subdirectories'));
  console.log(chalk.dim('   Perfect for: A main folder containing several project folders'));
  console.log(chalk.dim('   Example: ~/Projects/ tracking ~/Projects/app1, ~/Projects/app2, etc.'));
  console.log('');
  console.log(chalk.bold('2. Single-project mode') + chalk.dim(' - Track this specific project only'));
  console.log(chalk.dim('   Perfect for: Individual project repositories'));
  console.log(chalk.dim('   Example: ~/Projects/my-app/ tracking only that project'));
  console.log('');

  const rl = createPrompt();

  // Ask for mode
  const modeAnswer = await question(rl, chalk.bold('Which mode? (1=multi-project, 2=single-project): '));

  let mode: 'multi-project' | 'single-project';
  let projectName: string | undefined;

  if (modeAnswer === '1') {
    mode = 'multi-project';
    console.log(chalk.green('\n✓ Multi-project mode selected'));
    console.log(chalk.dim('  Projects in subdirectories will be tracked automatically.\n'));
  } else if (modeAnswer === '2') {
    mode = 'single-project';
    console.log(chalk.green('\n✓ Single-project mode selected'));

    // Try to detect project name from git or directory name
    const dirName = process.cwd().split(/[/\\]/).pop() || 'project';
    const suggestedName = isGitRepo() ? dirName : dirName;

    const nameAnswer = await question(
      rl,
      chalk.bold(`Project name? (default: ${chalk.cyan(suggestedName)}): `)
    );
    projectName = nameAnswer || suggestedName;
    console.log('');
  } else {
    console.log(chalk.red('\n❌ Invalid selection. Please choose 1 or 2.\n'));
    rl.close();
    return;
  }

  rl.close();

  // Initialize workspace
  console.log(chalk.dim('Initializing workspace...'));

  try {
    const config = await initWorkspace(mode, process.cwd(), projectName);

    console.log(chalk.bold.green('\n🎉 Workspace initialized successfully!\n'));
    console.log(chalk.dim('Configuration:'));
    console.log(chalk.dim(`  Mode: ${chalk.cyan(config.mode)}`));
    console.log(chalk.dim(`  Root: ${chalk.cyan(config.workspaceRoot)}`));

    if (config.mode === 'single-project' && config.projects?.name) {
      console.log(chalk.dim(`  Project: ${chalk.cyan(config.projects.name)}`));
    }

    console.log('');
    console.log(chalk.dim('Next steps:'));
    console.log(chalk.dim('  • Run ' + chalk.bold('lumi status') + ' to view tracked projects'));
    console.log(chalk.dim('  • Use ' + chalk.bold('lumi --help') + ' to see all commands'));

    if (config.mode === 'single-project') {
      console.log(chalk.dim('  • Projects are automatically tracked via the MCP server'));
    }

    console.log('');
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to initialize workspace:'));
    console.error(chalk.red('   ' + (error instanceof Error ? error.message : error)));
    console.log('');
    process.exit(1);
  }
}
