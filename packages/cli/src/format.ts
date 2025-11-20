/**
 * Formatting utilities for CLI output
 */

import chalk from 'chalk';
import type { ProjectSpec, Task } from './storage.js';

/**
 * Get status icon for a project
 */
export function getProjectStatusIcon(status: ProjectSpec['status']): string {
  switch (status) {
    case 'completed':
      return '✅';
    case 'in-progress':
      return '🔄';
    case 'planning':
      return '📋';
    default:
      return '❓';
  }
}

/**
 * Get status icon for a task
 */
export function getTaskStatusIcon(status: Task['status']): string {
  switch (status) {
    case 'done':
      return '✅';
    case 'in-progress':
      return '🔄';
    case 'todo':
      return '⬜';
    default:
      return '❓';
  }
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'done').length;
  return Math.round((completed / tasks.length) * 100);
}

/**
 * Format a progress bar
 */
export function formatProgressBar(percentage: number, width: number = 20): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  if (percentage === 100) {
    return chalk.green(bar);
  } else if (percentage >= 50) {
    return chalk.yellow(bar);
  } else {
    return chalk.red(bar);
  }
}

/**
 * Format a date string
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString();
}

/**
 * Format a relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return 'just now';
  }
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
