/**
 * Workspace Configuration System
 *
 * Handles workspace detection and configuration for both:
 * - Multi-project mode: Installed at top-level, manages multiple projects
 * - Single-project mode: Installed in a project folder, tracks that project only
 *
 * Configuration is stored in .lumi/config.json at the workspace root
 */

import { readFile, writeFile, mkdir, access } from 'fs/promises';
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
    // For single-project mode
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
 * Save workspace configuration
 */
export async function saveWorkspaceConfig(config: WorkspaceConfig): Promise<void> {
  const configDir = join(config.workspaceRoot, '.lumi');
  const configPath = join(configDir, 'config.json');

  // Ensure .lumi directory exists
  await mkdir(configDir, { recursive: true });

  // Update timestamp
  config.updatedAt = new Date().toISOString();

  // Write configuration
  const json = JSON.stringify(config, null, 2);
  await writeFile(configPath, json, 'utf-8');
}

/**
 * Initialize workspace configuration
 * Creates .lumi/config.json with the specified mode
 */
export async function initWorkspace(
  mode: 'multi-project' | 'single-project',
  workspaceRoot: string = process.cwd(),
  projectName?: string
): Promise<WorkspaceConfig> {
  const config: WorkspaceConfig = {
    version: '1.0.0',
    mode,
    workspaceRoot: resolve(workspaceRoot),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add project info for single-project mode
  if (mode === 'single-project' && projectName) {
    config.projects = {
      name: projectName,
      path: workspaceRoot,
    };
  }

  await saveWorkspaceConfig(config);
  return config;
}

/**
 * Check if we're in a workspace
 */
export async function isInWorkspace(): Promise<boolean> {
  const root = await findWorkspaceRoot();
  return root !== null;
}

/**
 * Get the storage path for projects.json based on workspace config
 *
 * Returns:
 * - Multi-project: <workspace-root>/.lumi/projects/projects.json
 * - Single-project: <workspace-root>/.lumi/projects.json
 * - No workspace: <cwd>/.lumi/projects.json (fallback)
 */
export async function getProjectsStoragePath(): Promise<string> {
  const config = await loadWorkspaceConfig();

  if (!config) {
    // No workspace configured, use current directory
    return join(process.cwd(), '.lumi', 'projects.json');
  }

  if (config.mode === 'multi-project') {
    // Store in dedicated projects directory
    return join(config.workspaceRoot, '.lumi', 'projects', 'projects.json');
  } else {
    // Store in root .lumi directory
    return join(config.workspaceRoot, '.lumi', 'projects.json');
  }
}

/**
 * Get workspace info for display
 */
export async function getWorkspaceInfo(): Promise<{
  configured: boolean;
  mode?: 'multi-project' | 'single-project';
  root?: string;
  projectName?: string;
}> {
  const config = await loadWorkspaceConfig();

  if (!config) {
    return { configured: false };
  }

  return {
    configured: true,
    mode: config.mode,
    root: config.workspaceRoot,
    projectName: config.projects?.name,
  };
}
