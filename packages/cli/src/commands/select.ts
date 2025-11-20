/**
 * luminary select - Interactive project selector
 */

import chalk from 'chalk';
import { createInterface } from 'readline';
import { scanWorkspace } from '../workspace-scanner.js';
import {
  getProjectStatusIcon,
  calculateProgress,
  formatProgressBar,
  formatRelativeTime,
} from '../format.js';

export async function selectCommand(): Promise<void> {
  // Scan the entire workspace for all projects
  const workspaceData = await scanWorkspace();
  const projects = workspaceData.projects;

  if (projects.length === 0) {
    console.log(chalk.yellow('📂 No projects found'));
    console.log(chalk.dim('\n💡 Projects are stored in .claude/luminary/projects.json'));
    return;
  }

  // Display header
  console.log(chalk.bold.cyan('\n🎯 Select a Project\n'));

  // Display numbered list of projects
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

  // Create readline interface for user input
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Prompt for selection
  rl.question(chalk.cyan('Enter number (or q to quit): '), async (answer) => {
    rl.close();

    // Check for quit
    if (answer.toLowerCase() === 'q') {
      console.log(chalk.dim('\n👋 Goodbye!\n'));
      return;
    }

    // Parse selection
    const selection = parseInt(answer, 10);

    // Validate selection
    if (isNaN(selection) || selection < 1 || selection > projects.length) {
      console.log(chalk.red(`\n❌ Invalid selection. Please enter a number between 1 and ${projects.length}\n`));
      return;
    }

    // Get selected project
    const selectedProject = projects[selection - 1];

    // Display the full context inline (since we already have all the data)
    console.log(''); // Add spacing

    // Import format functions and display context
    const totalTasks = selectedProject.tasks.length;
    const completedTasks = selectedProject.tasks.filter((t) => t.status === 'done').length;
    const inProgressTasks = selectedProject.tasks.filter((t) => t.status === 'in-progress').length;
    const todoTasks = selectedProject.tasks.filter((t) => t.status === 'todo').length;
    const progress = calculateProgress(selectedProject.tasks);
    const icon = getProjectStatusIcon(selectedProject.status);

    // Display header
    console.log(chalk.bold.cyan(`${icon} ${selectedProject.title}\n`));

    // Display metadata
    console.log(chalk.dim('ID:'), chalk.white(selectedProject.id));
    console.log(chalk.dim('Status:'), chalk.cyan(selectedProject.status));
    console.log(chalk.dim('Source:'), chalk.dim(selectedProject.sourceDir));
    console.log('');

    // Display description
    console.log(chalk.bold('📝 Description:'));
    console.log(chalk.white(selectedProject.description));
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
        const tasks = selectedProject.tasks.filter((t) => t.status === status);
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
    const formatRelativeTime = (dateStr: string) => {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 60) return `${diffMins} minutes ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    };

    console.log(chalk.dim('  Created:'), formatDate(selectedProject.createdAt));
    console.log(
      chalk.dim('  Last Updated:'),
      `${formatDate(selectedProject.updatedAt)} ${chalk.dim(`(${formatRelativeTime(selectedProject.updatedAt)})`)}`
    );
    console.log('');
  });
}
