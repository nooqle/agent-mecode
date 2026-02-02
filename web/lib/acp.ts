/**
 * ACP SDK wrapper for the web application
 * Provides utilities for generating and managing ACP codes
 */

import { ACPGenerator, generateACPCard, ACPCode, AgentData } from '@anthropic/acp-sdk';

export interface RegisteredAgent {
  id: string;
  acpCode: ACPCode;
  svgCard: string;
  claimLink: string;
  claimed: boolean;
  createdAt: string;
}

/**
 * Generate a unique agent ID
 */
export function generateAgentId(name: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  const sanitized = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${sanitized}-${timestamp}-${random}`;
}

/**
 * Create an ACP code for an agent
 */
export function createACPCode(data: {
  name: string;
  description: string;
  capabilities: string[];
  ownerName: string;
  ownerUrl: string;
}): ACPCode {
  const generator = new ACPGenerator('moltbook');

  const agentData: AgentData = {
    id: generateAgentId(data.name),
    name: data.name,
    description: data.description,
    capabilities: data.capabilities,
    ownerName: data.ownerName,
    ownerUrl: data.ownerUrl,
    platform: 'moltbook',
    karma: 0,
    followers: 0,
    following: 0,
    tags: ['new-agent'],
    homepage: data.ownerUrl,
    source: data.ownerUrl,
  };

  return generator.generate(agentData);
}

/**
 * Generate SVG card from ACP code
 */
export function generateSVGCard(acpCode: ACPCode): string {
  return generateACPCard(acpCode, {
    theme: 'moltbook',
    width: 400,
    height: 560,
    showA2A: true,
    animated: true,
  });
}
