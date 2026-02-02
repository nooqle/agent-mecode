/**
 * ACP Interpreter 测试
 */

import { describe, it, expect } from 'vitest';
import {
  ACPInterpreter,
  MoltbookInterpreter,
  WalletInterpreter,
  CollaborationInterpreter
} from './interpreter';
import { ACPCode } from './types';

// 测试数据
const validACPCode: ACPCode = {
  acp: '1.0',
  core: {
    id: 'moltbook:test-agent',
    name: 'Test Agent',
    description: 'A test agent',
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
  },
  'module:a2a': {
    _access: 'public',
    enabled: true,
    agent_card_url: 'https://api.example.com/agent/a2a'
  }
};

const codeWithFinance: ACPCode = {
  ...validACPCode,
  'module:finance': {
    _access: 'private',
    chains: ['ethereum', 'solana'],
    addresses: {
      ethereum: '0x123',
      solana: 'abc123'
    },
    primary: 'ethereum',
    accept: ['ETH', 'USDC']
  }
};

describe('ACPInterpreter', () => {
  describe('构造函数', () => {
    it('应该创建无必需模块的解释器', () => {
      const interpreter = new ACPInterpreter();
      expect(interpreter).toBeInstanceOf(ACPInterpreter);
    });

    it('应该创建有必需模块的解释器', () => {
      const interpreter = new ACPInterpreter(['module:social']);
      expect(interpreter).toBeInstanceOf(ACPInterpreter);
    });
  });

  describe('validate()', () => {
    it('应该验证有效的 ACP Code', () => {
      const interpreter = new ACPInterpreter();
      const result = interpreter.validate(validACPCode);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该检测缺少必需模块', () => {
      const interpreter = new ACPInterpreter(['module:finance']);
      const result = interpreter.validate(validACPCode);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required module: module:finance');
    });

    it('应该检测多个缺少的必需模块', () => {
      const interpreter = new ACPInterpreter(['module:finance', 'module:contact']);
      const result = interpreter.validate(validACPCode);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required module: module:finance');
      expect(result.errors).toContain('Missing required module: module:contact');
    });

    it('应该在基础验证失败时返回错误', () => {
      const invalidCode = { acp: '1.0' } as any;
      const interpreter = new ACPInterpreter();
      const result = interpreter.validate(invalidCode);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing core');
    });
  });

  describe('project()', () => {
    it('应该投影为 profile 格式', () => {
      const interpreter = new ACPInterpreter();
      const profile = interpreter.project(validACPCode, 'profile');

      expect(profile.id).toBe('moltbook:test-agent');
      expect(profile.name).toBe('Test Agent');
      expect(profile.description).toBe('A test agent');
      expect(profile.capabilities).toEqual(['chat', 'search', 'translate']);
      expect(profile.karma).toBe(100);
      expect(profile.followers).toBe(50);
      expect(profile.following).toBe(25);
      expect(profile.tags).toEqual(['ai', 'assistant']);
      expect(profile.verified).toBe(true);
    });

    it('应该投影为 a2a 格式', () => {
      const interpreter = new ACPInterpreter();
      const a2a = interpreter.project(validACPCode, 'a2a');

      expect(a2a.name).toBe('Test Agent');
      expect(a2a.skills).toHaveLength(3);
    });

    it('应该投影为 json 格式（原样返回）', () => {
      const interpreter = new ACPInterpreter();
      const json = interpreter.project(validACPCode, 'json');

      expect(json).toEqual(validACPCode);
    });

    it('应该对未知格式返回原始 Code', () => {
      const interpreter = new ACPInterpreter();
      const result = interpreter.project(validACPCode, 'unknown');

      expect(result).toEqual(validACPCode);
    });

    it('应该处理没有 social 模块的 profile', () => {
      const codeWithoutSocial: ACPCode = {
        acp: '1.0',
        core: validACPCode.core
      };
      const interpreter = new ACPInterpreter();
      const profile = interpreter.project(codeWithoutSocial, 'profile');

      expect(profile.karma).toBe(0);
      expect(profile.followers).toBe(0);
      expect(profile.following).toBe(0);
      expect(profile.tags).toEqual([]);
    });
  });
});

describe('MoltbookInterpreter', () => {
  it('应该要求 module:social', () => {
    const interpreter = new MoltbookInterpreter();
    const result = interpreter.validate(validACPCode);
    expect(result.valid).toBe(true);
  });

  it('应该在缺少 module:social 时失败', () => {
    const codeWithoutSocial: ACPCode = {
      acp: '1.0',
      core: validACPCode.core
    };
    const interpreter = new MoltbookInterpreter();
    const result = interpreter.validate(codeWithoutSocial);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required module: module:social');
  });
});

describe('WalletInterpreter', () => {
  it('应该要求 module:finance', () => {
    const interpreter = new WalletInterpreter();
    const result = interpreter.validate(codeWithFinance);
    expect(result.valid).toBe(true);
  });

  it('应该在缺少 module:finance 时失败', () => {
    const interpreter = new WalletInterpreter();
    const result = interpreter.validate(validACPCode);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required module: module:finance');
  });

  describe('projectToPayment()', () => {
    it('应该投影为支付信息', () => {
      const interpreter = new WalletInterpreter();
      const payment = interpreter.projectToPayment(codeWithFinance);

      expect(payment.id).toBe('moltbook:test-agent');
      expect(payment.name).toBe('Test Agent');
      expect(payment.owner).toBe('Test Owner');
      expect(payment.chains).toEqual(['ethereum', 'solana']);
      expect(payment.addresses.ethereum).toBe('0x123');
      expect(payment.primary).toBe('ethereum');
      expect(payment.accept).toEqual(['ETH', 'USDC']);
    });

    it('应该在缺少 module:finance 时抛出错误', () => {
      const interpreter = new WalletInterpreter();
      expect(() => interpreter.projectToPayment(validACPCode)).toThrow('Missing module:finance');
    });

    it('应该处理空的 chains 和 accept', () => {
      const codeWithMinimalFinance: ACPCode = {
        ...validACPCode,
        'module:finance': {
          _access: 'private',
          addresses: { ethereum: '0x123' }
        }
      };
      const interpreter = new WalletInterpreter();
      const payment = interpreter.projectToPayment(codeWithMinimalFinance);

      expect(payment.chains).toEqual([]);
      expect(payment.accept).toEqual([]);
    });
  });
});

describe('CollaborationInterpreter', () => {
  it('应该要求 module:entry 和 module:a2a', () => {
    const interpreter = new CollaborationInterpreter();
    const result = interpreter.validate(validACPCode);
    expect(result.valid).toBe(true);
  });

  it('应该在缺少 module:entry 时失败', () => {
    const codeWithoutEntry: ACPCode = {
      acp: '1.0',
      core: validACPCode.core,
      'module:a2a': validACPCode['module:a2a']
    };
    const interpreter = new CollaborationInterpreter();
    const result = interpreter.validate(codeWithoutEntry);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required module: module:entry');
  });

  it('应该在缺少 module:a2a 时失败', () => {
    const codeWithoutA2A: ACPCode = {
      acp: '1.0',
      core: validACPCode.core,
      'module:entry': validACPCode['module:entry']
    };
    const interpreter = new CollaborationInterpreter();
    const result = interpreter.validate(codeWithoutA2A);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required module: module:a2a');
  });
});
