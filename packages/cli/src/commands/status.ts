/**
 * luminary status - View all projects with their status
 */

import chalk from 'chalk';
import { getAllProjects, projectsFileExists } from '../storage.js';
import { scanWorkspace } from '../workspace-scanner.js';
import {
  getProjectStatusIcon,
  calculateProgress,
  formatProgressBar,
  formatRelativeTime,
} from '../format.js';
import { selectAndDisplayProject } from '../interactive-selector.js';

export async function statusCommand(options?: { interactive?: boolean }): Promise<void> {
  // Scan the entire workspace for all projects
  const workspaceData = await scanWorkspace();

  if (workspaceData.projects.length === 0) {
    console.log(chalk.yellow('📂 No projects tracked yet.'));
    console.log(chalk.dim('\nUse the MCP server tools to create your first project!'));
    console.log(chalk.dim('Path: .claude/luminary/projects.json'));
    return;
  }

  // Load all projects
  const projects = workspaceData.projects;

  // Sort by most recently updated
  const sortedProjects = projects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Display header
  console.log(chalk.bold.cyan(`\n📂 LuminarySmartSpace Projects (${projects.length} total)\n`));

  // Display each project
  sortedProjects.forEach((project, index) => {
    const progress = calculateProgress(project.tasks);
    const icon = getProjectStatusIcon(project.status);
    const bar = formatProgressBar(progress, 15);

    const completedTasks = project.tasks.filter((t) => t.status === 'done').length;
    const totalTasks = project.tasks.length;

    // Project header line
    console.log(
      `${icon}  ${chalk.bold(project.title)} ${chalk.dim(`[${project.id}]`)}`
    );

    // Status and progress line
    console.log(
      `   ${chalk.dim('Status:')} ${chalk.cyan(project.status)} ${chalk.dim('|')} ` +
      `${chalk.dim('Progress:')} ${bar} ${chalk.bold(`${progress}%`)} ` +
      `${chalk.dim(`(${completedTasks}/${totalTasks})`)}`
    );

    // Last updated line with source directory
    console.log(
      `   ${chalk.dim('Updated:')} ${formatRelativeTime(project.updatedAt)} ` +
      `${chalk.dim('|')} ${chalk.dim('Source:')} ${chalk.dim(project.sourceDir)}`
    );

    // Add spacing between projects (but not after the last one)
    if (index < sortedProjects.length - 1) {
      console.log('');
    }
  });

  // Footer
  console.log(chalk.dim('\n💡 Use "luminary context <id>" to see full project details'));
  console.log(chalk.dim('💡 Use "luminary tasks" to see all tasks across projects\n'));

  // Interactive mode is now the default!
  if (options?.interactive) {
    await selectAndDisplayProject(sortedProjects);
  }
}
