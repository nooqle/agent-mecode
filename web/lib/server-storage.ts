/**
 * Server-side storage for registered agents
 * Uses file-based storage for development/testing
 */

import fs from 'fs';
import path from 'path';

export interface StoredAgent {
  id: string;
  meCode: any;
  claimLink: string;
  claimed: boolean;
  createdAt: string;
}

const STORAGE_FILE = path.join(process.cwd(), '.agents.json');

function readStorage(): Record<string, StoredAgent> {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading storage:', e);
  }
  return {};
}

function writeStorage(data: Record<string, StoredAgent>): void {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing storage:', e);
  }
}

export function saveAgentServer(agent: StoredAgent): void {
  const storage = readStorage();
  storage[agent.id] = agent;
  writeStorage(storage);
}

export function getAgentByIdServer(id: string): StoredAgent | null {
  const storage = readStorage();
  return storage[id] || null;
}

export function claimAgentServer(id: string): boolean {
  const storage = readStorage();
  const agent = storage[id];
  if (agent && !agent.claimed) {
    agent.claimed = true;
    storage[id] = agent;
    writeStorage(storage);
    return true;
  }
  return false;
}

export function getAllAgentsServer(): StoredAgent[] {
  const storage = readStorage();
  return Object.values(storage);
}
