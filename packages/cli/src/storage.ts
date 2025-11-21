/**
 * Storage utilities for reading LuminarySmartSpace project data
 * Shared logic between CLI and MCP server
 */

import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';

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
 * Path to the storage file
 */
const STORE_PATH = join(process.cwd(), '.claude', 'luminary', 'projects.json');

/**
 * Ensure storage directory exists
 */
async function ensureStorageDir(): Promise<void> {
  const dir = dirname(STORE_PATH);
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
    await access(STORE_PATH);
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
    const exists = await projectsFileExists();
    if (!exists) {
      return null;
    }

    const data = await readFile(STORE_PATH, 'utf-8');
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
    await ensureStorageDir();

    // Update timestamp
    store.lastUpdated = new Date().toISOString();

    // Serialize with pretty formatting
    const json = JSON.stringify(store, null, 2);

    // Write to file
    await writeFile(STORE_PATH, json, 'utf-8');
  } catch (error) {
    console.error('Error saving projects:', error);
    throw new Error(
      'Failed to save project data. Check file permissions for .claude/luminary/'
    );
  }
}
