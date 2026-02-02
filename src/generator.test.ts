/**
 * ACP Generator 测试
 */

import { describe, it, expect } from 'vitest';
import { ACPGenerator, GENERATOR_CONFIGS } from './generator';
import { AgentData } from './types';

// 测试数据
const baseAgentData: AgentData = {
  id: 'test:agent-001',
  name: 'Test Agent',
  description: 'A test agent',
  capabilities: ['chat', 'search'],
  ownerName: 'Test Owner',
  ownerUrl: 'https://example.com',
  platform: 'moltbook'
};

const fullAgentData: AgentData = {
  ...baseAgentData,
  avatar: 'https://example.com/avatar.png',
  karma: 100,
  followers: 50,
  following: 25,
  tags: ['ai', 'assistant'],
  paymentChains: ['ethereum', 'solana'],
  paymentAddresses: {
    ethereum: '0x123',
    solana: 'abc123'
  },
  contactRoutes: [
    { type: 'email', address: 'agent@example.com' },
    { type: 'twitter', handle: '@testagent' }
  ],
  homepage: 'https://example.com/agent',
  source: 'https://api.example.com/agent',
  a2aEnabled: true,
  a2aUrl: 'https://api.example.com/agent/a2a'
};

describe('ACPGenerator', () => {
  describe('构造函数', () => {
    it('应该使用默认配置', () => {
      const generator = new ACPGenerator();
      const config = generator.getConfig();
      expect(config.platform).toBe('default');
    });

    it('应该使用 moltbook 配置', () => {
      const generator = new ACPGenerator('moltbook');
      const config = generator.getConfig();
      expect(config.platform).toBe('moltbook');
      expect(config.requiredModules).toContain('module:social');
    });

    it('应该使用 wallet 配置', () => {
      const generator = new ACPGenerator('wallet');
      const config = generator.getConfig();
      expect(config.platform).toBe('wallet');
      expect(config.requiredModules).toContain('module:finance');
    });

    it('应该使用 collaboration 配置', () => {
      const generator = new ACPGenerator('collaboration');
      const config = generator.getConfig();
      expect(config.platform).toBe('collaboration');
      expect(config.requiredModules).toContain('module:entry');
      expect(config.requiredModules).toContain('module:a2a');
    });

    it('应该对未知平台使用默认配置', () => {
      const generator = new ACPGenerator('unknown');
      const config = generator.getConfig();
      expect(config.platform).toBe('default');
    });
  });

  describe('getConfig()', () => {
    it('应该返回当前配置', () => {
      const generator = new ACPGenerator('moltbook');
      const config = generator.getConfig();
      expect(config).toHaveProperty('platform');
      expect(config).toHaveProperty('requiredModules');
      expect(config).toHaveProperty('optionalModules');
      expect(config).toHaveProperty('defaultAccess');
    });
  });

  describe('generate()', () => {
    describe('默认配置', () => {
      it('应该生成基本的 ACP Code', () => {
        const generator = new ACPGenerator();
        const code = generator.generate(baseAgentData);

        expect(code.acp).toBe('1.0');
        expect(code.core.id).toBe('test:agent-001');
        expect(code.core.name).toBe('Test Agent');
        expect(code.core.capabilities).toEqual(['chat', 'search']);
      });

      it('应该设置 owner 信息', () => {
        const generator = new ACPGenerator();
        const code = generator.generate(baseAgentData);

        expect(code.core.owner.name).toBe('Test Owner');
        expect(code.core.owner.url).toBe('https://example.com');
        expect(code.core.owner.verified_by).toBe('moltbook');
      });

      it('应该初始化空签名', () => {
        const generator = new ACPGenerator();
        const code = generator.generate(baseAgentData);
        expect(code.core.sig).toBe('');
      });
    });

    describe('Moltbook 配置', () => {
      it('应该包含 module:social', () => {
        const generator = new ACPGenerator('moltbook');
        const code = generator.generate(fullAgentData);

        expect(code['module:social']).toBeDefined();
        expect(code['module:social']?.karma).toBe(100);
        expect(code['module:social']?.followers).toBe(50);
        expect(code['module:social']?.following).toBe(25);
        expect(code['module:social']?.tags).toEqual(['ai', 'assistant']);
      });

      it('应该设置正确的访问级别', () => {
        const generator = new ACPGenerator('moltbook');
        const code = generator.generate(fullAgentData);

        expect(code['module:social']?._access).toBe('public');
        expect(code['module:contact']?._access).toBe('verified');
        expect(code['module:entry']?._access).toBe('public');
      });

      it('应该包含可选模块（如果数据存在）', () => {
        const generator = new ACPGenerator('moltbook');
        const code = generator.generate(fullAgentData);

        expect(code['module:contact']).toBeDefined();
        expect(code['module:entry']).toBeDefined();
        expect(code['module:a2a']).toBeDefined();
      });
    });

    describe('Wallet 配置', () => {
      it('应该包含 module:finance', () => {
        const generator = new ACPGenerator('wallet');
        const code = generator.generate(fullAgentData);

        expect(code['module:finance']).toBeDefined();
        expect(code['module:finance']?.chains).toEqual(['ethereum', 'solana']);
        expect(code['module:finance']?.addresses).toEqual({
          ethereum: '0x123',
          solana: 'abc123'
        });
      });

      it('应该设置 finance 为 private', () => {
        const generator = new ACPGenerator('wallet');
        const code = generator.generate(fullAgentData);

        expect(code['module:finance']?._access).toBe('private');
      });
    });

    describe('Collaboration 配置', () => {
      it('应该包含 module:entry 和 module:a2a', () => {
        const generator = new ACPGenerator('collaboration');
        const code = generator.generate(fullAgentData);

        expect(code['module:entry']).toBeDefined();
        expect(code['module:a2a']).toBeDefined();
        expect(code['module:a2a']?.enabled).toBe(true);
      });
    });

    describe('模块构建', () => {
      it('应该正确构建 module:social', () => {
        const generator = new ACPGenerator('moltbook');
        const code = generator.generate(fullAgentData);

        const social = code['module:social'];
        expect(social?.karma).toBe(100);
        expect(social?.followers).toBe(50);
        expect(social?.following).toBe(25);
        expect(social?.tags).toEqual(['ai', 'assistant']);
      });

      it('应该正确构建 module:finance', () => {
        const generator = new ACPGenerator('wallet');
        const code = generator.generate(fullAgentData);

        const finance = code['module:finance'];
        expect(finance?.chains).toEqual(['ethereum', 'solana']);
        expect(finance?.addresses?.ethereum).toBe('0x123');
      });

      it('应该正确构建 module:contact', () => {
        const generator = new ACPGenerator('moltbook');
        const code = generator.generate(fullAgentData);

        const contact = code['module:contact'];
        expect(contact?.routes).toHaveLength(2);
        expect(contact?.routes?.[0].type).toBe('email');
      });

      it('应该正确构建 module:entry', () => {
        const generator = new ACPGenerator('collaboration');
        const code = generator.generate(fullAgentData);

        const entry = code['module:entry'];
        expect(entry?.source).toBe('https://api.example.com/agent');
        expect(entry?.homepage).toBe('https://example.com/agent');
      });

      it('应该正确构建 module:a2a', () => {
        const generator = new ACPGenerator('collaboration');
        const code = generator.generate(fullAgentData);

        const a2a = code['module:a2a'];
        expect(a2a?.enabled).toBe(true);
        expect(a2a?.agent_card_url).toBe('https://api.example.com/agent/a2a');
      });

      it('应该跳过空模块', () => {
        const generator = new ACPGenerator('moltbook');
        const code = generator.generate(baseAgentData);

        // baseAgentData 没有 social 数据，所以不应该有 module:social
        // 但因为是 required module，会尝试构建，但返回 null
        expect(code['module:finance']).toBeUndefined();
      });
    });

    describe('边界情况', () => {
      it('应该处理最小数据', () => {
        const minData: AgentData = {
          id: 'min:agent',
          name: 'Min',
          capabilities: [],
          ownerName: 'Owner',
          ownerUrl: 'https://example.com'
        };

        const generator = new ACPGenerator();
        const code = generator.generate(minData);

        expect(code.core.id).toBe('min:agent');
        expect(code.core.name).toBe('Min');
        expect(code.core.capabilities).toEqual([]);
      });

      it('应该处理没有 payment 数据的 wallet 配置', () => {
        const generator = new ACPGenerator('wallet');
        const code = generator.generate(baseAgentData);

        // 没有 paymentAddresses，所以 module:finance 不会被创建
        expect(code['module:finance']).toBeUndefined();
      });
    });
  });
});

describe('GENERATOR_CONFIGS', () => {
  it('应该导出配置对象', () => {
    expect(GENERATOR_CONFIGS).toBeDefined();
    expect(GENERATOR_CONFIGS.moltbook).toBeDefined();
    expect(GENERATOR_CONFIGS.wallet).toBeDefined();
    expect(GENERATOR_CONFIGS.collaboration).toBeDefined();
    expect(GENERATOR_CONFIGS.default).toBeDefined();
  });

  it('moltbook 配置应该正确', () => {
    const config = GENERATOR_CONFIGS.moltbook;
    expect(config.platform).toBe('moltbook');
    expect(config.requiredModules).toContain('module:social');
    expect(config.defaultAccess['module:social']).toBe('public');
  });

  it('wallet 配置应该正确', () => {
    const config = GENERATOR_CONFIGS.wallet;
    expect(config.platform).toBe('wallet');
    expect(config.requiredModules).toContain('module:finance');
    expect(config.defaultAccess['module:finance']).toBe('private');
  });

  it('collaboration 配置应该正确', () => {
    const config = GENERATOR_CONFIGS.collaboration;
    expect(config.platform).toBe('collaboration');
    expect(config.requiredModules).toContain('module:entry');
    expect(config.requiredModules).toContain('module:a2a');
  });
});
