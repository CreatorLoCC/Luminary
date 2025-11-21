/**
 * Save Command - Intelligently save completed work to a project
 *
 * Analyzes git commits since last save and creates tasks automatically
 */

import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { loadProjects, saveProjects } from '../storage.js';
import type { ProjectSpec, Task } from '../storage.js';

const execAsync = promisify(exec);

interface GitAnalysis {
  commits: Array<{
    hash: string;
    date: string;
    message: string;
  }>;
  filesChanged: string[];
  commitCount: number;
}

/**
 * Analyze git commits since a specific date
 */
async function analyzeGitHistory(since?: string): Promise<GitAnalysis> {
  try {
    const sinceFlag = since || '24.hours.ago';

    // Get commit log with details
    const { stdout: commitLog } = await execAsync(
      `git log --since="${sinceFlag}" --pretty=format:"%H|%cI|%s" --name-only`
    );

    if (!commitLog.trim()) {
      return { commits: [], filesChanged: [], commitCount: 0 };
    }

    const lines = commitLog.split('\n');
    const commits: Array<{ hash: string; date: string; message: string }> = [];
    const filesChangedSet = new Set<string>();

    let currentCommit: { hash: string; date: string; message: string } | null = null;

    for (const line of lines) {
      if (!line.trim()) continue;

      if (line.includes('|')) {
        // Commit line: hash|date|message
        const [hash, date, ...messageParts] = line.split('|');
        currentCommit = {
          hash: hash.trim(),
          date: date.trim(),
          message: messageParts.join('|').trim(),
        };
        commits.push(currentCommit);
      } else {
        // File line
        filesChangedSet.add(line.trim());
      }
    }

    return {
      commits,
      filesChanged: Array.from(filesChangedSet),
      commitCount: commits.length,
    };
  } catch (error) {
    throw new Error('Failed to analyze git history. Are you in a git repository?');
  }
}

/**
 * Get the currently selected project ID from a marker file
 */
async function getCurrentProjectId(): Promise<string | null> {
  try {
    // Check if there's a .luminary-context file
    const { stdout } = await execAsync('git rev-parse --show-toplevel');
    const repoRoot = stdout.trim();

    // For now, try to infer from directory name or return null
    // Future: could use a .luminary file or environment variable
    return null;
  } catch {
    return null;
  }
}

/**
 * Generate a summary of commits for task description
 */
function generateTaskSummary(analysis: GitAnalysis): string {
  if (analysis.commits.length === 1) {
    return analysis.commits[0].message;
  }

  // Group commits by type
  const features = analysis.commits.filter(c => c.message.toLowerCase().startsWith('feat'));
  const fixes = analysis.commits.filter(c => c.message.toLowerCase().startsWith('fix'));
  const others = analysis.commits.filter(c =>
    !c.message.toLowerCase().startsWith('feat') &&
    !c.message.toLowerCase().startsWith('fix')
  );

  const parts: string[] = [];
  if (features.length > 0) parts.push(`${features.length} feature(s)`);
  if (fixes.length > 0) parts.push(`${fixes.length} fix(es)`);
  if (others.length > 0) parts.push(`${others.length} other change(s)`);

  return `Development session: ${parts.join(', ')}`;
}

/**
 * Save command implementation
 */
export async function saveCommand(options: {
  projectId?: string;
  since?: string;
  message?: string;
}): Promise<void> {
  console.log(chalk.bold.cyan('\n💾 Saving Work to LuminaryFlow\n'));

  // Analyze git history
  console.log(chalk.dim('📊 Analyzing git commits...'));
  const analysis = await analyzeGitHistory(options.since);

  if (analysis.commitCount === 0) {
    console.log(chalk.yellow('⚠️  No commits found in the specified time range'));
    console.log(chalk.dim('   Use --since to specify a different time range'));
    console.log(chalk.dim('   Example: lm save --since "2.days.ago"'));
    return;
  }

  console.log(chalk.green(`✅ Found ${analysis.commitCount} commit(s)`));
  console.log(chalk.dim(`   ${analysis.filesChanged.length} file(s) changed\n`));

  // Get or prompt for project ID
  let projectId: string | undefined = options.projectId;

  if (!projectId) {
    const detectedId = await getCurrentProjectId();
    if (detectedId) {
      projectId = detectedId;
    }
  }

  if (!projectId) {
    // Load projects and show selection
    const store = await loadProjects();

    if (!store) {
      console.log(chalk.red('❌ No projects file found'));
      console.log(chalk.dim('   Create a project first with /start:specify or use the MCP tools'));
      return;
    }

    if (store.projects.length === 0) {
      console.log(chalk.red('❌ No projects found'));
      console.log(chalk.dim('   Create a project first with /start:specify or use the MCP tools'));
      return;
    }

    // If only one project, use it automatically
    if (store.projects.length === 1) {
      projectId = store.projects[0].id;
      console.log(chalk.dim(`   Auto-selected project: ${store.projects[0].title}`));
    } else {
      // Show available projects
      console.log(chalk.yellow('🔍 Please specify a project ID:\n'));
      store.projects.forEach((p, i) => {
        console.log(`${i + 1}. ${chalk.bold(p.id)} - ${p.title}`);
      });
      console.log(chalk.dim('\nUsage: lm save --project <project-id>'));
      return;
    }
  }

  // Load the project
  const store = await loadProjects();

  if (!store) {
    console.log(chalk.red('❌ Failed to load projects'));
    return;
  }

  const project = store.projects.find(p => p.id === projectId);

  if (!project) {
    console.log(chalk.red(`❌ Project not found: ${projectId}`));
    return;
  }

  // Generate task from commits
  const taskTitle = options.message || generateTaskSummary(analysis);
  const taskId = (project.tasks.length + 1).toString();

  const newTask: Task = {
    id: taskId,
    title: taskTitle,
    status: 'done',
    createdAt: analysis.commits[analysis.commits.length - 1].date,
    completedAt: analysis.commits[0].date,
    notes: analysis.commits.map(c => `• ${c.message}`).join('\n'),
  };

  // Update project
  project.tasks.push(newTask);

  // Update status to in-progress if it was planning
  if (project.status === 'planning') {
    project.status = 'in-progress';
  }

  project.updatedAt = new Date().toISOString();

  // Save
  await saveProjects(store);

  // Calculate progress
  const doneCount = project.tasks.filter(t => t.status === 'done').length;
  const totalCount = project.tasks.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  // Show success
  console.log(chalk.bold.green(`✅ Saved work to "${project.title}"\n`));

  console.log(chalk.bold('📋 Task Added:'));
  console.log(`   ✅ ${taskTitle} [${taskId}]`);

  if (analysis.commitCount > 1) {
    console.log(chalk.dim('\n   Commits included:'));
    analysis.commits.forEach(c => {
      console.log(chalk.dim(`   • ${c.message}`));
    });
  }

  console.log(chalk.dim('\n📊 Project Progress:'));
  console.log(chalk.dim(`   ${progress}% complete (${doneCount}/${totalCount} tasks done)`));
  console.log(chalk.dim(`   Status: ${project.status}`));

  console.log(chalk.dim('\n💾 Saved to: .claude/luminary/projects.json'));
  console.log(chalk.dim(`🕒 Updated: ${new Date(project.updatedAt).toLocaleString()}\n`));
}
