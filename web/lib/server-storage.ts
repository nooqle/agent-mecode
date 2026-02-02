/**
 * Server-side storage for registered agents
 * Uses in-memory Map for Vercel serverless (data persists within same instance)
 * For production, use a proper database like Vercel Postgres, Upstash Redis, etc.
 */

export interface StoredAgent {
  id: string;
  meCode: any;
  claimLink: string;
  claimed: boolean;
  createdAt: string;
}

// In-memory storage (note: this won't persist across serverless invocations)
// For demo purposes only - use a real database in production
const agentStore = new Map<string, StoredAgent>();

export function saveAgentServer(agent: StoredAgent): void {
  agentStore.set(agent.id, agent);
}

export function getAgentByIdServer(id: string): StoredAgent | null {
  return agentStore.get(id) || null;
}

export function claimAgentServer(id: string): boolean {
  const agent = agentStore.get(id);
  if (agent && !agent.claimed) {
    agent.claimed = true;
    agentStore.set(id, agent);
    return true;
  }
  return false;
}

export function getAllAgentsServer(): StoredAgent[] {
  return Array.from(agentStore.values());
}
