/**
 * Workspace Scanner - Aggregates projects from multiple directories
 *
 * This module scans the workspace for all .claude/luminary/projects.json files
 * and aggregates them into a unified view. This allows users to see all their
 * projects regardless of which directory they're in.
 *
 * Strategy:
 * 1. Start from current working directory
 * 2. Scan parent directories until we find a workspace root (contains multiple subdirs with .claude)
 * 3. Scan all subdirectories for .claude/luminary/projects.json files
 * 4. Aggregate all projects with source path metadata
 *
 * @module workspace-scanner
 */

import { readdir, access, readFile } from 'fs/promises';
import { join, dirname, relative } from 'path';
import type { ProjectStore, ProjectSpec } from './storage.js';

/**
 * Extended project spec with source location metadata
 */
export interface AggregatedProject extends ProjectSpec {
  sourcePath: string; // Path to the .claude/luminary directory
  sourceDir: string;  // Relative path from workspace root
}

/**
 * Result of workspace scanning
 */
export interface WorkspaceProjects {
  workspaceRoot: string;
  projects: AggregatedProject[];
  sources: string[];  // List of all project.json files found
}

/**
 * Maximum depth to search for project files (prevents infinite recursion)
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

    // Basic validation
    if (!parsed.version || !Array.isArray(parsed.projects)) {
      console.error(`[workspace-scanner] Invalid project store at ${path}`);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(`[workspace-scanner] Error loading ${path}:`, error);
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
    // Check if this directory has a .claude/luminary/projects.json
    const projectsPath = join(dir, '.claude', 'luminary', 'projects.json');
    if (await fileExists(projectsPath)) {
      const store = await loadProjectsFile(projectsPath);
      if (store && store.projects.length > 0) {
        const sourceDir = relative(workspaceRoot, dir) || '.';
        const sourcePath = join(dir, '.claude', 'luminary');

        // Add source metadata to each project
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
  } catch (error) {
    // Silently skip directories we can't read (permissions, etc.)
    // This is normal in many workspace setups
  }

  return projects;
}

/**
 * Find the workspace root by looking for a directory that contains
 * multiple subdirectories with projects, or use the current directory
 */
async function findWorkspaceRoot(): Promise<string> {
  let current = process.cwd();

  // For now, use a simple heuristic: if we're in a subdirectory with .claude,
  // go up one level to get the workspace root
  const hasLocalClaude = await fileExists(join(current, '.claude', 'luminary', 'projects.json'));

  if (hasLocalClaude) {
    // Check if parent has other directories with .claude
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

      // If we found multiple directories with .claude at the parent level, use parent as workspace root
      if (validDirs.length > 1) {
        return parent;
      }
    } catch {
      // Can't read parent, just use current
    }
  }

  // Default to current directory as workspace root
  return current;
}

/**
 * Scan the workspace and aggregate all projects
 */
export async function scanWorkspace(): Promise<WorkspaceProjects> {
  const workspaceRoot = await findWorkspaceRoot();
  const projects = await scanDirectory(workspaceRoot, workspaceRoot);

  // Deduplicate by project ID (if same project appears in multiple locations, use most recent)
  const projectMap = new Map<string, AggregatedProject>();

  for (const project of projects) {
    const existing = projectMap.get(project.id);
    if (!existing || new Date(project.updatedAt) > new Date(existing.updatedAt)) {
      projectMap.set(project.id, project);
    }
  }

  const uniqueProjects = Array.from(projectMap.values());

  // Get list of source files
  const sources = [...new Set(projects.map(p => p.sourcePath))];

  return {
    workspaceRoot,
    projects: uniqueProjects,
    sources,
  };
}

/**
 * Get all projects from the workspace, aggregated from all sources
 */
export async function getAllWorkspaceProjects(): Promise<AggregatedProject[]> {
  const result = await scanWorkspace();
  return result.projects;
}
