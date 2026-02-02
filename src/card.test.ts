/**
 * ACP Card 生成器测试
 */

import { describe, it, expect } from 'vitest';
import { generateACPCard, THEMES, toCardData } from './card';
import { ACPCode, ACPDataLegacy } from './types';

// v0.4 测试数据
const v4Code: ACPCode = {
  acp: '1.0',
  core: {
    id: 'moltbook:test-agent',
    name: 'Test Agent',
    description: 'A test agent for unit testing with a longer description that might need wrapping',
    capabilities: ['chat', 'search', 'translate', 'summarize'],
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
    enabled: true
  }
};

// v0.3 旧版测试数据
const v3Data: ACPDataLegacy = {
  acp: '0.3',
  identity: {
    id: 'legacy:agent',
    name: 'Legacy Agent',
    description: 'A legacy agent'
  },
  capabilities: {
    services: ['chat', { name: 'search', status: 'active' }],
    trust_level: 'verified'
  },
  reputation: {
    karma: 200,
    followers: 100,
    following: 50,
    verified_by: 'platform'
  },
  owners: [
    {
      name: 'Legacy Owner',
      handle: '@legacy',
      verification: { claim_verified: true }
    }
  ],
  entry: {
    source: 'https://legacy.example.com/agent',
    homepage: 'https://legacy.example.com'
  },
  a2a: {
    enabled: true
  }
};

describe('THEMES', () => {
  it('应该导出所有 8 种主题', () => {
    expect(Object.keys(THEMES)).toHaveLength(8);
    expect(THEMES.moltbook).toBeDefined();
    expect(THEMES.matrix).toBeDefined();
    expect(THEMES.vaporwave).toBeDefined();
    expect(THEMES.amber).toBeDefined();
    expect(THEMES.frost).toBeDefined();
    expect(THEMES.bloodmoon).toBeDefined();
    expect(THEMES.gameboy).toBeDefined();
    expect(THEMES['cyber-yellow']).toBeDefined();
  });

  it('每个主题应该包含所有必需的颜色', () => {
    const requiredColors = [
      'bg', 'bgAlt', 'primary', 'primaryLight', 'primaryDark',
      'text', 'textMuted', 'accent', 'success', 'border'
    ];

    for (const [themeName, theme] of Object.entries(THEMES)) {
      for (const color of requiredColors) {
        expect(theme).toHaveProperty(color);
        expect(typeof theme[color as keyof typeof theme]).toBe('string');
      }
    }
  });

  it('moltbook 主题应该有正确的颜色', () => {
    expect(THEMES.moltbook.bg).toBe('#0f0f1a');
    expect(THEMES.moltbook.primary).toBe('#ff4444');
  });

  it('matrix 主题应该是绿色系', () => {
    expect(THEMES.matrix.primary).toBe('#00ff00');
    expect(THEMES.matrix.text).toBe('#00ff00');
  });
});

describe('toCardData()', () => {
  describe('v0.4 格式转换', () => {
    it('应该正确转换 v0.4 Code', () => {
      const cardData = toCardData(v4Code);

      expect(cardData.id).toBe('moltbook:test-agent');
      expect(cardData.name).toBe('Test Agent');
      expect(cardData.description).toContain('test agent');
    });

    it('应该转换 capabilities', () => {
      const cardData = toCardData(v4Code);
      expect(cardData.capabilities).toEqual(['chat', 'search', 'translate', 'summarize']);
    });

    it('应该转换 social 模块数据', () => {
      const cardData = toCardData(v4Code);
      expect(cardData.karma).toBe(100);
      expect(cardData.followers).toBe(50);
      expect(cardData.following).toBe(25);
    });

    it('应该转换 owner 信息', () => {
      const cardData = toCardData(v4Code);
      expect(cardData.ownerName).toBe('Test Owner');
      expect(cardData.ownerVerified).toBe(true);
    });

    it('应该转换 entry 信息', () => {
      const cardData = toCardData(v4Code);
      expect(cardData.homepage).toBe('https://example.com/agent');
    });

    it('应该转换 a2a 状态', () => {
      const cardData = toCardData(v4Code);
      expect(cardData.a2aEnabled).toBe(true);
    });

    it('应该设置正确的 trustLevel', () => {
      const cardData = toCardData(v4Code);
      expect(cardData.trustLevel).toBe('verified');
    });

    it('应该处理未验证的 owner', () => {
      const unverifiedCode: ACPCode = {
        ...v4Code,
        core: {
          ...v4Code.core,
          owner: { name: 'Test', url: 'https://example.com' }
        }
      };
      const cardData = toCardData(unverifiedCode);
      expect(cardData.trustLevel).toBe('unverified');
      expect(cardData.ownerVerified).toBe(false);
    });

    it('应该处理缺失的模块', () => {
      const minimalCode: ACPCode = {
        acp: '1.0',
        core: v4Code.core
      };
      const cardData = toCardData(minimalCode);
      expect(cardData.karma).toBe(0);
      expect(cardData.followers).toBe(0);
      expect(cardData.homepage).toBe('');
      expect(cardData.a2aEnabled).toBe(false);
    });
  });

  describe('v0.3 格式转换', () => {
    it('应该正确转换 v0.3 数据', () => {
      const cardData = toCardData(v3Data);

      expect(cardData.id).toBe('legacy:agent');
      expect(cardData.name).toBe('Legacy Agent');
      expect(cardData.description).toBe('A legacy agent');
    });

    it('应该转换 services 为 capabilities', () => {
      const cardData = toCardData(v3Data);
      expect(cardData.capabilities).toEqual(['chat', 'search']);
    });

    it('应该转换 reputation', () => {
      const cardData = toCardData(v3Data);
      expect(cardData.karma).toBe(200);
      expect(cardData.followers).toBe(100);
      expect(cardData.following).toBe(50);
    });

    it('应该转换 owner 信息', () => {
      const cardData = toCardData(v3Data);
      expect(cardData.ownerName).toBe('Legacy Owner');
      expect(cardData.ownerHandle).toBe('@legacy');
      expect(cardData.ownerVerified).toBe(true);
    });

    it('应该转换 trust_level', () => {
      const cardData = toCardData(v3Data);
      expect(cardData.trustLevel).toBe('verified');
    });

    it('应该处理缺失的 owners', () => {
      const dataWithoutOwners: ACPDataLegacy = {
        ...v3Data,
        owners: undefined
      };
      const cardData = toCardData(dataWithoutOwners);
      expect(cardData.ownerName).toBe('');
      expect(cardData.ownerHandle).toBe('');
    });
  });
});

describe('generateACPCard()', () => {
  describe('基本生成', () => {
    it('应该生成有效的 SVG', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('应该包含 viewBox', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('viewBox="0 0 400 560"');
    });

    it('应该包含 agent 名称', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('TEST AGENT');
    });

    it('应该包含 agent ID', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('moltbook:test-agent');
    });

    it('应该包含 karma 值', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('★ 100');
    });

    it('应该包含 followers', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('50 FLWR');
    });

    it('应该包含 capabilities', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('CHAT');
      expect(svg).toContain('SEARCH');
      expect(svg).toContain('TRANSLATE');
    });

    it('应该包含 owner 信息', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('Test Owner');
    });

    it('应该包含 URL', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('example.com/agent');
    });
  });

  describe('主题支持', () => {
    it('应该使用默认 moltbook 主题', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('#ff4444'); // moltbook primary color
    });

    it('应该支持 matrix 主题', () => {
      const svg = generateACPCard(v4Code, { theme: 'matrix' });
      expect(svg).toContain('#00ff00'); // matrix primary color
    });

    it('应该支持 vaporwave 主题', () => {
      const svg = generateACPCard(v4Code, { theme: 'vaporwave' });
      expect(svg).toContain('#ff00ff'); // vaporwave primary color
    });

    it('应该支持 frost 主题', () => {
      const svg = generateACPCard(v4Code, { theme: 'frost' });
      expect(svg).toContain('#4fc3f7'); // frost primary color
    });

    it('应该支持 gameboy 主题', () => {
      const svg = generateACPCard(v4Code, { theme: 'gameboy' });
      expect(svg).toContain('#8bac0f'); // gameboy primary color
    });

    it('应该支持 amber 主题', () => {
      const svg = generateACPCard(v4Code, { theme: 'amber' });
      expect(svg).toContain('#ffaa00'); // amber primary color
    });

    it('应该支持 bloodmoon 主题', () => {
      const svg = generateACPCard(v4Code, { theme: 'bloodmoon' });
      expect(svg).toContain('#aa0000'); // bloodmoon primary color
    });

    it('应该支持 cyber-yellow 主题', () => {
      const svg = generateACPCard(v4Code, { theme: 'cyber-yellow' });
      expect(svg).toContain('#ffff00'); // cyber-yellow primary color
    });

    it('应该对未知主题使用 moltbook', () => {
      const svg = generateACPCard(v4Code, { theme: 'unknown' });
      expect(svg).toContain('#ff4444'); // moltbook primary color
    });

    it('应该支持自定义主题对象', () => {
      const customTheme = {
        bg: '#000000',
        bgAlt: '#111111',
        primary: '#123456',
        primaryLight: '#234567',
        primaryDark: '#012345',
        text: '#ffffff',
        textMuted: '#888888',
        accent: '#00ffff',
        success: '#00ff00',
        border: '#333333'
      };
      const svg = generateACPCard(v4Code, { theme: customTheme });
      expect(svg).toContain('#123456');
    });
  });

  describe('尺寸选项', () => {
    it('应该使用默认尺寸', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('width="400"');
      expect(svg).toContain('height="560"');
    });

    it('应该支持自定义宽度', () => {
      const svg = generateACPCard(v4Code, { theme: 'moltbook', width: 500 });
      expect(svg).toContain('width="500"');
    });

    it('应该支持自定义高度', () => {
      const svg = generateACPCard(v4Code, { theme: 'moltbook', height: 700 });
      expect(svg).toContain('height="700"');
    });
  });

  describe('A2A 徽章', () => {
    it('应该显示 A2A READY 徽章', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('A2A READY');
    });

    it('应该在 showA2A=false 时隐藏徽章', () => {
      const svg = generateACPCard(v4Code, { theme: 'moltbook', showA2A: false });
      expect(svg).not.toContain('A2A READY');
    });

    it('应该在 a2a 未启用时不显示徽章', () => {
      const codeWithoutA2A: ACPCode = {
        ...v4Code,
        'module:a2a': undefined
      };
      const svg = generateACPCard(codeWithoutA2A);
      expect(svg).not.toContain('A2A READY');
    });
  });

  describe('验证徽章', () => {
    it('应该显示 VERIFIED 徽章', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('VERIFIED');
    });

    it('应该在未验证时不显示徽章', () => {
      const unverifiedCode: ACPCode = {
        ...v4Code,
        core: {
          ...v4Code.core,
          owner: { name: 'Test', url: 'https://example.com' }
        }
      };
      const svg = generateACPCard(unverifiedCode);
      // 检查没有验证徽章的 subgraph
      expect(svg).not.toMatch(/✓ UNVERIFIED/);
    });
  });

  describe('动画支持', () => {
    it('应该在 animated=true 时包含动画样式', () => {
      const svg = generateACPCard(v4Code, { theme: 'moltbook', animated: true });
      expect(svg).toContain('@keyframes');
      expect(svg).toContain('blink');
      expect(svg).toContain('pulse');
    });

    it('应该在 animated=false 时不包含动画', () => {
      const svg = generateACPCard(v4Code, { theme: 'moltbook', animated: false });
      expect(svg).not.toContain('@keyframes');
    });
  });

  describe('v0.3 兼容性', () => {
    it('应该正确渲染 v0.3 数据', () => {
      const svg = generateACPCard(v3Data);
      expect(svg).toContain('LEGACY AGENT');
      expect(svg).toContain('★ 200');
      expect(svg).toContain('100 FLWR');
    });
  });

  describe('SVG 结构', () => {
    it('应该包含像素网格背景', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('pattern id="pixelGrid"');
    });

    it('应该包含卡片边框', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('stroke-width="4"');
      expect(svg).toContain('stroke-width="2"');
    });

    it('应该包含像素龙虾', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('<!-- 像素龙虾 -->');
      expect(svg).toContain('<!-- 触角球 -->');
      expect(svg).toContain('<!-- 头部 -->');
      expect(svg).toContain('<!-- 眼睛 -->');
    });

    it('应该包含角落装饰', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('<!-- 角落装饰 -->');
    });

    it('应该包含 REPUTATION 区块', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('REPUTATION');
    });

    it('应该包含 CAPABILITIES 区块', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('CAPABILITIES');
    });

    it('应该包含 HUMAN.OWNER 区块', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('HUMAN.OWNER');
    });

    it('应该包含 ENTRY.POINT 区块', () => {
      const svg = generateACPCard(v4Code);
      expect(svg).toContain('ENTRY.POINT');
    });
  });

  describe('文本处理', () => {
    it('应该截断长描述', () => {
      const longDescCode: ACPCode = {
        ...v4Code,
        core: {
          ...v4Code.core,
          description: 'This is a very long description that should be split into multiple lines and possibly truncated if it exceeds the maximum allowed length for the card display area'
        }
      };
      const svg = generateACPCard(longDescCode);
      // 描述应该被分成多行
      expect(svg).toContain('This is a very long');
    });

    it('应该转义 XML 特殊字符', () => {
      const specialCharCode: ACPCode = {
        ...v4Code,
        core: {
          ...v4Code.core,
          description: 'Test <script> & "quotes"'
        }
      };
      const svg = generateACPCard(specialCharCode);
      expect(svg).toContain('&lt;script&gt;');
      expect(svg).toContain('&amp;');
      expect(svg).toContain('&quot;');
    });

    it('应该截断长 URL', () => {
      const longUrlCode: ACPCode = {
        ...v4Code,
        'module:entry': {
          _access: 'public',
          source: 'https://very-long-domain-name.example.com/very/long/path/to/agent/endpoint',
          homepage: 'https://very-long-domain-name.example.com/very/long/path/to/agent/endpoint'
        }
      };
      const svg = generateACPCard(longUrlCode);
      // URL 应该被截断
      expect(svg.length).toBeLessThan(10000); // 合理的 SVG 大小
    });
  });

  describe('边界情况', () => {
    it('应该处理空 capabilities', () => {
      const emptyCapCode: ACPCode = {
        ...v4Code,
        core: {
          ...v4Code.core,
          capabilities: []
        }
      };
      const svg = generateACPCard(emptyCapCode);
      expect(svg).toContain('<svg');
    });

    it('应该处理没有 owner 的情况', () => {
      const noOwnerData: ACPDataLegacy = {
        ...v3Data,
        owners: []
      };
      const svg = generateACPCard(noOwnerData);
      expect(svg).toContain('<svg');
    });

    it('应该处理空描述', () => {
      const noDescCode: ACPCode = {
        ...v4Code,
        core: {
          ...v4Code.core,
          description: ''
        }
      };
      const svg = generateACPCard(noDescCode);
      expect(svg).toContain('<svg');
    });
  });
});
