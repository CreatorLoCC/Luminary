/**
 * JSON File Storage for Project Specifications
 *
 * This module handles all file I/O operations for persisting project data.
 * It provides a simple key-value store backed by a JSON file.
 *
 * Why JSON instead of a database?
 * - Simplicity: No database server to run or configure
 * - Portability: Works on any system with Node.js
 * - Human-readable: Users can inspect the file directly
 * - Git-friendly: Text format works well with version control
 *
 * @module storage/store
 */

import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import type { ProjectStore, ProjectSpec } from './types.js';

/**
 * Path to the JSON storage file.
 *
 * Structure: .claude/luminary/projects.json
 * - .claude/: Hidden directory (convention for tool data)
 * - luminary/: Specific to this tool (avoids conflicts)
 * - projects.json: The actual data file
 */
const STORE_PATH = join(process.cwd(), '.claude', 'luminary', 'projects.json');

/**
 * Regular expression for validating project IDs.
 *
 * SECURITY: This prevents path traversal attacks!
 * Only allows: lowercase letters, numbers, hyphens, underscores
 * Rejects: ../, ./, /, \, and other special characters
 *
 * Valid: "user-auth", "blog_platform", "feature-001"
 * Invalid: "../etc/passwd", "my/project", "test;rm"
 */
const ID_PATTERN = /^[a-z0-9_-]+$/;

/**
 * Validates and sanitizes a project ID.
 *
 * CRITICAL SECURITY FUNCTION
 * Prevents path traversal attacks by ensuring IDs can't escape
 * the intended directory or execute commands.
 *
 * @param {string} id - The ID to validate
 * @returns {string} The validated ID
 * @throws {Error} If ID contains invalid characters
 */
function sanitizeId(id: string): string {
  if (!id || id.trim().length === 0) {
    throw new Error('Project ID cannot be empty');
  }

  if (!ID_PATTERN.test(id)) {
    throw new Error(
      'Invalid project ID. Only lowercase letters, numbers, hyphens, and underscores are allowed. ' +
      `Got: "${id}"`
    );
  }

  if (id.length > 100) {
    throw new Error('Project ID cannot exceed 100 characters');
  }

  return id;
}

/**
 * Creates an empty store structure.
 *
 * Used when:
 * - The projects.json file doesn't exist yet
 * - The file is corrupted and needs reset
 *
 * @returns {ProjectStore} Empty store with default values
 */
function createEmptyStore(): ProjectStore {
  return {
    version: '1.0.0',
    projects: [],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Ensures the storage directory exists.
 *
 * Creates the directory hierarchy if needed:
 * - .claude/
 * - .claude/luminary/
 *
 * Uses async operations to avoid blocking the event loop.
 *
 * @async
 * @returns {Promise<void>}
 */
async function ensureStorageDir(): Promise<void> {
  const dir = dirname(STORE_PATH);

  try {
    await access(dir);
  } catch {
    // Directory doesn't exist, create it
    await mkdir(dir, { recursive: true });
  }
}

/**
 * Validates the structure of loaded store data.
 *
 * Checks that the JSON file has the expected structure before using it.
 * Prevents crashes from corrupted or manually-edited files.
 *
 * @param {unknown} data - Data loaded from JSON file
 * @returns {boolean} True if data is a valid ProjectStore
 */
function isValidStore(data: unknown): data is ProjectStore {
  if (typeof data !== 'object' || data === null) return false;

  const store = data as Record<string, unknown>;

  return (
    typeof store.version === 'string' &&
    Array.isArray(store.projects) &&
    typeof store.lastUpdated === 'string'
  );
}

/**
 * Loads projects from the JSON file.
 *
 * Handles multiple scenarios:
 * 1. File doesn't exist → Create empty store
 * 2. File is invalid JSON → Log error, return empty store
 * 3. File has wrong structure → Log error, return empty store
 * 4. File is valid → Parse and return
 *
 * Error Philosophy:
 * Rather than crashing, we log errors and return an empty store.
 * This keeps the tool functional even if data is corrupted.
 *
 * @async
 * @returns {Promise<ProjectStore>} The loaded store or empty store on error
 */
export async function loadProjects(): Promise<ProjectStore> {
  try {
    await ensureStorageDir();

    // Check if file exists using async access
    try {
      await access(STORE_PATH);
    } catch {
      // File doesn't exist, create and return empty store
      const emptyStore = createEmptyStore();
      await saveProjects(emptyStore);
      return emptyStore;
    }

    // Read and parse file
    const data = await readFile(STORE_PATH, 'utf-8');
    const parsed: unknown = JSON.parse(data);

    // Validate structure
    if (!isValidStore(parsed)) {
      console.error('[store] Invalid store structure, resetting to empty store');
      const emptyStore = createEmptyStore();
      await saveProjects(emptyStore);
      return emptyStore;
    }

    return parsed;
  } catch (error) {
    console.error('[store] Error loading projects:', error);
    return createEmptyStore();
  }
}

/**
 * Saves projects to the JSON file.
 *
 * Writes the entire store to disk with pretty-printing for readability.
 * Updates the lastUpdated timestamp automatically.
 *
 * Future Enhancement:
 * Could implement atomic writes (write to temp file, then rename)
 * to prevent corruption if process crashes during write.
 *
 * @async
 * @param {ProjectStore} store - The store to save
 * @returns {Promise<void>}
 * @throws {Error} If write fails
 */
export async function saveProjects(store: ProjectStore): Promise<void> {
  try {
    await ensureStorageDir();

    // Update timestamp
    store.lastUpdated = new Date().toISOString();

    // Serialize with pretty formatting (2-space indentation)
    const json = JSON.stringify(store, null, 2);

    // Write to file (UTF-8 for emoji support)
    await writeFile(STORE_PATH, json, 'utf-8');
  } catch (error) {
    console.error('[store] Error saving projects:', error);
    throw new Error(
      'Failed to save project data. Check file permissions for .claude/luminary/'
    );
  }
}

/**
 * Adds or updates a project specification.
 *
 * Workflow:
 * 1. Load current store
 * 2. Sanitize the ID (SECURITY CHECK)
 * 3. Check if project exists
 * 4. Create or update with timestamps
 * 5. Save updated store
 *
 * Returns the saved spec so caller can access generated timestamps.
 *
 * @async
 * @param {Omit<ProjectSpec, 'createdAt' | 'updatedAt'>} spec - Project data to save
 * @returns {Promise<ProjectSpec>} The saved project with timestamps
 * @throws {Error} If ID is invalid or save fails
 */
export async function saveProjectSpec(
  spec: Omit<ProjectSpec, 'createdAt' | 'updatedAt'>
): Promise<ProjectSpec> {
  // SECURITY: Validate ID before using it
  sanitizeId(spec.id);

  const store = await loadProjects();
  const existingIndex = store.projects.findIndex((p) => p.id === spec.id);
  const now = new Date().toISOString();

  let savedSpec: ProjectSpec;

  if (existingIndex >= 0) {
    // Update existing project (preserve original createdAt)
    savedSpec = {
      ...spec,
      createdAt: store.projects[existingIndex].createdAt,
      updatedAt: now,
    };
    store.projects[existingIndex] = savedSpec;
  } else {
    // Create new project
    savedSpec = {
      ...spec,
      createdAt: now,
      updatedAt: now,
    };
    store.projects.push(savedSpec);
  }

  await saveProjects(store);
  return savedSpec;
}

/**
 * Retrieves a project by ID.
 *
 * Returns null if not found (rather than throwing) so caller
 * can handle the "not found" case gracefully.
 *
 * @async
 * @param {string} id - The project ID to find
 * @returns {Promise<ProjectSpec | null>} The project or null if not found
 * @throws {Error} If ID is invalid
 */
export async function getProjectById(id: string): Promise<ProjectSpec | null> {
  // SECURITY: Validate ID
  sanitizeId(id);

  const store = await loadProjects();
  return store.projects.find((p) => p.id === id) || null;
}

/**
 * Retrieves all projects.
 *
 * Loads the entire store into memory. Fine for small-to-medium
 * datasets (< 1000 projects).
 *
 * @async
 * @returns {Promise<ProjectSpec[]>} Array of all projects
 */
export async function listAllProjects(): Promise<ProjectSpec[]> {
  const store = await loadProjects();
  return store.projects;
}
