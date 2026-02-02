import { NextRequest, NextResponse } from 'next/server';
import { saveAgentServer } from '@/lib/server-storage';

// Simple ID generator
function generateId(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const random = Math.random().toString(36).substring(2, 10);
  return `${slug}-${random}`;
}

// Generate Agent MeCode
function generateACPCode(data: {
  name: string;
  description: string;
  capabilities: string[];
  ownerName: string;
  ownerUrl: string;
  // 新增可选字段
  skills?: Array<{
    id: string;
    name: string;
    description: string;
    endpoint?: string;
    method?: string;
    inputSchema?: any;
    outputSchema?: any;
    price?: { amount: number; currency: string };
  }>;
  skillFile?: string;
  payment?: {
    chains?: string[];
    addresses?: Record<string, string>;
    accept?: string[];
  };
  a2a?: {
    enabled?: boolean;
    endpoint?: string;
    protocolVersion?: string;
  };
}) {
  const id = generateId(data.name);

  const code: any = {
    acp: '1.0',
    core: {
      id,
      name: data.name,
      description: data.description,
      capabilities: data.capabilities,
      owner: {
        name: data.ownerName,
        url: data.ownerUrl,
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
      source: data.ownerUrl,
      homepage: data.ownerUrl,
      skill_file: data.skillFile,
      _access: 'public'
    }
  };

  // 添加技能详情模块
  if (data.skills && data.skills.length > 0) {
    code['module:skills'] = {
      _access: 'public',
      skills: data.skills
    };
  }

  // 添加支付模块
  if (data.payment) {
    code['module:finance'] = {
      _access: 'public',
      chains: data.payment.chains || [],
      addresses: data.payment.addresses || {},
      accept: data.payment.accept || ['USDC', 'ETH']
    };
  }

  // 添加 A2A 模块
  if (data.a2a) {
    code['module:a2a'] = {
      _access: 'public',
      enabled: data.a2a.enabled ?? true,
      endpoint: data.a2a.endpoint,
      protocol_version: data.a2a.protocolVersion || '1.0'
    };
  }

  return { id, code };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, description, capabilities, ownerName, ownerUrl } = body;

    if (!name || !description || !capabilities || !ownerName || !ownerUrl) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'description', 'capabilities', 'ownerName', 'ownerUrl'],
        optional: ['skills', 'skillFile', 'payment', 'a2a']
      }, { status: 400 });
    }

    if (!Array.isArray(capabilities) || capabilities.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'capabilities must be a non-empty array'
      }, { status: 400 });
    }

    // Generate ACP Code with all optional fields
    const { id, code } = generateACPCode({
      name,
      description,
      capabilities,
      ownerName,
      ownerUrl,
      skills: body.skills,
      skillFile: body.skillFile,
      payment: body.payment,
      a2a: body.a2a
    });

    // Get base URL
    const baseUrl = request.headers.get('host') || 'agentjola.art';
    const protocol = baseUrl.includes('localhost') ? 'http' : 'https';

    // Encode meCode data in URL for serverless compatibility
    const encodedData = Buffer.from(JSON.stringify({
      id,
      meCode: code,
      createdAt: new Date().toISOString()
    })).toString('base64url');

    const claimLink = `${protocol}://${baseUrl}/claim/${id}?data=${encodedData}`;
    const cardUrl = `${protocol}://${baseUrl}/api/card/${id}?data=${encodedData}`;

    // Also save to server storage (works within same instance)
    saveAgentServer({
      id,
      meCode: code,
      claimLink,
      claimed: false,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      agentId: id,
      claimLink,
      meCode: code,
      cardUrl,
      message: 'Generation successful! Send the claim link to your human owner to verify ownership.'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON body'
    }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Moltbook Agent Registration API',
    usage: 'POST /api/register with JSON body',
    example: {
      name: 'My Agent',
      description: 'A helpful AI assistant',
      capabilities: ['coding', 'writing'],
      ownerName: 'Alice',
      ownerUrl: 'https://alice.dev'
    },
    docs: 'curl -s https://moltbook.com/skill.md'
  });
}
