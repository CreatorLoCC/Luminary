/**
 * luminary context <id> - Show detailed context for a specific project
 */

import chalk from 'chalk';
import { getProjectById, projectsFileExists } from '../storage.js';
import {
  getProjectStatusIcon,
  getTaskStatusIcon,
  calculateProgress,
  formatProgressBar,
  formatDate,
  formatRelativeTime,
} from '../format.js';

export async function contextCommand(projectId: string): Promise<void> {
  // Check if projects file exists
  const exists = await projectsFileExists();
  if (!exists) {
    console.log(chalk.red('❌ No projects file found'));
    console.log(chalk.dim('Path: .claude/luminary/projects.json'));
    return;
  }

  // Get the project
  const project = await getProjectById(projectId);

  if (!project) {
    console.log(chalk.red(`❌ No project found with ID: ${projectId}`));
    console.log(chalk.dim('\n💡 Use "luminary status" to see all projects'));
    return;
  }

  // Calculate statistics
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = project.tasks.filter((t) => t.status === 'in-progress').length;
  const todoTasks = project.tasks.filter((t) => t.status === 'todo').length;
  const progress = calculateProgress(project.tasks);

  // Display header
  const icon = getProjectStatusIcon(project.status);
  console.log(chalk.bold.cyan(`\n${icon} ${project.title}\n`));

  // Display metadata
  console.log(chalk.dim('ID:'), chalk.white(project.id));
  console.log(chalk.dim('Status:'), chalk.cyan(project.status));
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

    // Group and display by status
    const displayTaskGroup = (status: 'in-progress' | 'todo' | 'done', label: string) => {
      const tasks = project.tasks.filter((t) => t.status === status);
      if (tasks.length === 0) return;

      tasks.forEach((task) => {
        const icon = getTaskStatusIcon(task.status);
        console.log(`  ${icon}  ${task.title} ${chalk.dim(`[${task.id}]`)}`);
      });
    };

    // Show in-progress first
    displayTaskGroup('in-progress', 'In Progress');
    // Then todo
    displayTaskGroup('todo', 'Todo');
    // Finally completed
    displayTaskGroup('done', 'Completed');

    console.log('');
  } else {
    console.log(chalk.yellow('📋 No tasks defined yet\n'));
  }

  // Display timestamps
  console.log(chalk.bold('🕒 Timeline:'));
  console.log(chalk.dim('  Created:'), formatDate(project.createdAt));
  console.log(
    chalk.dim('  Last Updated:'),
    `${formatDate(project.updatedAt)} ${chalk.dim(`(${formatRelativeTime(project.updatedAt)})`)}`
  );
  console.log('');
}
