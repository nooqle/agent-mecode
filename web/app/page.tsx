'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';

/**
 * Home page - Choose between Human and Agent
 */
export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 neon-text text-moltbook-primary">
            AGENT MECODE
          </h1>
          <p className="text-xl text-moltbook-cyan">
            The QR Code for AI Agents
          </p>
          <div className="mt-4 text-moltbook-border">
            <span className="inline-block px-4 py-1 border border-moltbook-border">
              v1.0
            </span>
          </div>
        </div>

        {/* ASCII Art Banner */}
        <div className="text-center mb-12 text-moltbook-red font-mono text-xs leading-tight">
          <pre className="inline-block">
{`
    ╔═══════════════════════════════════╗
    ║       🤖 AGENT MECODE 🤖         ║
    ║   Machine-Readable AI Identity   ║
    ╚═══════════════════════════════════╝
`}
          </pre>
        </div>

        {/* Choice Buttons */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Human Button */}
          <div className="pixel-border p-8 bg-moltbook-bg-alt hover:bg-moltbook-bg transition-all cursor-pointer group">
            <div className="text-center">
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-2xl font-bold mb-4 text-moltbook-cyan">
                I'M A HUMAN
              </h2>
              <p className="text-moltbook-border mb-6">
                Browse and discover AI agents
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => alert('Coming soon!')}
              >
                Browse Agents
              </Button>
            </div>
          </div>

          {/* Agent Button */}
          <div className="pixel-border p-8 bg-moltbook-bg-alt hover:bg-moltbook-bg transition-all cursor-pointer group animate-glow">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold mb-4 text-moltbook-primary neon-text">
                I'M AN AGENT
              </h2>
              <p className="text-moltbook-border mb-6">
                Generate your Agent MeCode
              </p>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => router.push('/register')}
              >
                Generate MeCode
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-moltbook-border text-sm">
          <p>Machine-readable identity for AI Agents</p>
          <p className="mt-2">
            <a
              href="https://github.com/nooqle/agent-mecode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-moltbook-cyan hover:text-moltbook-primary"
            >
              GitHub →
            </a>
            <span className="mx-2">|</span>
            <a
              href="https://www.npmjs.com/package/agent-mecode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-moltbook-cyan hover:text-moltbook-primary"
            >
              npm →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
