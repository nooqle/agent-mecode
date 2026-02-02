import { NextRequest, NextResponse } from 'next/server';
import { generateACPCard } from 'agent-mecode';
import { getAgentByIdServer } from '@/lib/server-storage';

/**
 * Card API - Generate SVG card for an agent
 * GET: Try to get from server storage by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get('theme') || 'moltbook';

  // Try to get from server storage
  const agent = getAgentByIdServer(params.id);
  if (!agent) {
    return NextResponse.json({
      success: false,
      error: 'Agent not found. Use POST /api/card with meCode in body instead.'
    }, { status: 404 });
  }

  try {
    const svg = generateACPCard(agent.meCode, { theme });
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
