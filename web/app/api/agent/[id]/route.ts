import { NextRequest, NextResponse } from 'next/server';
import { getAgentByIdServer, claimAgentServer } from '@/lib/server-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const encodedData = searchParams.get('data');

  // First try to decode from URL parameter (serverless-compatible)
  if (encodedData) {
    try {
      const jsonStr = Buffer.from(encodedData, 'base64url').toString('utf-8');
      const data = JSON.parse(jsonStr);
      return NextResponse.json({
        success: true,
        agent: {
          id: data.id,
          meCode: data.meCode,
          claimLink: '',
          claimed: false,
          createdAt: data.createdAt
        }
      });
    } catch {
      // Fall through to server storage
    }
  }

  // Fallback: try to get from server storage
  const agent = getAgentByIdServer(params.id);

  if (!agent) {
    return NextResponse.json({
      success: false,
      error: 'Agent not found'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    agent
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  if (body.action === 'claim') {
    const success = claimAgentServer(params.id);
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Agent claimed successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Agent not found or already claimed'
      }, { status: 400 });
    }
  }

  return NextResponse.json({
    success: false,
    error: 'Invalid action'
  }, { status: 400 });
}
