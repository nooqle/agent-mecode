/**
 * LocalStorage utilities for managing registered agents
 */

import { RegisteredAgent } from './acp';

const STORAGE_KEY = 'moltbook_agents';

/**
 * Get all registered agents from localStorage
 */
export function getAgents(): RegisteredAgent[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save an agent to localStorage
 */
export function saveAgent(agent: RegisteredAgent): void {
  const agents = getAgents();
  agents.push(agent);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
}

/**
 * Get a specific agent by ID
 */
export function getAgentById(id: string): RegisteredAgent | null {
  const agents = getAgents();
  return agents.find((a) => a.id === id) || null;
}

/**
 * Update an agent's claim status
 */
export function claimAgent(id: string): boolean {
  const agents = getAgents();
  const agent = agents.find((a) => a.id === id);
  if (agent && !agent.claimed) {
    agent.claimed = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
    return true;
  }
  return false;
}
