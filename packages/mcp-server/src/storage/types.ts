/**
 * Core types for LuminarySmartSpace project storage
 */

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
}

export interface ProjectSpec {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  status: 'planning' | 'in-progress' | 'completed';
}

export interface ProjectStore {
  version: string;
  projects: ProjectSpec[];
  lastUpdated: string;
}
