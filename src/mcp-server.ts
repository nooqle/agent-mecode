#!/usr/bin/env node
/**
 * ACP MCP Server
 * Model Context Protocol server for Agent Code Protocol
 *
 * Provides tools for:
 * - Parsing ACP Code from Mermaid format
 * - Validating ACP Code structure
 * - Generating ACP Code from agent data
 * - Converting ACP Code to Mermaid format
 * - Generating SVG identity cards
 * - A2A format import/export
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { ACPSDK } from './sdk';
import { ACPGenerator, GENERATOR_CONFIGS } from './generator';
import { generateACPCard, THEMES } from './card';
import type { ACPCode, AgentData, A2AAgentCard, AccessLevel } from './types';

const sdk = new ACPSDK();

// ==================== Tool Definitions ====================

const TOOLS = [
  {
    name: 'acp-parse',
    description: 'Parse ACP Code from Mermaid format. Returns the parsed JSON structure.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        mermaidCode: {
          type: 'string',
          description: 'Mermaid format string containing ACP Code in %%{ }%% block'
        }
      },
      required: ['mermaidCode']
    }
  },
  {
    name: 'acp-validate',
    description: 'Validate ACP Code structure. Returns validation result with any errors.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        code: {
          type: 'string',
          description: 'ACP Code as JSON string'
        }
      },
      required: ['code']
    }
  },
  {
    name: 'acp-generate',
    description: 'Generate ACP Code from agent data. Supports different platform configurations.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        agentData: {
          type: 'string',
          description: 'Agent data as JSON string'
        },
        platform: {
          type: 'string',
          enum: ['moltbook', 'wallet', 'collaboration', 'default'],
          description: 'Platform configuration to use',
          default: 'default'
        }
      },
      required: ['agentData']
    }
  },
  {
    name: 'acp-to-mermaid',
    description: 'Convert ACP Code to Mermaid format with visual graph.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        code: {
          type: 'string',
          description: 'ACP Code as JSON string'
        }
      },
      required: ['code']
    }
  },
  {
    name: 'acp-generate-card',
    description: 'Generate pixel-art SVG identity card from ACP Code.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        code: {
          type: 'string',
          description: 'ACP Code as JSON string'
        },
        theme: {
          type: 'string',
          enum: ['moltbook', 'matrix', 'vaporwave', 'frost', 'gameboy', 'amber', 'bloodmoon', 'cyber-yellow'],
          description: 'Card theme',
          default: 'moltbook'
        },
        width: {
          type: 'number',
          description: 'Card width in pixels',
          default: 400
        },
        height: {
          type: 'number',
          description: 'Card height in pixels',
          default: 560
        },
        animated: {
          type: 'boolean',
          description: 'Enable animations',
          default: false
        },
        showA2A: {
          type: 'boolean',
          description: 'Show A2A badge if enabled',
          default: true
        }
      },
      required: ['code']
    }
  },
  {
    name: 'acp-export-a2a',
    description: 'Export ACP Code to A2A AgentCard format.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        code: {
          type: 'string',
          description: 'ACP Code as JSON string'
        }
      },
      required: ['code']
    }
  },
  {
    name: 'acp-import-a2a',
    description: 'Import A2A AgentCard and convert to ACP Code.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        agentCard: {
          type: 'string',
          description: 'A2A AgentCard as JSON string'
        }
      },
      required: ['agentCard']
    }
  },
  {
    name: 'acp-filter-access',
    description: 'Filter ACP Code modules by access level.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        code: {
          type: 'string',
          description: 'ACP Code as JSON string'
        },
        level: {
          type: 'string',
          enum: ['public', 'verified', 'private'],
          description: 'Maximum access level to include'
        }
      },
      required: ['code', 'level']
    }
  },
  {
    name: 'acp-list-themes',
    description: 'List all available card themes with their color schemes.',
    inputSchema: {
      type: 'object' as const,
      properties: {}
    }
  },
  {
    name: 'acp-list-platforms',
    description: 'List all available generator platform configurations.',
    inputSchema: {
      type: 'object' as const,
      properties: {}
    }
  }
];

// ==================== Tool Handlers ====================

async function handleToolCall(name: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
  try {
    switch (name) {
      case 'acp-parse': {
        const code = sdk.parse(args.mermaidCode as string);
        return {
          content: [{ type: 'text', text: JSON.stringify(code, null, 2) }]
        };
      }

      case 'acp-validate': {
        const parsed = JSON.parse(args.code as string) as ACPCode;
        const result = sdk.validate(parsed);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'acp-generate': {
        const data = JSON.parse(args.agentData as string) as AgentData;
        const platform = (args.platform as string) || 'default';
        const generator = new ACPGenerator(platform);
        const code = generator.generate(data);
        return {
          content: [{ type: 'text', text: JSON.stringify(code, null, 2) }]
        };
      }

      case 'acp-to-mermaid': {
        const parsed = JSON.parse(args.code as string) as ACPCode;
        const mermaid = sdk.toMermaid(parsed);
        return {
          content: [{ type: 'text', text: mermaid }]
        };
      }

      case 'acp-generate-card': {
        const parsed = JSON.parse(args.code as string) as ACPCode;
        const svg = generateACPCard(parsed, {
          theme: (args.theme as string) || 'moltbook',
          width: (args.width as number) || 400,
          height: (args.height as number) || 560,
          animated: (args.animated as boolean) || false,
          showA2A: args.showA2A !== false
        });
        return {
          content: [{ type: 'text', text: svg }]
        };
      }

      case 'acp-export-a2a': {
        const parsed = JSON.parse(args.code as string) as ACPCode;
        const a2a = sdk.exportA2A(parsed);
        return {
          content: [{ type: 'text', text: JSON.stringify(a2a, null, 2) }]
        };
      }

      case 'acp-import-a2a': {
        const agentCard = JSON.parse(args.agentCard as string) as A2AAgentCard;
        const code = sdk.importA2A(agentCard);
        return {
          content: [{ type: 'text', text: JSON.stringify(code, null, 2) }]
        };
      }

      case 'acp-filter-access': {
        const parsed = JSON.parse(args.code as string) as ACPCode;
        const filtered = sdk.filterByAccess(parsed, args.level as AccessLevel);
        return {
          content: [{ type: 'text', text: JSON.stringify(filtered, null, 2) }]
        };
      }

      case 'acp-list-themes': {
        const themeList = Object.entries(THEMES).map(([name, colors]) => ({
          name,
          primary: colors.primary,
          bg: colors.bg,
          accent: colors.accent
        }));
        return {
          content: [{ type: 'text', text: JSON.stringify(themeList, null, 2) }]
        };
      }

      case 'acp-list-platforms': {
        const platformList = Object.entries(GENERATOR_CONFIGS).map(([name, config]) => ({
          name,
          requiredModules: config.requiredModules,
          optionalModules: config.optionalModules
        }));
        return {
          content: [{ type: 'text', text: JSON.stringify(platformList, null, 2) }]
        };
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
      isError: true
    };
  }
}

// ==================== Main Server ====================

async function main() {
  const server = new Server(
    {
      name: 'acp-server',
      version: '0.4.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return handleToolCall(name, args || {});
  });

  // Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('ACP MCP Server running via stdio...');
}

main().catch((err) => {
  console.error('Error starting ACP MCP Server:', err);
  process.exit(1);
});
