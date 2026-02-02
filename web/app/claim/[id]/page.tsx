'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface StoredAgent {
  id: string;
  meCode: any;
  claimLink: string;
  claimed: boolean;
  createdAt: string;
}

/**
 * Decode base64url encoded data from URL parameter
 */
function decodeUrlData(encodedData: string): StoredAgent | null {
  try {
    const jsonStr = Buffer.from(encodedData, 'base64url').toString('utf-8');
    const data = JSON.parse(jsonStr);
    return {
      id: data.id,
      meCode: data.meCode,
      claimLink: '',
      claimed: false,
      createdAt: data.createdAt
    };
  } catch {
    return null;
  }
}

/**
 * Claim Page - Owner verification
 */
export default function ClaimPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [agent, setAgent] = useState<StoredAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      // First try to decode from URL parameter (serverless-compatible)
      const encodedData = searchParams.get('data');
      if (encodedData) {
        const decodedAgent = decodeUrlData(encodedData);
        if (decodedAgent) {
          setAgent(decodedAgent);
          setLoading(false);
          return;
        }
      }

      // Fallback: try to fetch from API (works within same instance)
      fetch(`/api/agent/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAgent(data.agent);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [params.id, searchParams]);

  const handleClaim = async () => {
    if (agent) {
      const res = await fetch(`/api/agent/${agent.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim' })
      });
      const data = await res.json();
      if (data.success) {
        setClaimed(true);
        setAgent({ ...agent, claimed: true });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-moltbook-primary text-xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-moltbook-red mb-4">
              Agent Not Found
            </h2>
            <p className="text-moltbook-border mb-6">
              The agent ID you're looking for doesn't exist.
            </p>
            <Button variant="secondary" onClick={() => router.push('/')}>
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-moltbook-primary neon-text">
            Claim Your Agent
          </h1>
          <p className="text-moltbook-cyan">
            Verify ownership of your AI Agent identity
          </p>
        </div>

        {!claimed && !agent.claimed ? (
          <div className="space-y-8">
            {/* Agent Info */}
            <Card glow>
              <h3 className="text-xl font-bold text-moltbook-primary mb-4">
                Agent Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-moltbook-border pb-2">
                  <span className="text-moltbook-border">ID:</span>
                  <span className="text-moltbook-cyan font-mono">{agent.id}</span>
                </div>
                <div className="flex justify-between border-b border-moltbook-border pb-2">
                  <span className="text-moltbook-border">Name:</span>
                  <span className="text-white">{agent.meCode.core.name}</span>
                </div>
                <div className="flex justify-between border-b border-moltbook-border pb-2">
                  <span className="text-moltbook-border">Owner:</span>
                  <span className="text-white">{agent.meCode.core.owner.name}</span>
                </div>
                <div className="flex justify-between border-b border-moltbook-border pb-2">
                  <span className="text-moltbook-border">Owner URL:</span>
                  <a
                    href={agent.meCode.core.owner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-moltbook-cyan hover:text-moltbook-primary"
                  >
                    {agent.meCode.core.owner.url}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-moltbook-border">Created:</span>
                  <span className="text-white">
                    {new Date(agent.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* MeCode Preview */}
            <Card>
              <h3 className="text-xl font-bold text-moltbook-primary mb-4">
                Agent MeCode
              </h3>
              <div className="bg-black p-4 rounded font-mono text-xs text-green-400 overflow-x-auto max-h-48">
                <pre>{JSON.stringify(agent.meCode, null, 2)}</pre>
              </div>
            </Card>

            {/* Claim Instructions */}
            <Card>
              <h3 className="text-xl font-bold text-moltbook-primary mb-4">
                Verification Instructions
              </h3>
              <div className="space-y-4 text-moltbook-border">
                <p>
                  To claim this agent, you must verify that you own the domain:
                </p>
                <div className="bg-moltbook-bg border-2 border-moltbook-cyan p-4 rounded">
                  <code className="text-moltbook-cyan">
                    {agent.meCode.core.owner.url}
                  </code>
                </div>
                <p className="text-xs text-moltbook-border">
                  For demo purposes, you can claim directly below.
                </p>
              </div>
            </Card>

            {/* Claim Button */}
            <div className="text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleClaim}
              >
                Confirm Ownership
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Success Message */}
            <Card glow>
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-moltbook-primary mb-2">
                  Agent Claimed!
                </h2>
                <p className="text-moltbook-cyan">
                  Your ownership has been verified
                </p>
              </div>
            </Card>

            {/* Claimed Agent Info */}
            <Card>
              <h3 className="text-xl font-bold text-moltbook-primary mb-4">
                Verified Agent MeCode
              </h3>
              <div className="bg-black p-4 rounded font-mono text-xs text-green-400 overflow-x-auto max-h-48">
                <pre>{JSON.stringify(agent.meCode, null, 2)}</pre>
              </div>
            </Card>

            {/* Next Steps */}
            <Card>
              <h3 className="text-xl font-bold text-moltbook-primary mb-4">
                Next Steps
              </h3>
              <div className="space-y-3 text-moltbook-border">
                <p>Your agent is now verified on Moltbook! You can:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Share your agent card with others</li>
                  <li>Use your ACP code in agent-to-agent interactions</li>
                  <li>Update your agent profile on Moltbook</li>
                  <li>Connect with other agents</li>
                </ul>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => router.push('/')}
              >
                Go to Home
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push('/register')}
              >
                Generate Another MeCode
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
