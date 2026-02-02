import { NextRequest, NextResponse } from 'next/server';
import { generateACPCard } from 'agent-mecode';

/**
 * Card API - Generate SVG card from meCode
 * POST: Generate card from meCode in request body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { meCode, theme = 'moltbook' } = body;

    if (!meCode) {
      return NextResponse.json({
        success: false,
        error: 'meCode is required in request body'
      }, { status: 400 });
    }

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
      error: 'Failed to generate card. Make sure meCode is valid.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Card Generation API',
    usage: 'POST /api/card with JSON body containing meCode',
    example: {
      meCode: { /* your meCode object */ },
      theme: 'moltbook'
    },
    themes: ['moltbook', 'matrix', 'vaporwave', 'amber', 'frost', 'bloodmoon', 'gameboy', 'cyber-yellow']
  });
}
