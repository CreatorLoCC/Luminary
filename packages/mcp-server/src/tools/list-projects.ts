/**
 * MCP Tool: list_projects
 * Shows all tracked projects
 */

import { listAllProjects } from '../storage/store.js';

/**
 * Handler for list_projects tool
 */
export async function handleListProjects(): Promise<string> {
  try {
    const projects = await listAllProjects();

    if (projects.length === 0) {
      return `📂 No projects tracked yet.

Use the save_spec tool to start tracking your first project!`;
    }

    const projectList = projects
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map(project => {
        const totalTasks = project.tasks.length;
        const completedTasks = project.tasks.filter(t => t.status === 'done').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const statusIcon =
          project.status === 'completed' ? '✅' :
          project.status === 'in-progress' ? '🔄' : '📋';

        return `${statusIcon} [${project.id}] ${project.title}
   Status: ${project.status} | Progress: ${progress}% (${completedTasks}/${totalTasks})
   Updated: ${new Date(project.updatedAt).toLocaleString()}`;
      })
      .join('\n\n');

    return `📂 Tracked Projects (${projects.length} total)

${projectList}

💡 Use get_context with a project ID to see full details.`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `❌ Failed to list projects: ${errorMessage}`;
  }
}
