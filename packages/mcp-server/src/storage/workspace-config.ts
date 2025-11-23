/**
 * Workspace Configuration System for MCP Server
 *
 * Handles workspace detection and configuration for both:
 * - Multi-project mode: Installed at top-level, manages multiple projects
 * - Single-project mode: Installed in a project folder, tracks that project only
 *
 * Configuration is stored in .lumi/config.json at the workspace root
 */

import { readFile, access } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { existsSync } from 'fs';

/**
 * Workspace configuration structure
 */
export interface WorkspaceConfig {
  version: string;
  mode: 'multi-project' | 'single-project';
  workspaceRoot: string;
  createdAt: string;
  updatedAt: string;
  projects?: {
    name?: string;
    path?: string;
  };
}

/**
 * Find workspace root by looking for .lumi/config.json
 * Walks up directory tree until found or reaches filesystem root
 */
export async function findWorkspaceRoot(startPath: string = process.cwd()): Promise<string | null> {
  let currentPath = resolve(startPath);
  const root = resolve('/');

  while (currentPath !== root) {
    const configPath = join(currentPath, '.lumi', 'config.json');

    try {
      await access(configPath);
      return currentPath; // Found it!
    } catch {
      // Not found, go up one level
      currentPath = dirname(currentPath);
    }
  }

  // Check root itself
  const rootConfigPath = join(root, '.lumi', 'config.json');
  try {
    await access(rootConfigPath);
    return root;
  } catch {
    return null; // No workspace found
  }
}

/**
 * Find workspace root synchronously (for use in module initialization)
 */
export function findWorkspaceRootSync(startPath: string = process.cwd()): string | null {
  let currentPath = resolve(startPath);
  const root = resolve('/');

  while (currentPath !== root) {
    const configPath = join(currentPath, '.lumi', 'config.json');

    if (existsSync(configPath)) {
      return currentPath;
    }

    currentPath = dirname(currentPath);
  }

  // Check root itself
  const rootConfigPath = join(root, '.lumi', 'config.json');
  if (existsSync(rootConfigPath)) {
    return root;
  }

  return null;
}

/**
 * Load workspace configuration
 */
export async function loadWorkspaceConfig(workspaceRoot?: string): Promise<WorkspaceConfig | null> {
  try {
    const root = workspaceRoot || await findWorkspaceRoot();

    if (!root) {
      return null;
    }

    const configPath = join(root, '.lumi', 'config.json');
    const data = await readFile(configPath, 'utf-8');
    return JSON.parse(data) as WorkspaceConfig;
  } catch (error) {
    return null;
  }
}

/**
 * Get the storage path for projects.json based on workspace config
 *
 * Returns:
 * - Multi-project: <workspace-root>/.lumi/projects/projects.json
 * - Single-project: <workspace-root>/.lumi/projects.json
 * - Legacy fallback: .claude/luminary/projects.json (backward compatibility)
 */
export async function getProjectsStoragePath(): Promise<string> {
  const config = await loadWorkspaceConfig();

  if (!config) {
    // No workspace configured, use legacy path for backward compatibility
    return join(process.cwd(), '.claude', 'luminary', 'projects.json');
  }

  if (config.mode === 'multi-project') {
    // Store in dedicated projects directory
    return join(config.workspaceRoot, '.lumi', 'projects', 'projects.json');
  } else {
    // Store in root .lumi directory
    return join(config.workspaceRoot, '.lumi', 'projects.json');
  }
}
