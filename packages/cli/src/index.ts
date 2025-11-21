#!/usr/bin/env node

/**
 * LuminarySmartSpace CLI - Command-line viewer for project data
 *
 * Usage:
 *   luminary status              - View all projects
 *   luminary select              - Pick a project interactively
 *   luminary tasks               - List all tasks
 *   luminary tasks --status todo - Filter tasks by status
 *   luminary context <id>        - Show project details
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { statusCommand } from './commands/status.js';
import { tasksCommand } from './commands/tasks.js';
import { contextCommand } from './commands/context.js';
import { selectCommand } from './commands/select.js';
import { saveCommand } from './commands/save.js';

const program = new Command();

program
  .name('luminary')
  .description('CLI viewer for LuminarySmartSpace project management')
  .version('0.2.0');

// luminary status
program
  .command('status')
  .description('View all projects with their status and progress')
  .action(async () => {
    try {
      await statusCommand();
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// luminary tasks
program
  .command('tasks')
  .description('List all tasks across all projects')
  .option('-s, --status <status>', 'Filter by status (todo|in-progress|done)')
  .action(async (options) => {
    try {
      // Validate status option
      if (options.status && !['todo', 'in-progress', 'done'].includes(options.status)) {
        console.error(chalk.red('Error: Invalid status. Use: todo, in-progress, or done'));
        process.exit(1);
      }

      await tasksCommand({ status: options.status });
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// luminary context <id>
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

// luminary select
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

// luminary save
program
  .command('save')
  .description('🆕 Intelligently save completed work by analyzing git commits')
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
  console.log(chalk.bold.cyan('\n🚀 LuminarySmartSpace CLI\n'));
  console.log(chalk.dim('Available commands:\n'));
  console.log('  luminary status              - View all projects');
  console.log('  luminary select              - Pick a project interactively');
  console.log('  luminary tasks               - List all tasks');
  console.log('  luminary tasks --status todo - Filter tasks by status');
  console.log('  luminary context <id>        - Show project details');
  console.log('  luminary save                - 🆕 Save completed work from git commits');
  console.log('');
  console.log(chalk.dim('Run "luminary --help" for more information\n'));
});

// Parse arguments
program.parse();
