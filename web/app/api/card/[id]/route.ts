import { NextRequest, NextResponse } from 'next/server';
import { generateACPCard } from 'agent-mecode';
import { getAgentByIdServer } from '@/lib/server-storage';

/**
 * Reconstruct meCode from minimal data
 */
function reconstructMeCode(data: any) {
  return {
    acp: '1.0',
    core: {
      id: data.i,
      name: data.n,
      description: data.d,
      capabilities: data.c,
      owner: {
        name: data.o,
        url: data.u,
        verified_by: 'moltbook'
      },
      sig: ''
    },
    'module:social': {
      karma: 0,
      followers: 0,
      following: 0,
      tags: ['new-agent'],
      _access: 'public'
    },
    'module:entry': {
      source: data.u,
      homepage: data.u,
      _access: 'public'
    }
  };
}

/**
 * Card API - Generate SVG card for an agent
 * Supports both server storage and URL-encoded data for serverless compatibility
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const encodedData = searchParams.get('d'); // 'd' for shorter URLs
  const theme = searchParams.get('theme') || 'moltbook';

  let meCode: any = null;

  // First try to decode from URL parameter (serverless-compatible)
  if (encodedData) {
    try {
      const jsonStr = Buffer.from(encodedData, 'base64url').toString('utf-8');
      const data = JSON.parse(jsonStr);
      meCode = reconstructMeCode(data);
    } catch {
      // Fall through to server storage
    }
  }

  // Fallback: try to get from server storage
  if (!meCode) {
    const agent = getAgentByIdServer(params.id);
    if (agent) {
      meCode = agent.meCode;
    }
  }

  if (!meCode) {
    return NextResponse.json({
      success: false,
      error: 'Agent not found'
    }, { status: 404 });
  }

  try {
    const svg = generateACPCard(meCode, { theme });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to generate card'
    }, { status: 500 });
  }
}
