/**
 * Storage utilities for reading LuminarySmartSpace project data
 * Shared logic between CLI and MCP server
 *
 * Now supports workspace-aware storage paths:
 * - Multi-project mode: <workspace-root>/.lumi/projects/projects.json
 * - Single-project mode: <workspace-root>/.lumi/projects.json
 * - Legacy fallback: .claude/luminary/projects.json
 */

import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { getProjectsStoragePath, findWorkspaceRoot } from './workspace-config.js';

/**
 * Core types for project data
 */
export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface ProjectSpec {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  status: 'planning' | 'in-progress' | 'completed';
  source?: string;
}

export interface ProjectStore {
  version: string;
  projects: ProjectSpec[];
  lastUpdated: string;
}

/**
 * Get the storage path dynamically based on workspace config
 * Falls back to legacy path if no workspace configured
 */
async function getStoragePath(): Promise<string> {
  try {
    // Try workspace-aware path first
    const workspacePath = await getProjectsStoragePath();
    return workspacePath;
  } catch {
    // Fallback to legacy path for backward compatibility
    return join(process.cwd(), '.claude', 'luminary', 'projects.json');
  }
}

/**
 * Ensure storage directory exists
 */
async function ensureStorageDir(storagePath: string): Promise<void> {
  const dir = dirname(storagePath);
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

/**
 * Check if the projects file exists
 */
export async function projectsFileExists(): Promise<boolean> {
  try {
    const storagePath = await getStoragePath();
    await access(storagePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load projects from storage
 */
export async function loadProjects(): Promise<ProjectStore | null> {
  try {
    const storagePath = await getStoragePath();
    const exists = await projectsFileExists();
    if (!exists) {
      return null;
    }

    const data = await readFile(storagePath, 'utf-8');
    const parsed = JSON.parse(data) as ProjectStore;
    return parsed;
  } catch (error) {
    console.error('Error loading projects:', error);
    return null;
  }
}

/**
 * Get a project by ID
 */
export async function getProjectById(id: string): Promise<ProjectSpec | null> {
  const store = await loadProjects();
  if (!store) return null;

  return store.projects.find((p) => p.id === id) || null;
}

/**
 * Get all projects
 */
export async function getAllProjects(): Promise<ProjectSpec[]> {
  const store = await loadProjects();
  if (!store) return [];

  return store.projects;
}

/**
 * Save projects to storage
 */
export async function saveProjects(store: ProjectStore): Promise<void> {
  try {
    const storagePath = await getStoragePath();
    await ensureStorageDir(storagePath);

    // Update timestamp
    store.lastUpdated = new Date().toISOString();

    // Serialize with pretty formatting
    const json = JSON.stringify(store, null, 2);

    // Write to file
    await writeFile(storagePath, json, 'utf-8');
  } catch (error) {
    console.error('Error saving projects:', error);
    throw new Error(
      'Failed to save project data. Check file permissions for the storage directory'
    );
  }
}
