/**
 * MCP Tool: save_spec
 * Allows Claude to save project specifications
 */

import { z } from 'zod';
import { saveProjectSpec } from '../storage/store.js';
import type { Task } from '../storage/types.js';

// Input schema for the tool
export const SaveSpecSchema = z.object({
  id: z.string().describe('Unique identifier for the spec (e.g., "010", "user-auth")'),
  title: z.string().describe('Short title of the project/feature'),
  description: z.string().describe('Detailed description of what is being built'),
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: z.enum(['todo', 'in-progress', 'done']),
    })
  ).describe('List of tasks for this project'),
  status: z.enum(['planning', 'in-progress', 'completed']).default('planning'),
});

export type SaveSpecInput = z.infer<typeof SaveSpecSchema>;

/**
 * Handler for save_spec tool
 */
export async function handleSaveSpec(input: SaveSpecInput): Promise<string> {
  try {
    // Add timestamps to tasks
    const tasksWithTimestamps: Task[] = input.tasks.map(task => ({
      ...task,
      createdAt: new Date().toISOString(),
    }));

    const spec = await saveProjectSpec({
      id: input.id,
      title: input.title,
      description: input.description,
      tasks: tasksWithTimestamps,
      status: input.status,
    });

    const taskCount = spec.tasks.length;
    const doneCount = spec.tasks.filter(t => t.status === 'done').length;

    return `✅ Saved project spec: "${spec.title}" (ID: ${spec.id})
📋 Tasks: ${taskCount} total (${doneCount} completed, ${taskCount - doneCount} remaining)
💾 Stored in: .claude/luminary/projects.json
🕒 Last updated: ${spec.updatedAt}`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `❌ Failed to save spec: ${errorMessage}`;
  }
}
