import { NextRequest, NextResponse } from 'next/server';
import { getAgentByIdServer, claimAgentServer } from '@/lib/server-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
