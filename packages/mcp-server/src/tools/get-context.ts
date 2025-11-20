/**
 * MCP Tool: get_context
 * Retrieves context for a specific project to help Claude remember state
 */

import { z } from 'zod';
import { getProjectById } from '../storage/store.js';

// Input schema
export const GetContextSchema = z.object({
  id: z.string().describe('Project ID to retrieve context for'),
});

export type GetContextInput = z.infer<typeof GetContextSchema>;

/**
 * Handler for get_context tool
 */
export async function handleGetContext(input: GetContextInput): Promise<string> {
  try {
    const project = await getProjectById(input.id);

    if (!project) {
      return `❌ No project found with ID: ${input.id}`;
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = project.tasks.filter(t => t.status === 'in-progress').length;
    const todoTasks = project.tasks.filter(t => t.status === 'todo').length;

    const taskList = project.tasks
      .map(task => {
        const icon = task.status === 'done' ? '✅' : task.status === 'in-progress' ? '🔄' : '⬜';
        return `  ${icon} ${task.title} [${task.status}]`;
      })
      .join('\n');

    return `📋 Project Context: ${project.title}

🆔 ID: ${project.id}
📊 Status: ${project.status}

📝 Description:
${project.description}

✅ Progress: ${completedTasks}/${totalTasks} tasks completed
  - ✅ Done: ${completedTasks}
  - 🔄 In Progress: ${inProgressTasks}
  - ⬜ Todo: ${todoTasks}

📋 Task Breakdown:
${taskList}

🕒 Created: ${project.createdAt}
🕒 Last Updated: ${project.updatedAt}`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `❌ Failed to retrieve context: ${errorMessage}`;
  }
}
