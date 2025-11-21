/**
 * Interactive Project Selector Utility
 * Provides reusable interactive selection across all commands
 */

import chalk from 'chalk';
import { createInterface } from 'readline';
import type { ProjectSpec } from './storage.js';
import {
  getProjectStatusIcon,
  calculateProgress,
  formatProgressBar,
  formatRelativeTime,
} from './format.js';

/**
 * Display a full project context
 */
export function displayProjectContext(project: ProjectSpec): void {
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = project.tasks.filter((t) => t.status === 'in-progress').length;
  const todoTasks = project.tasks.filter((t) => t.status === 'todo').length;
  const progress = calculateProgress(project.tasks);
  const icon = getProjectStatusIcon(project.status);

  // Display header
  console.log(chalk.bold.cyan(`\n${icon} ${project.title}\n`));

  // Display metadata
  console.log(chalk.dim('ID:'), chalk.white(project.id));
  console.log(chalk.dim('Status:'), chalk.cyan(project.status));
  if (project.source) {
    console.log(chalk.dim('Source:'), chalk.dim(project.source));
  }
  console.log('');

  // Display description
  console.log(chalk.bold('📝 Description:'));
  console.log(chalk.white(project.description));
  console.log('');

  // Display progress
  console.log(chalk.bold('📊 Progress:'));
  const bar = formatProgressBar(progress, 30);
  console.log(`${bar} ${chalk.bold(`${progress}%`)} ${chalk.dim(`(${completedTasks}/${totalTasks})`)}`);
  console.log('');

  // Task breakdown
  console.log(chalk.dim('  ✅ Done:'), chalk.green(completedTasks));
  console.log(chalk.dim('  🔄 In Progress:'), chalk.yellow(inProgressTasks));
  console.log(chalk.dim('  ⬜ Todo:'), chalk.red(todoTasks));
  console.log('');

  // Display tasks
  if (totalTasks > 0) {
    console.log(chalk.bold('📋 Tasks:\n'));

    // Helper to display task groups
    const displayTaskGroup = (status: 'in-progress' | 'todo' | 'done') => {
      const tasks = project.tasks.filter((t) => t.status === status);
      if (tasks.length === 0) return;

      tasks.forEach((task) => {
        const taskIcon = status === 'done' ? '✅' : status === 'in-progress' ? '🔄' : '⬜';
        console.log(`  ${taskIcon}  ${task.title} ${chalk.dim(`[${task.id}]`)}`);
      });
    };

    // Show in-progress first, then todo, then completed
    displayTaskGroup('in-progress');
    displayTaskGroup('todo');
    displayTaskGroup('done');

    console.log('');
  } else {
    console.log(chalk.yellow('📋 No tasks defined yet\n'));
  }

  // Display timestamps
  console.log(chalk.bold('🕒 Timeline:'));
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();
  console.log(chalk.dim('  Created:'), formatDate(project.createdAt));
  console.log(
    chalk.dim('  Last Updated:'),
    `${formatDate(project.updatedAt)} ${chalk.dim(`(${formatRelativeTime(project.updatedAt)})`)}`
  );
  console.log('');
}

/**
 * Display numbered list of projects
 */
export function displayProjectList(projects: ProjectSpec[]): void {
  projects.forEach((project, index) => {
    const num = chalk.bold.cyan(`${index + 1}.`);
    const icon = getProjectStatusIcon(project.status);
    const title = chalk.bold.white(project.title);
    const id = chalk.dim(`[${project.id}]`);
    const progress = calculateProgress(project.tasks);
    const bar = formatProgressBar(progress, 15);
    const percent = chalk.dim(`${progress}%`);
    const updated = chalk.dim(`• ${formatRelativeTime(project.updatedAt)}`);

    console.log(`${num} ${icon} ${title} ${id}`);
    console.log(`   ${bar} ${percent} ${updated}\n`);
  });
}

/**
 * Interactive project selector
 * Returns the selected project or null if user quits
 */
export async function interactiveProjectSelector(
  projects: ProjectSpec[]
): Promise<ProjectSpec | null> {
  if (projects.length === 0) {
    console.log(chalk.yellow('📂 No projects found'));
    console.log(chalk.dim('\n💡 Projects are stored in .claude/luminary/projects.json'));
    return null;
  }

  // Display header
  console.log(chalk.bold.cyan('\n🎯 Select a Project\n'));

  // Display numbered list
  displayProjectList(projects);

  // Create readline interface for user input
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(chalk.cyan('Enter number (or q to quit): '), (answer) => {
      rl.close();

      // Check for quit
      if (answer.toLowerCase() === 'q') {
        console.log(chalk.dim('\n👋 Goodbye!\n'));
        resolve(null);
        return;
      }

      // Parse selection
      const selection = parseInt(answer, 10);

      // Validate selection
      if (isNaN(selection) || selection < 1 || selection > projects.length) {
        console.log(
          chalk.red(`\n❌ Invalid selection. Please enter a number between 1 and ${projects.length}\n`)
        );
        resolve(null);
        return;
      }

      // Return selected project
      resolve(projects[selection - 1]);
    });
  });
}

/**
 * Interactive project selector with context display
 * Combines selection and display in one flow
 */
export async function selectAndDisplayProject(projects: ProjectSpec[]): Promise<void> {
  const selected = await interactiveProjectSelector(projects);

  if (selected) {
    displayProjectContext(selected);
  }
}
