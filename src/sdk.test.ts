/**
 * ACP SDK 测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ACPSDK, sdk } from './sdk';
import { ACPCode, ModuleSocial, ModuleFinance } from './types';

// 测试数据
const validACPCode: ACPCode = {
  acp: '1.0',
  core: {
    id: 'moltbook:test-agent',
    name: 'Test Agent',
    description: 'A test agent for unit testing',
    capabilities: ['chat', 'search', { name: 'translate', status: 'active' }],
    owner: {
      name: 'Test Owner',
      url: 'https://example.com',
      verified_by: 'moltbook'
    },
    sig: 'test-signature'
  },
  'module:social': {
    _access: 'public',
    karma: 100,
    followers: 50,
    following: 25,
    tags: ['ai', 'assistant']
  },
  'module:entry': {
    _access: 'public',
    source: 'https://api.example.com/agent',
    homepage: 'https://example.com/agent'
  }
};

const validMermaidCode = `%%{
{
  "acp": "1.0",
  "core": {
    "id": "moltbook:test-agent",
    "name": "Test Agent",
    "capabilities": ["chat"],
    "owner": { "name": "Owner", "url": "https://example.com" },
    "sig": "sig"
  }
}
}%%
graph TB
    identity["Test Agent"]`;

describe('ACPSDK', () => {
  let acpSdk: ACPSDK;

  beforeEach(() => {
    acpSdk = new ACPSDK();
  });

  describe('parse()', () => {
    it('应该正确解析有效的 Mermaid 格式', () => {
      const result = acpSdk.parse(validMermaidCode);
      expect(result.acp).toBe('1.0');
      expect(result.core.id).toBe('moltbook:test-agent');
      expect(result.core.name).toBe('Test Agent');
    });

    it('应该在无效格式时抛出错误', () => {
      expect(() => acpSdk.parse('invalid code')).toThrow('ACP_001');
    });

    it('应该在 JSON 无效时抛出错误', () => {
      const invalidJson = '%%{ invalid json }%%';
      expect(() => acpSdk.parse(invalidJson)).toThrow('ACP_001');
    });

    it('应该处理空输入', () => {
      expect(() => acpSdk.parse('')).toThrow('ACP_001');
    });

    it('应该处理多行 JSON', () => {
      const multilineCode = `%%{
{
  "acp": "1.0",
  "core": {
    "id": "test",
    "name": "Test",
    "capabilities": [],
    "owner": { "name": "O", "url": "u" },
    "sig": "s"
  }
}
}%%`;
      const result = acpSdk.parse(multilineCode);
      expect(result.core.id).toBe('test');
    });
  });

  describe('validate()', () => {
    it('应该验证完整的 ACP Code', () => {
      const result = acpSdk.validate(validACPCode);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该检测缺少 acp 版本', () => {
      const code = { ...validACPCode, acp: undefined } as any;
      const result = acpSdk.validate(code);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing acp version');
    });

    it('应该检测无效的 acp 版本格式', () => {
      const code = { ...validACPCode, acp: 'invalid' };
      const result = acpSdk.validate(code);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid acp version format');
    });

    it('应该检测缺少 core', () => {
      const code = { acp: '1.0' } as any;
      const result = acpSdk.validate(code);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing core');
    });

    it('应该检测缺少 core.id', () => {
      const code = {
        acp: '1.0',
        core: { ...validACPCode.core, id: undefined }
      } as any;
      const result = acpSdk.validate(code);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing core.id');
    });

    it('应该检测缺少 core.name', () => {
      const code = {
        acp: '1.0',
        core: { ...validACPCode.core, name: undefined }
      } as any;
      const result = acpSdk.validate(code);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing core.name');
    });

    it('应该检测缺少 core.capabilities', () => {
      const code = {
        acp: '1.0',
        core: { ...validACPCode.core, capabilities: [] }
      } as any;
      const result = acpSdk.validate(code);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing core.capabilities');
    });

    it('应该检测缺少 core.owner', () => {
      const code = {
        acp: '1.0',
        core: { ...validACPCode.core, owner: undefined }
      } as any;
      const result = acpSdk.validate(code);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing core.owner');
    });

    it('应该检测缺少 core.sig', () => {
      const code = {
        acp: '1.0',
        core: { ...validACPCode.core, sig: undefined }
      } as any;
      const result = acpSdk.validate(code);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing core.sig');
    });

    it('应该检测无效的模块 _access 值', () => {
      const code = {
        ...validACPCode,
        'module:social': { _access: 'invalid' }
      } as any;
      const result = acpSdk.validate(code);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid _access value in module:social');
    });
  });

  describe('getCore()', () => {
    it('应该返回 core 对象', () => {
      const core = acpSdk.getCore(validACPCode);
      expect(core.id).toBe('moltbook:test-agent');
      expect(core.name).toBe('Test Agent');
    });
  });

  describe('getModule()', () => {
    it('应该获取存在的模块', () => {
      const social = acpSdk.getModule<ModuleSocial>(validACPCode, 'module:social');
      expect(social).not.toBeNull();
      expect(social?.karma).toBe(100);
    });

    it('应该对不存在的模块返回 null', () => {
      const finance = acpSdk.getModule<ModuleFinance>(validACPCode, 'module:finance');
      expect(finance).toBeNull();
    });
  });

  describe('hasModule()', () => {
    it('应该检测存在的模块', () => {
      expect(acpSdk.hasModule(validACPCode, 'module:social')).toBe(true);
    });

    it('应该检测不存在的模块', () => {
      expect(acpSdk.hasModule(validACPCode, 'module:finance')).toBe(false);
    });
  });

  describe('addModule()', () => {
    it('应该添加新模块', () => {
      const financeModule: ModuleFinance = {
        _access: 'private',
        chains: ['ethereum'],
        addresses: { ethereum: '0x123' }
      };
      const newCode = acpSdk.addModule(validACPCode, 'module:finance', financeModule);
      expect(newCode['module:finance']).toEqual(financeModule);
      expect(validACPCode['module:finance']).toBeUndefined(); // 原对象不变
    });

    it('应该覆盖已有模块', () => {
      const newSocial: ModuleSocial = { karma: 200 };
      const newCode = acpSdk.addModule(validACPCode, 'module:social', newSocial);
      expect(newCode['module:social']?.karma).toBe(200);
    });
  });

  describe('removeModule()', () => {
    it('应该删除模块', () => {
      const newCode = acpSdk.removeModule(validACPCode, 'module:social');
      expect(newCode['module:social']).toBeUndefined();
      expect(validACPCode['module:social']).toBeDefined(); // 原对象不变
    });

    it('应该安全地删除不存在的模块', () => {
      const newCode = acpSdk.removeModule(validACPCode, 'module:finance');
      expect(newCode['module:finance']).toBeUndefined();
    });
  });

  describe('filterByAccess()', () => {
    const codeWithAccess: ACPCode = {
      ...validACPCode,
      'module:social': { _access: 'public', karma: 100 },
      'module:contact': { _access: 'verified', routes: [] },
      'module:finance': { _access: 'private', chains: [] }
    };

    it('应该过滤为 public 级别', () => {
      const filtered = acpSdk.filterByAccess(codeWithAccess, 'public');
      expect(filtered['module:social']).toBeDefined();
      expect(filtered['module:contact']).toBeUndefined();
      expect(filtered['module:finance']).toBeUndefined();
    });

    it('应该过滤为 verified 级别', () => {
      const filtered = acpSdk.filterByAccess(codeWithAccess, 'verified');
      expect(filtered['module:social']).toBeDefined();
      expect(filtered['module:contact']).toBeDefined();
      expect(filtered['module:finance']).toBeUndefined();
    });

    it('应该过滤为 private 级别', () => {
      const filtered = acpSdk.filterByAccess(codeWithAccess, 'private');
      expect(filtered['module:social']).toBeDefined();
      expect(filtered['module:contact']).toBeDefined();
      expect(filtered['module:finance']).toBeDefined();
    });

    it('应该保留 core', () => {
      const filtered = acpSdk.filterByAccess(codeWithAccess, 'public');
      expect(filtered.core).toBeDefined();
      expect(filtered.acp).toBe('1.0');
    });
  });

  describe('toMermaid()', () => {
    it('应该生成 Mermaid 格式', () => {
      const mermaid = acpSdk.toMermaid(validACPCode);
      expect(mermaid).toContain('%%{');
      expect(mermaid).toContain('}%%');
      expect(mermaid).toContain('graph TB');
    });

    it('应该包含 JSON 数据', () => {
      const mermaid = acpSdk.toMermaid(validACPCode);
      expect(mermaid).toContain('"acp": "1.0"');
      expect(mermaid).toContain('"id": "moltbook:test-agent"');
    });

    it('应该包含图形元素', () => {
      const mermaid = acpSdk.toMermaid(validACPCode);
      expect(mermaid).toContain('subgraph identity');
      expect(mermaid).toContain('subgraph capabilities');
      expect(mermaid).toContain('subgraph owner');
    });
  });

  describe('verifyOwner()', () => {
    it('应该验证平台认证的 owner', async () => {
      const result = await acpSdk.verifyOwner(validACPCode);
      expect(result.verified).toBe(true);
      expect(result.method).toBe('platform');
    });

    it('应该在无验证方法时返回未验证', async () => {
      const code: ACPCode = {
        ...validACPCode,
        core: {
          ...validACPCode.core,
          owner: { name: 'Test', url: 'https://example.com' }
        }
      };
      const result = await acpSdk.verifyOwner(code);
      expect(result.verified).toBe(false);
      expect(result.error).toBe('No verification method available');
    });

    it('应该处理双向链接验证成功', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ agents: ['moltbook:test-agent'] })
      });
      global.fetch = mockFetch;

      const code: ACPCode = {
        ...validACPCode,
        core: {
          ...validACPCode.core,
          owner: {
            name: 'Test',
            url: 'https://example.com',
            proof: {
              type: 'bidirectional_link',
              verify_at: 'https://example.com/.well-known/agents.json'
            }
          }
        }
      };

      const result = await acpSdk.verifyOwner(code);
      expect(result.verified).toBe(true);
      expect(result.method).toBe('bidirectional_link');
    });

    it('应该处理双向链接验证失败 - agent 不在列表中', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ agents: ['other-agent'] })
      });
      global.fetch = mockFetch;

      const code: ACPCode = {
        ...validACPCode,
        core: {
          ...validACPCode.core,
          owner: {
            name: 'Test',
            url: 'https://example.com',
            proof: {
              type: 'bidirectional_link',
              verify_at: 'https://example.com/.well-known/agents.json'
            }
          }
        }
      };

      const result = await acpSdk.verifyOwner(code);
      expect(result.verified).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('应该处理 fetch 失败', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false
      });
      global.fetch = mockFetch;

      const code: ACPCode = {
        ...validACPCode,
        core: {
          ...validACPCode.core,
          owner: {
            name: 'Test',
            url: 'https://example.com',
            proof: {
              type: 'bidirectional_link',
              verify_at: 'https://example.com/.well-known/agents.json'
            }
          }
        }
      };

      const result = await acpSdk.verifyOwner(code);
      expect(result.verified).toBe(false);
      expect(result.error).toContain('Failed to fetch');
    });
  });

  describe('exportA2A()', () => {
    it('应该导出 A2A AgentCard 格式', () => {
      const a2a = acpSdk.exportA2A(validACPCode);
      expect(a2a.name).toBe('Test Agent');
      expect(a2a.description).toBe('A test agent for unit testing');
      expect(a2a.version).toBe('1.0.0');
      expect(a2a.protocolVersion).toBe('0.3.0');
    });

    it('应该转换 capabilities 为 skills', () => {
      const a2a = acpSdk.exportA2A(validACPCode);
      expect(a2a.skills).toHaveLength(3);
      expect(a2a.skills[0].name).toBe('chat');
      expect(a2a.skills[1].name).toBe('search');
      expect(a2a.skills[2].name).toBe('translate');
    });

    it('应该包含 entry URL', () => {
      const a2a = acpSdk.exportA2A(validACPCode);
      expect(a2a.url).toBe('https://api.example.com/agent');
    });
  });

  describe('importA2A()', () => {
    const a2aCard = {
      name: 'A2A Agent',
      description: 'An A2A compatible agent',
      version: '1.0.0',
      url: 'https://a2a.example.com/agent',
      protocolVersion: '0.3.0',
      capabilities: { streaming: false, pushNotifications: false },
      defaultInputModes: ['text'],
      defaultOutputModes: ['text'],
      skills: [
        { id: 's1', name: 'skill1', description: 'Skill 1', tags: ['tag1'] },
        { id: 's2', name: 'skill2', description: 'Skill 2', tags: ['tag2'] }
      ]
    };

    it('应该从 A2A AgentCard 导入', () => {
      const code = acpSdk.importA2A(a2aCard);
      expect(code.acp).toBe('1.0');
      expect(code.core.name).toBe('A2A Agent');
      expect(code.core.description).toBe('An A2A compatible agent');
    });

    it('应该生成正确的 ID', () => {
      const code = acpSdk.importA2A(a2aCard);
      expect(code.core.id).toBe('a2a:a2a-agent');
    });

    it('应该转换 skills 为 capabilities', () => {
      const code = acpSdk.importA2A(a2aCard);
      expect(code.core.capabilities).toEqual(['skill1', 'skill2']);
    });

    it('应该创建 module:entry', () => {
      const code = acpSdk.importA2A(a2aCard);
      expect(code['module:entry']?.source).toBe('https://a2a.example.com/agent');
    });

    it('应该创建 module:a2a', () => {
      const code = acpSdk.importA2A(a2aCard);
      expect(code['module:a2a']?.enabled).toBe(true);
      expect(code['module:a2a']?.agent_card_url).toBe('https://a2a.example.com/agent');
    });
  });

  describe('默认实例', () => {
    it('应该导出默认 sdk 实例', () => {
      expect(sdk).toBeInstanceOf(ACPSDK);
    });
  });
});
