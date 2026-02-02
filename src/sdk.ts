/**
 * ACP SDK - 核心类
 * Agent Code Protocol v0.4
 */

import {
  ACPCode,
  Core,
  ValidationResult,
  OwnerVerificationResult,
  A2AAgentCard,
  AccessLevel,
  ModuleSocial,
  ModuleEntry
} from './types';

export class ACPSDK {
  /**
   * 从 Mermaid 格式解析 ACP Code
   */
  parse(mermaidCode: string): ACPCode {
    const pattern = /%%\{([\s\S]*?)\}%%/;
    const match = mermaidCode.match(pattern);

    if (!match) {
      throw new Error('ACP_001: Invalid format - no %%{ }%% block found');
    }

    try {
      const jsonStr = match[1].trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      throw new Error(`ACP_001: Invalid JSON in ACP Code - ${(e as Error).message}`);
    }
  }

  /**
   * 验证 ACP Code 格式
   */
  validate(code: ACPCode): ValidationResult {
    const errors: string[] = [];

    // 检查 acp 版本
    if (!code.acp) {
      errors.push('Missing acp version');
    } else if (!/^\d+\.\d+$/.test(code.acp)) {
      errors.push('Invalid acp version format');
    }

    // 检查 core
    if (!code.core) {
      errors.push('Missing core');
    } else {
      if (!code.core.id) errors.push('Missing core.id');
      if (!code.core.name) errors.push('Missing core.name');
      if (!code.core.capabilities || code.core.capabilities.length === 0) {
        errors.push('Missing core.capabilities');
      }
      if (!code.core.owner) {
        errors.push('Missing core.owner');
      } else {
        if (!code.core.owner.name) errors.push('Missing core.owner.name');
        if (!code.core.owner.url) errors.push('Missing core.owner.url');
      }
      if (!code.core.sig) errors.push('Missing core.sig');
    }

    // 检查模块格式
    for (const key of Object.keys(code)) {
      if (key.startsWith('module:')) {
        const module = code[key as keyof ACPCode];
        if (module && typeof module === 'object' && '_access' in module) {
          const access = module._access;
          if (access && !['public', 'verified', 'private'].includes(access)) {
            errors.push(`Invalid _access value in ${key}`);
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 获取 Core
   */
  getCore(code: ACPCode): Core {
    return code.core;
  }

  /**
   * 获取指定模块
   */
  getModule<T>(code: ACPCode, name: string): T | null {
    const module = code[name as keyof ACPCode];
    return module as T || null;
  }

  /**
   * 检查模块是否存在
   */
  hasModule(code: ACPCode, name: string): boolean {
    return name in code && code[name as keyof ACPCode] !== undefined;
  }

  /**
   * 添加模块
   */
  addModule(code: ACPCode, name: string, data: any): ACPCode {
    return {
      ...code,
      [name]: data
    };
  }

  /**
   * 移除模块
   */
  removeModule(code: ACPCode, name: string): ACPCode {
    const newCode = { ...code };
    delete newCode[name as keyof ACPCode];
    return newCode;
  }

  /**
   * 按访问级别过滤模块
   */
  filterByAccess(code: ACPCode, level: AccessLevel): ACPCode {
    const accessOrder: AccessLevel[] = ['public', 'verified', 'private'];
    const maxLevel = accessOrder.indexOf(level);

    const filtered: ACPCode = {
      acp: code.acp,
      core: code.core
    };

    for (const [key, value] of Object.entries(code)) {
      if (key.startsWith('module:') && value && typeof value === 'object') {
        const moduleAccess = (value as any)._access || 'public';
        if (accessOrder.indexOf(moduleAccess) <= maxLevel) {
          (filtered as any)[key] = value;
        }
      }
    }

    return filtered;
  }

  /**
   * 转换为 Mermaid 格式
   */
  toMermaid(code: ACPCode): string {
    const jsonStr = JSON.stringify(code, null, 2);
    const mermaidGraph = this.generateMermaidGraph(code);

    return `%%{
${jsonStr}
}%%
${mermaidGraph}`;
  }

  /**
   * 生成 Mermaid 图形部分
   */
  private generateMermaidGraph(code: ACPCode): string {
    const lines: string[] = ['graph TB'];

    // Identity 区块
    const name = code.core.name;
    const desc = code.core.description || '';
    const verified = code.core.owner.verified_by ? '✓ Verified' : '';

    lines.push(`    subgraph identity["🤖 ${name}"]`);
    if (desc) lines.push(`        desc["${desc.slice(0, 40)}${desc.length > 40 ? '...' : ''}"]`);
    if (verified) lines.push(`        status["${verified}"]`);
    lines.push('    end');
    lines.push('');

    // Social 模块
    const social = code['module:social'];
    if (social) {
      lines.push('    subgraph social["⭐ Social"]');
      if (social.karma !== undefined) lines.push(`        karma["${social.karma} karma"]`);
      if (social.followers !== undefined) lines.push(`        followers["${social.followers} followers"]`);
      lines.push('    end');
      lines.push('');
    }

    // Capabilities
    const caps = code.core.capabilities.slice(0, 4);
    lines.push('    subgraph capabilities["📦 Capabilities"]');
    caps.forEach((cap, i) => {
      const capName = typeof cap === 'string' ? cap : cap.name;
      lines.push(`        c${i}["${capName}"]`);
    });
    lines.push('    end');
    lines.push('');

    // Owner
    lines.push('    subgraph owner["👤 Owner"]');
    lines.push(`        human["${code.core.owner.name}${code.core.owner.verified_by ? ' ✓' : ''}"]`);
    lines.push('    end');
    lines.push('');

    // Entry
    const entry = code['module:entry'];
    if (entry) {
      const url = (entry.homepage || entry.source)
        .replace('https://', '')
        .replace('http://', '')
        .replace('www.', '');

      lines.push('    subgraph entry["🔗 Entry"]');
      lines.push(`        url["${url.slice(0, 35)}"]`);
      if (code['module:a2a']?.enabled) {
        lines.push('        a2a["✓ A2A compatible"]');
      }
      lines.push('    end');
      lines.push('');
    }

    // 连接
    const blocks = ['identity'];
    if (social) blocks.push('social');
    blocks.push('capabilities');
    blocks.push('owner');
    if (entry) blocks.push('entry');

    for (let i = 0; i < blocks.length - 1; i++) {
      lines.push(`    ${blocks[i]} --> ${blocks[i + 1]}`);
    }

    return lines.join('\n');
  }

  /**
   * 验证 Owner（双向链接验证）
   */
  async verifyOwner(code: ACPCode): Promise<OwnerVerificationResult> {
    const owner = code.core.owner;

    // 平台验证
    if (owner.verified_by) {
      return {
        verified: true,
        method: 'platform'
      };
    }

    // 双向链接验证
    if (owner.proof?.type === 'bidirectional_link' && owner.proof.verify_at) {
      try {
        const response = await fetch(owner.proof.verify_at);
        if (!response.ok) {
          return {
            verified: false,
            error: `Failed to fetch ${owner.proof.verify_at}`
          };
        }

        const data = await response.json();
        const agents: string[] = data.agents || [];

        if (agents.includes(code.core.id)) {
          return {
            verified: true,
            method: 'bidirectional_link'
          };
        } else {
          return {
            verified: false,
            error: `Agent ${code.core.id} not found in owner's agent list`
          };
        }
      } catch (e) {
        return {
          verified: false,
          error: `Verification failed: ${(e as Error).message}`
        };
      }
    }

    return {
      verified: false,
      error: 'No verification method available'
    };
  }

  /**
   * 导出为 A2A AgentCard 格式
   */
  exportA2A(code: ACPCode): A2AAgentCard {
    const entry = code['module:entry'];
    const capabilities = code.core.capabilities;

    const skills = capabilities.map((cap, i) => {
      const name = typeof cap === 'string' ? cap : cap.name;
      return {
        id: `skill-${i}`,
        name,
        description: name,
        tags: [name]
      };
    });

    return {
      name: code.core.name,
      description: code.core.description,
      version: '1.0.0',
      url: entry?.source || '',
      protocolVersion: '0.3.0',
      capabilities: {
        streaming: false,
        pushNotifications: false
      },
      defaultInputModes: ['text'],
      defaultOutputModes: ['text'],
      skills
    };
  }

  /**
   * 从 A2A AgentCard 导入
   */
  importA2A(agentCard: A2AAgentCard): ACPCode {
    const id = `a2a:${agentCard.name.toLowerCase().replace(/\s+/g, '-')}`;

    return {
      acp: '1.0',
      core: {
        id,
        name: agentCard.name,
        description: agentCard.description,
        capabilities: agentCard.skills?.map(s => s.name) || [],
        owner: {
          name: 'Unknown',
          url: ''
        },
        sig: ''
      },
      'module:entry': {
        _access: 'public',
        source: agentCard.url
      },
      'module:a2a': {
        _access: 'public',
        enabled: true,
        agent_card_url: agentCard.url
      }
    };
  }
}

// 导出默认实例
export const sdk = new ACPSDK();
