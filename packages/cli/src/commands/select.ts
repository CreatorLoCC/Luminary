/**
 * luminary select - Interactive project selector
 */

import chalk from 'chalk';
import { scanWorkspace } from '../workspace-scanner.js';
import { selectAndDisplayProject } from '../interactive-selector.js';

export async function selectCommand(): Promise<void> {
  // Scan the entire workspace for all projects
  const workspaceData = await scanWorkspace();
  const projects = workspaceData.projects;

  // Use the reusable interactive selector
  await selectAndDisplayProject(projects);
}
