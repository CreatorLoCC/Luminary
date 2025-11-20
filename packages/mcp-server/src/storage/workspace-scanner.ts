/**
 * Workspace Scanner for MCP Server
 *
 * Scans for all .claude/luminary/projects.json files in the workspace
 * and aggregates them for a unified view across multiple project directories.
 *
 * @module storage/workspace-scanner
 */

import { readdir, access, readFile } from 'fs/promises';
import { join, dirname, relative } from 'path';
import type { ProjectStore, ProjectSpec } from './types.js';

/**
 * Extended project spec with source location metadata
 */
export interface AggregatedProject extends ProjectSpec {
  sourcePath: string; // Path to the .claude/luminary directory
  sourceDir: string;  // Relative path from workspace root
}

/**
 * Maximum depth to search for project files
 */
const MAX_DEPTH = 5;

/**
 * Directories to skip during scanning
 */
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  'target',
  '.next',
  '.turbo',
  'coverage',
  '.cache',
]);

/**
 * Check if a file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load a single projects.json file
 */
async function loadProjectsFile(path: string): Promise<ProjectStore | null> {
  try {
    const data = await readFile(path, 'utf-8');
    const parsed = JSON.parse(data) as ProjectStore;

    if (!parsed.version || !Array.isArray(parsed.projects)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Recursively scan a directory for .claude/luminary/projects.json files
 */
async function scanDirectory(
  dir: string,
  workspaceRoot: string,
  depth: number = 0
): Promise<AggregatedProject[]> {
  if (depth > MAX_DEPTH) {
    return [];
  }

  const projects: AggregatedProject[] = [];

  try {
    // Check for projects.json in this directory
    const projectsPath = join(dir, '.claude', 'luminary', 'projects.json');
    if (await fileExists(projectsPath)) {
      const store = await loadProjectsFile(projectsPath);
      if (store && store.projects.length > 0) {
        const sourceDir = relative(workspaceRoot, dir) || '.';
        const sourcePath = join(dir, '.claude', 'luminary');

        const annotatedProjects = store.projects.map(p => ({
          ...p,
          sourcePath,
          sourceDir,
        }));

        projects.push(...annotatedProjects);
      }
    }

    // Scan subdirectories
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (SKIP_DIRS.has(entry.name)) continue;
      if (entry.name.startsWith('.') && entry.name !== '.claude') continue;

      const subDir = join(dir, entry.name);
      const subProjects = await scanDirectory(subDir, workspaceRoot, depth + 1);
      projects.push(...subProjects);
    }
  } catch {
    // Silently skip directories we can't read
  }

  return projects;
}

/**
 * Find workspace root
 */
async function findWorkspaceRoot(): Promise<string> {
  const current = process.cwd();
  const hasLocalClaude = await fileExists(join(current, '.claude', 'luminary', 'projects.json'));

  if (hasLocalClaude) {
    const parent = dirname(current);
    try {
      const siblings = await readdir(parent, { withFileTypes: true });
      const dirsWithClaude = await Promise.all(
        siblings
          .filter(e => e.isDirectory() && e.name !== '.' && e.name !== '..')
          .map(async e => {
            const hasIt = await fileExists(join(parent, e.name, '.claude', 'luminary', 'projects.json'));
            return hasIt ? e.name : null;
          })
      );

      const validDirs = dirsWithClaude.filter(Boolean);

      if (validDirs.length > 1) {
        return parent;
      }
    } catch {
      // Can't read parent
    }
  }

  return current;
}

/**
 * Scan workspace and aggregate all projects
 */
export async function scanWorkspaceProjects(): Promise<AggregatedProject[]> {
  const workspaceRoot = await findWorkspaceRoot();
  const projects = await scanDirectory(workspaceRoot, workspaceRoot);

  // Deduplicate by project ID (use most recent)
  const projectMap = new Map<string, AggregatedProject>();

  for (const project of projects) {
    const existing = projectMap.get(project.id);
    if (!existing || new Date(project.updatedAt) > new Date(existing.updatedAt)) {
      projectMap.set(project.id, project);
    }
  }

  return Array.from(projectMap.values());
}
