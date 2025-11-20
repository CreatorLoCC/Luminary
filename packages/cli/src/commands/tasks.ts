/**
 * luminary tasks - List all tasks across all projects
 */

import chalk from 'chalk';
import { getAllProjects, projectsFileExists } from '../storage.js';
import { getTaskStatusIcon } from '../format.js';
import type { Task } from '../storage.js';

interface TaskWithProject extends Task {
  projectId: string;
  projectTitle: string;
}

export async function tasksCommand(options: { status?: string } = {}): Promise<void> {
  // Check if projects file exists
  const exists = await projectsFileExists();
  if (!exists) {
    console.log(chalk.yellow('📂 No projects tracked yet.'));
    console.log(chalk.dim('\nUse the MCP server tools to create your first project!'));
    return;
  }

  // Load all projects
  const projects = await getAllProjects();

  if (projects.length === 0) {
    console.log(chalk.yellow('📂 No projects tracked yet.'));
    return;
  }

  // Collect all tasks with project context
  const allTasks: TaskWithProject[] = [];
  projects.forEach((project) => {
    project.tasks.forEach((task) => {
      allTasks.push({
        ...task,
        projectId: project.id,
        projectTitle: project.title,
      });
    });
  });

  // Filter by status if provided
  let filteredTasks = allTasks;
  if (options.status) {
    filteredTasks = allTasks.filter((t) => t.status === options.status);
  }

  if (filteredTasks.length === 0) {
    if (options.status) {
      console.log(chalk.yellow(`\n📋 No tasks with status "${options.status}"\n`));
    } else {
      console.log(chalk.yellow('\n📋 No tasks found\n'));
    }
    return;
  }

  // Group tasks by status
  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  // Display header
  const filterText = options.status ? ` (${options.status})` : '';
  console.log(chalk.bold.cyan(`\n📋 All Tasks${filterText}\n`));

  // Summary stats
  console.log(chalk.dim('Summary:'));
  console.log(
    `  ${chalk.red('⬜ Todo:')} ${todoTasks.length} | ` +
    `${chalk.yellow('🔄 In Progress:')} ${inProgressTasks.length} | ` +
    `${chalk.green('✅ Done:')} ${doneTasks.length}`
  );
  console.log('');

  // Helper to display tasks
  const displayTasks = (tasks: TaskWithProject[], title: string, color: any) => {
    if (tasks.length === 0) return;

    console.log(color.bold(title));
    tasks.forEach((task) => {
      const icon = getTaskStatusIcon(task.status);
      console.log(
        `  ${icon}  ${task.title} ${chalk.dim(`[${task.projectId}/${task.id}]`)}`
      );
      console.log(`      ${chalk.dim('Project:')} ${task.projectTitle}`);
    });
    console.log('');
  };

  // Display tasks by status
  if (!options.status || options.status === 'in-progress') {
    displayTasks(inProgressTasks, '🔄 In Progress', chalk.yellow);
  }

  if (!options.status || options.status === 'todo') {
    displayTasks(todoTasks, '⬜ Todo', chalk.red);
  }

  if (!options.status || options.status === 'done') {
    displayTasks(doneTasks, '✅ Completed', chalk.green);
  }

  // Footer
  console.log(chalk.dim('💡 Use "luminary context <project-id>" to see project details\n'));
}
