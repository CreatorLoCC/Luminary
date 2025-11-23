#!/usr/bin/env node

/**
 * LuminarySmartSpace CLI
 *
 * Smart project tracking with workspace support
 *
 * Usage:
 *   lumi init                    - Initialize workspace (multi or single project)
 *   lumi status                  - View all projects
 *   lumi select                  - Pick a project interactively
 *   lumi tasks                   - List all tasks
 *   lumi tasks --status todo     - Filter tasks by status
 *   lumi context <id>            - Show project details
 *   lumi save                    - Save completed work from git
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { statusCommand } from './commands/status.js';
import { tasksCommand } from './commands/tasks.js';
import { contextCommand } from './commands/context.js';
import { selectCommand } from './commands/select.js';
import { saveCommand } from './commands/save.js';

const program = new Command();

program
  .name('lumi')
  .description('LuminarySmartSpace - Smart project tracking with workspace support')
  .version('0.3.0');

// lumi init
program
  .command('init')
  .description('Initialize a LuminarySmartSpace workspace (multi-project or single-project mode)')
  .action(async () => {
    try {
      await initCommand();
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// lumi status
program
  .command('status')
  .description('View all projects with their status and progress')
  .option('--no-interactive', 'Disable interactive project selection')
  .action(async (options) => {
    try {
      // Interactive is now the default! Use --no-interactive to disable
      await statusCommand({ interactive: options.interactive !== false });
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// lumi tasks
program
  .command('tasks')
  .description('List all tasks across all projects')
  .option('-s, --status <status>', 'Filter by status (todo|in-progress|done)')
  .option('--no-interactive', 'Disable interactive project selection')
  .action(async (options) => {
    try {
      // Validate status option
      if (options.status && !['todo', 'in-progress', 'done'].includes(options.status)) {
        console.error(chalk.red('Error: Invalid status. Use: todo, in-progress, or done'));
        process.exit(1);
      }

      // Interactive is now the default! Use --no-interactive to disable
      await tasksCommand({ status: options.status, interactive: options.interactive !== false });
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// lumi context <id>
program
  .command('context <project-id>')
  .description('Show detailed context for a specific project')
  .action(async (projectId: string) => {
    try {
      await contextCommand(projectId);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// lumi select
program
  .command('select')
  .description('Interactively select a project to view')
  .action(async () => {
    try {
      await selectCommand();
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// lumi save
program
  .command('save')
  .description('Intelligently save completed work by analyzing git commits')
  .option('-p, --project <id>', 'Project ID to save work to (auto-detects if omitted)')
  .option('-s, --since <time>', 'Analyze commits since this time (default: 24.hours.ago)', '24.hours.ago')
  .option('-m, --message <text>', 'Custom task description (auto-generates if omitted)')
  .action(async (options) => {
    try {
      await saveCommand({
        projectId: options.project,
        since: options.since,
        message: options.message,
      });
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Default action - show help if no command provided
program.action(() => {
  console.log(chalk.bold.cyan('\n✨ LuminarySmartSpace CLI\n'));
  console.log(chalk.dim('Available commands:\n'));
  console.log('  lumi init                    - Initialize workspace (multi or single project)');
  console.log('  lumi status                  - View all projects (interactive by default) ⭐');
  console.log('  lumi select                  - Pick a project interactively');
  console.log('  lumi tasks                   - List all tasks (interactive by default) ⭐');
  console.log('  lumi tasks --status todo     - Filter tasks by status');
  console.log('  lumi context <id>            - Show project details');
  console.log('  lumi save                    - Save completed work from git commits');
  console.log('');
  console.log(chalk.dim('💡 Interactive mode is on by default - just type a number to select!'));
  console.log(chalk.dim('💡 Use --no-interactive to disable prompts\n'));
  console.log(chalk.dim('Run "lumi --help" for more information\n'));
});

// Parse arguments
program.parse();
