/**
 * MCP Tool: sync_work
 * Retroactively document completed work by analyzing git commits
 */

import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import { saveProjectSpec } from '../storage/store.js';
import { getProjectById } from '../storage/store.js';
import type { Task } from '../storage/types.js';

const execAsync = promisify(exec);

// Input schema for the tool
export const SyncWorkSchema = z.object({
  projectId: z.string().describe('ID of the project to sync work to'),
  gitCommits: z.array(z.string()).optional().describe('Specific commit hashes to analyze (optional)'),
  sinceDate: z.string().optional().describe('Analyze commits since this date (ISO format)'),
  taskTitle: z.string().describe('Title for the completed work'),
  taskStatus: z.enum(['done', 'in-progress']).default('done'),
  files: z.array(z.string()).optional().describe('Files changed in this work'),
  notes: z.string().optional().describe('Additional notes about the work'),
});

export type SyncWorkInput = z.infer<typeof SyncWorkSchema>;

/**
 * Analyze git commits to extract work details
 */
async function analyzeGitCommits(since?: string): Promise<{
  commitCount: number;
  filesChanged: string[];
  lastCommitDate: string;
}> {
  try {
    // Get commits since date or last 7 days
    const sinceFlag = since || '7.days.ago';
    const { stdout: commitLog } = await execAsync(
      `git log --since="${sinceFlag}" --oneline --name-only`
    );

    const lines = commitLog.split('\n').filter(Boolean);
    const commitCount = lines.filter(line => /^[a-f0-9]{7}/.test(line)).length;
    const filesChanged = [...new Set(
      lines.filter(line => !/^[a-f0-9]{7}/.test(line))
    )];

    const { stdout: lastDate } = await execAsync(
      `git log -1 --format=%cI`
    );

    return {
      commitCount,
      filesChanged,
      lastCommitDate: lastDate.trim(),
    };
  } catch (error) {
    return {
      commitCount: 0,
      filesChanged: [],
      lastCommitDate: new Date().toISOString(),
    };
  }
}

/**
 * Handler for sync_work tool
 */
export async function handleSyncWork(input: SyncWorkInput): Promise<string> {
  try {
    // Get existing project
    const existingProject = await getProjectById(input.projectId);

    if (!existingProject) {
      return `❌ Project not found: ${input.projectId}
💡 Use list_projects to see available projects`;
    }

    // Analyze git commits if no explicit files provided
    let gitInfo;
    if (!input.files || input.files.length === 0) {
      gitInfo = await analyzeGitCommits(input.sinceDate);
    }

    // Create new task for the completed work
    const newTaskId = (existingProject.tasks.length + 1).toString();
    const newTask: Task = {
      id: newTaskId,
      title: input.taskTitle,
      status: input.taskStatus,
      createdAt: new Date().toISOString(),
    };

    // Add completion timestamp if done
    if (input.taskStatus === 'done') {
      newTask.completedAt = new Date().toISOString();
    }

    // Add notes if provided
    if (input.notes) {
      newTask.notes = input.notes;
    }

    // Update project with new task
    const updatedTasks = [...existingProject.tasks, newTask];

    const updatedProject = await saveProjectSpec({
      id: existingProject.id,
      title: existingProject.title,
      description: existingProject.description,
      tasks: updatedTasks,
      status: existingProject.status === 'planning' ? 'in-progress' : existingProject.status,
    });

    const doneCount = updatedProject.tasks.filter(t => t.status === 'done').length;
    const totalCount = updatedProject.tasks.length;
    const progress = Math.round((doneCount / totalCount) * 100);

    let response = `✅ Synced completed work to "${updatedProject.title}"

📋 New Task Added:
   ${input.taskStatus === 'done' ? '✅' : '🔄'} ${input.taskTitle} [${newTaskId}]`;

    if (input.notes) {
      response += `\n   📝 ${input.notes}`;
    }

    if (gitInfo && gitInfo.commitCount > 0) {
      response += `\n\n📊 Git Activity Detected:
   • ${gitInfo.commitCount} commit(s) analyzed
   • ${gitInfo.filesChanged.length} file(s) changed
   • Last commit: ${new Date(gitInfo.lastCommitDate).toLocaleString()}`;
    }

    if (input.files && input.files.length > 0) {
      response += `\n\n📁 Files Documented:
   ${input.files.map(f => `• ${f}`).join('\n   ')}`;
    }

    response += `\n\n📊 Project Progress:
   ${progress}% complete (${doneCount}/${totalCount} tasks done)
   Status: ${updatedProject.status}

💾 Saved to: .claude/luminary/projects.json
🕒 Updated: ${updatedProject.updatedAt}`;

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `❌ Failed to sync work: ${errorMessage}`;
  }
}
