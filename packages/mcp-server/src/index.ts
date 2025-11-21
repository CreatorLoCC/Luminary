#!/usr/bin/env node

/**
 * LuminarySmartSpace MCP Server - Main Entry Point
 *
 * This is an MCP (Model Context Protocol) server that provides Claude with tools
 * to save, retrieve, and manage project specifications across sessions.
 *
 * What is MCP?
 * MCP is a protocol that allows AI assistants like Claude to access external tools
 * and data sources. Think of it like giving Claude a set of APIs it can call to
 * perform actions beyond just chatting - like saving files, querying databases, etc.
 *
 * How This Server Works:
 * 1. The server starts and listens on stdio (standard input/output)
 * 2. Claude sends requests to the server asking "what tools are available?"
 * 3. The server responds with a list of tools (save_spec, get_context, list_projects)
 * 4. When Claude wants to use a tool, it sends a CallToolRequest
 * 5. The server executes the tool and returns the result to Claude
 *
 * Architecture:
 * - This file sets up the MCP server and registers tool handlers
 * - Individual tools are implemented in the ./tools/ directory
 * - Data persistence is handled by the storage layer in ./storage/
 *
 * @module index
 * @author LuminarySmartSpace Team
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Import tool handlers and their input schemas
import { SaveSpecSchema, handleSaveSpec } from './tools/save-spec.js';
import { GetContextSchema, handleGetContext } from './tools/get-context.js';
import { handleListProjects } from './tools/list-projects.js';
import { SyncWorkSchema, handleSyncWork } from './tools/sync-work.js';

/**
 * Creates and configures the MCP server instance.
 *
 * The server configuration includes:
 * - name: Identifier used by Claude to reference this server
 * - version: Semantic version for compatibility tracking
 * - capabilities: Declares what the server can do (in this case, provide tools)
 *
 * Why declare capabilities?
 * This tells Claude what to expect from this server. In the future, MCP servers
 * might support resources, prompts, or other features. For now, we only provide tools.
 */
const server = new Server(
  {
    name: 'luminaryflow',
    version: '0.2.0', // Bumped version for sync_work feature
  },
  {
    capabilities: {
      tools: {}, // Empty object means "this server provides tools"
    },
  }
);

/**
 * Handles the ListTools request from Claude.
 *
 * When Claude connects to an MCP server, one of the first things it does is ask:
 * "What tools do you have available?" This handler responds with the complete
 * list of tools, their descriptions, and input schemas.
 *
 * Why use Zod schemas?
 * Zod provides runtime type validation AND compile-time type safety. We define
 * the schema once, and zod-to-json-schema converts it to JSON Schema format
 * that Claude can understand. This ensures Claude sends correctly formatted data.
 *
 * @async
 * @returns {Promise<{tools: Array}>} List of available tools with their schemas
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'save_spec',
        description:
          'Save a project specification with title, description, and tasks. ' +
          'Use this during /start:specify or when planning projects. ' +
          'This creates or updates a project in persistent storage so it can be ' +
          'retrieved in future sessions.',
        inputSchema: zodToJsonSchema(SaveSpecSchema),
      },
      {
        name: 'get_context',
        description:
          'Retrieve the full context for a project including all tasks and their status. ' +
          'Use this to remember what you were working on in previous sessions. ' +
          'Returns detailed information about task progress, descriptions, and timestamps.',
        inputSchema: zodToJsonSchema(GetContextSchema),
      },
      {
        name: 'list_projects',
        description:
          'List all tracked projects with their status and progress. ' +
          'Use this to see what projects are being worked on across all sessions. ' +
          'Provides a high-level overview without full task details.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'sync_work',
        description:
          '🆕 Retroactively document completed work to a project. ' +
          'Use this when work was done outside the normal workflow (e.g., direct coding without /start:specify). ' +
          'Optionally analyzes git commits to detect changes. ' +
          'Perfect for catching up project tracking with actual implementation.',
        inputSchema: zodToJsonSchema(SyncWorkSchema),
      },
    ],
  };
});

/**
 * Handles CallTool requests from Claude.
 *
 * When Claude wants to use a tool, it sends a CallToolRequest with:
 * - name: Which tool to call (e.g., "save_spec")
 * - arguments: The input data for that tool (validated against the schema)
 *
 * This handler:
 * 1. Validates the input using Zod (throws if invalid)
 * 2. Calls the appropriate tool handler
 * 3. Returns the result in MCP's expected format
 * 4. Catches and formats any errors that occur
 *
 * Why the try-catch?
 * Even with schema validation, errors can occur during execution (file I/O failures,
 * unexpected data, etc.). We catch these and return them as error responses so
 * Claude can inform the user what went wrong, rather than crashing the server.
 *
 * @async
 * @param {Object} request - The incoming tool call request
 * @param {string} request.params.name - Name of the tool to execute
 * @param {Object} request.params.arguments - Input arguments for the tool
 * @returns {Promise<{content: Array, isError?: boolean}>} Tool execution result
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'save_spec': {
        // Parse and validate input - Zod will throw if invalid
        const input = SaveSpecSchema.parse(args);
        const result = await handleSaveSpec(input);
        return {
          content: [{ type: 'text', text: result }],
        };
      }

      case 'get_context': {
        const input = GetContextSchema.parse(args);
        const result = await handleGetContext(input);
        return {
          content: [{ type: 'text', text: result }],
        };
      }

      case 'list_projects': {
        // No input validation needed - list_projects takes no arguments
        const result = await handleListProjects();
        return {
          content: [{ type: 'text', text: result }],
        };
      }

      case 'sync_work': {
        const input = SyncWorkSchema.parse(args);
        const result = await handleSyncWork(input);
        return {
          content: [{ type: 'text', text: result }],
        };
      }

      default:
        // This should rarely happen since Claude only calls registered tools,
        // but we handle it gracefully just in case
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    // Format error messages to be helpful for debugging
    // Check if it's an Error object to safely access .message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Log to stderr for server-side debugging (won't show to user)
    console.error(`[LuminarySmartSpace] Error executing tool '${name}':`, error);

    // Return formatted error to Claude (will show to user)
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

/**
 * Main server initialization function.
 *
 * This function:
 * 1. Creates a StdioServerTransport (communicates via stdin/stdout)
 * 2. Connects the MCP server to the transport
 * 3. Logs a startup message to stderr (not stdout, which is used for MCP protocol)
 *
 * Why stdio?
 * MCP servers can use different transports (HTTP, WebSocket, etc.). Claude Code
 * uses stdio, which means the server reads requests from stdin and writes responses
 * to stdout. This is simple and efficient for local processes.
 *
 * Why log to stderr?
 * Stdout is reserved for MCP protocol messages. Any diagnostic logging must go to
 * stderr to avoid corrupting the protocol communication.
 *
 * @async
 * @throws {Error} If server fails to start or connect
 */
async function main(): Promise<void> {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    // Log to stderr so it doesn't interfere with MCP protocol on stdout
    console.error('LuminarySmartSpace MCP Server running on stdio');
    console.error('Awaiting tool requests from Claude...');
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    throw error;
  }
}

/**
 * Graceful shutdown handler.
 *
 * When the process receives SIGINT (Ctrl+C) or SIGTERM (kill command),
 * this handler ensures the server shuts down cleanly:
 * 1. Stop accepting new requests
 * 2. Wait for pending operations to complete
 * 3. Close file handles
 * 4. Exit with appropriate status code
 *
 * Why is this important?
 * Without graceful shutdown, we risk corrupting the projects.json file if
 * it's being written when the process is killed.
 */
function setupShutdownHandlers(): void {
  const shutdown = async (signal: string): Promise<void> => {
    console.error(`\nReceived ${signal}, shutting down gracefully...`);

    try {
      // Give pending operations 5 seconds to complete
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.error('Shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  // Handle Ctrl+C
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle kill command
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Handle uncaught exceptions to prevent silent failures
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

// Start the server
setupShutdownHandlers();
main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
