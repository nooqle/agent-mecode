/**
 * ACP Card Template System v0.4
 * 像素风 Agent 身份卡生成器
 * 支持模块化 ACP Code 结构
 */

// ==================== 类型定义（v0.4 模块化结构） ====================

/** v0.4 模块化 ACP Code 结构 */
interface ACPCodeV4 {
  acp: string;
  core: {
    id: string;
    name: string;
    description?: string;
    avatar?: string;
    capabilities: (string | { name: string; status?: string })[];
    owner: {
      name: string;
      url: string;
      verified_by?: string;
      proof?: {
        type: string;
        verify_at: string;
      };
    };
    sig: string;
  };
  'module:social'?: {
    _access?: 'public' | 'verified' | 'private';
    karma?: number;
    followers?: number;
    following?: number;
    tags?: string[];
    verified_by?: string;
  };
  'module:finance'?: {
    _access?: 'public' | 'verified' | 'private';
    chains?: string[];
    addresses?: Record<string, string>;
    primary?: string;
    accept?: string[];
  };
  'module:contact'?: {
    _access?: 'public' | 'verified' | 'private';
    routes?: Array<{
      type: string;
      handle?: string;
      address?: string;
      url?: string;
    }>;
  };
  'module:entry'?: {
    _access?: 'public' | 'verified' | 'private';
    source: string;
    source_backup?: string;
    homepage?: string;
    skill_file?: string;
  };
  'module:a2a'?: {
    _access?: 'public' | 'verified' | 'private';
    enabled?: boolean;
    agent_card_url?: string;
  };
  [key: `module:${string}`]: any;
}

/** v0.3 旧版 ACP 数据结构（向后兼容） */
interface ACPDataLegacy {
  acp: string;
  identity: {
    id: string;
    name: string;
    display_name?: string;
    description?: string;
    avatar?: string;
  };
  capabilities: {
    services: (string | { name: string; status: string })[];
    trust_level?: 'unverified' | 'verified' | 'trusted';
  };
  reputation?: {
    karma?: number;
    followers?: number;
    following?: number;
    verified_by?: string;
  };
  owners?: Array<{
    name: string;
    handle?: string;
    role?: string;
    verification?: {
      claim_verified?: boolean;
    };
  }>;
  entry: {
    source: string;
    homepage?: string;
  };
  a2a?: {
    enabled?: boolean;
  };
}

/** 统一的卡片数据结构（内部使用） */
interface CardData {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  trustLevel: 'unverified' | 'verified' | 'trusted';
  karma: number;
  followers: number;
  following: number;
  ownerName: string;
  ownerHandle: string;
  ownerVerified: boolean;
  homepage: string;
  a2aEnabled: boolean;
}

interface ThemeColors {
  bg: string;
  bgAlt: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  text: string;
  textMuted: string;
  accent: string;
  success: string;
  border: string;
}

interface CardOptions {
  theme: keyof typeof THEMES | ThemeColors;
  width?: number;
  height?: number;
  showA2A?: boolean;
  animated?: boolean;
}

// ==================== 主题定义 ====================

const THEMES = {
  'moltbook': {
    bg: '#0f0f1a',
    bgAlt: '#1a1a2e',
    primary: '#ff4444',
    primaryLight: '#ff6666',
    primaryDark: '#cc3333',
    text: '#ffffff',
    textMuted: '#888888',
    accent: '#4fc3f7',
    success: '#00ff00',
    border: '#333355'
  },
  'matrix': {
    bg: '#0a0a0a',
    bgAlt: '#0f1a0f',
    primary: '#00ff00',
    primaryLight: '#44ff44',
    primaryDark: '#00aa00',
    text: '#00ff00',
    textMuted: '#006600',
    accent: '#88ff88',
    success: '#00ff00',
    border: '#003300'
  },
  'vaporwave': {
    bg: '#0f0a1a',
    bgAlt: '#1a1030',
    primary: '#ff00ff',
    primaryLight: '#ff66ff',
    primaryDark: '#aa00aa',
    text: '#ffffff',
    textMuted: '#888899',
    accent: '#00ffff',
    success: '#00ff88',
    border: '#442266'
  },
  'amber': {
    bg: '#0a0800',
    bgAlt: '#1a1500',
    primary: '#ffaa00',
    primaryLight: '#ffcc44',
    primaryDark: '#aa7700',
    text: '#ffcc00',
    textMuted: '#886600',
    accent: '#ffdd66',
    success: '#ffaa00',
    border: '#443300'
  },
  'frost': {
    bg: '#0a0f1a',
    bgAlt: '#101828',
    primary: '#4fc3f7',
    primaryLight: '#80d8ff',
    primaryDark: '#0097a7',
    text: '#e0f7fa',
    textMuted: '#607d8b',
    accent: '#00e5ff',
    success: '#00e676',
    border: '#1e3a5f'
  },
  'bloodmoon': {
    bg: '#0a0000',
    bgAlt: '#1a0505',
    primary: '#aa0000',
    primaryLight: '#ff2222',
    primaryDark: '#660000',
    text: '#ffcccc',
    textMuted: '#664444',
    accent: '#ff4444',
    success: '#ff0000',
    border: '#330000'
  },
  'gameboy': {
    bg: '#0f380f',
    bgAlt: '#306230',
    primary: '#8bac0f',
    primaryLight: '#9bbc0f',
    primaryDark: '#0f380f',
    text: '#9bbc0f',
    textMuted: '#306230',
    accent: '#8bac0f',
    success: '#9bbc0f',
    border: '#0f380f'
  },
  'cyber-yellow': {
    bg: '#0a0a00',
    bgAlt: '#1a1a0f',
    primary: '#ffff00',
    primaryLight: '#ffff66',
    primaryDark: '#aaaa00',
    text: '#ffffff',
    textMuted: '#888866',
    accent: '#00ffff',
    success: '#00ff00',
    border: '#444400'
  }
} as const;

// ==================== 数据转换函数 ====================

/** 检测是否为 v0.4 模块化结构 */
function isV4Code(data: any): data is ACPCodeV4 {
  return 'core' in data && typeof data.core === 'object';
}

/** 将 v0.4 模块化结构转换为卡片数据 */
function convertV4ToCardData(code: ACPCodeV4): CardData {
  const social = code['module:social'];
  const entry = code['module:entry'];
  const a2a = code['module:a2a'];

  return {
    id: code.core.id,
    name: code.core.name,
    description: code.core.description || '',
    capabilities: code.core.capabilities.map(c =>
      typeof c === 'string' ? c : c.name
    ),
    trustLevel: code.core.owner.verified_by ? 'verified' : 'unverified',
    karma: social?.karma || 0,
    followers: social?.followers || 0,
    following: social?.following || 0,
    ownerName: code.core.owner.name,
    ownerHandle: '', // v0.4 简化了 owner，没有 handle
    ownerVerified: !!code.core.owner.verified_by,
    homepage: entry?.homepage || entry?.source || '',
    a2aEnabled: a2a?.enabled || false
  };
}

/** 将 v0.3 旧版结构转换为卡片数据 */
function convertLegacyToCardData(data: ACPDataLegacy): CardData {
  const owner = data.owners?.[0];

  return {
    id: data.identity.id,
    name: data.identity.name,
    description: data.identity.description || '',
    capabilities: data.capabilities.services.map(s =>
      typeof s === 'string' ? s : s.name
    ),
    trustLevel: data.capabilities.trust_level || 'unverified',
    karma: data.reputation?.karma || 0,
    followers: data.reputation?.followers || 0,
    following: data.reputation?.following || 0,
    ownerName: owner?.name || '',
    ownerHandle: owner?.handle || '',
    ownerVerified: owner?.verification?.claim_verified || false,
    homepage: data.entry.homepage || data.entry.source,
    a2aEnabled: data.a2a?.enabled || false
  };
}

/** 统一转换函数 */
function toCardData(data: ACPCodeV4 | ACPDataLegacy): CardData {
  if (isV4Code(data)) {
    return convertV4ToCardData(data);
  }
  return convertLegacyToCardData(data);
}

// ==================== 像素龙虾生成器 ====================

function generatePixelLobster(theme: ThemeColors, centerX: number, centerY: number): string {
  const p = theme.primary;
  const pl = theme.primaryLight;
  const pd = theme.primaryDark;
  const bg = theme.bg;
  const success = theme.success;

  return `
  <g transform="translate(${centerX}, ${centerY})">
    <!-- 触角球 -->
    <rect x="-42" y="-66" width="12" height="12" fill="${pl}"/>
    <rect x="30" y="-66" width="12" height="12" fill="${pl}"/>

    <!-- 触角线 -->
    <rect x="-36" y="-54" width="6" height="6" fill="${p}"/>
    <rect x="-30" y="-48" width="6" height="6" fill="${p}"/>
    <rect x="-24" y="-42" width="6" height="6" fill="${p}"/>
    <rect x="30" y="-54" width="6" height="6" fill="${p}"/>
    <rect x="24" y="-48" width="6" height="6" fill="${p}"/>
    <rect x="18" y="-42" width="6" height="6" fill="${p}"/>

    <!-- 头部 -->
    <rect x="-30" y="-36" width="60" height="6" fill="${p}"/>
    <rect x="-36" y="-30" width="72" height="6" fill="${p}"/>
    <rect x="-42" y="-24" width="84" height="6" fill="${p}"/>
    <rect x="-42" y="-18" width="84" height="6" fill="${p}"/>
    <rect x="-42" y="-12" width="84" height="6" fill="${p}"/>
    <rect x="-42" y="-6" width="84" height="6" fill="${p}"/>
    <rect x="-42" y="0" width="84" height="6" fill="${p}"/>
    <rect x="-36" y="6" width="72" height="6" fill="${p}"/>
    <rect x="-30" y="12" width="60" height="6" fill="${p}"/>
    <rect x="-24" y="18" width="48" height="6" fill="${p}"/>

    <!-- 眼睛 -->
    <rect x="-30" y="-18" width="12" height="12" fill="${bg}"/>
    <rect x="18" y="-18" width="12" height="12" fill="${bg}"/>
    <rect x="-27" y="-15" width="6" height="6" fill="${pl}"/>
    <rect x="21" y="-15" width="6" height="6" fill="${pl}"/>

    <!-- 嘴巴 -->
    <rect x="-12" y="6" width="24" height="6" fill="${pd}"/>

    <!-- 钳子 - 左 -->
    <rect x="-60" y="-6" width="12" height="18" fill="${p}"/>
    <rect x="-72" y="-12" width="18" height="12" fill="${p}"/>
    <rect x="-72" y="6" width="18" height="12" fill="${p}"/>
    <rect x="-78" y="-6" width="6" height="6" fill="${p}"/>
    <rect x="-78" y="6" width="6" height="6" fill="${p}"/>

    <!-- 钳子 - 右 -->
    <rect x="48" y="-6" width="12" height="18" fill="${p}"/>
    <rect x="54" y="-12" width="18" height="12" fill="${p}"/>
    <rect x="54" y="6" width="18" height="12" fill="${p}"/>
    <rect x="72" y="-6" width="6" height="6" fill="${p}"/>
    <rect x="72" y="6" width="6" height="6" fill="${p}"/>

    <!-- 在线状态 -->
    <rect x="48" y="-42" width="12" height="12" fill="${success}"/>
    <rect x="51" y="-39" width="6" height="6" fill="${success}88"/>
  </g>`;
}

// ==================== 主生成函数 ====================

/**
 * 生成 ACP 身份卡 SVG
 * 支持 v0.4 模块化结构和 v0.3 旧版结构
 */
export function generateACPCard(
  data: ACPCodeV4 | ACPDataLegacy,
  options: CardOptions = { theme: 'moltbook' }
): string {
  // 解析主题
  const theme: ThemeColors = typeof options.theme === 'string'
    ? THEMES[options.theme]
    : options.theme;

  const width = options.width || 400;
  const height = options.height || 560;

  // 转换为统一的卡片数据
  const card = toCardData(data);

  // 简化 URL
  const displayUrl = card.homepage
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '');

  // 截断描述
  const descLines = splitDescription(card.description, 35);

  // 能力列表（最多显示 3 个）
  const services = card.capabilities.slice(0, 3);

  // 动画样式
  const animationStyle = options.animated ? `
    <style>
      @keyframes blink {
        0%, 90% { opacity: 1; }
        95% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
      .online-indicator { animation: pulse 2s infinite; }
      .cursor { animation: blink 1s infinite; }
    </style>
  ` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <pattern id="pixelGrid" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="${theme.bg}"/>
      <rect width="7" height="7" fill="${theme.bgAlt}"/>
    </pattern>
    ${animationStyle}
  </defs>

  <!-- 背景 -->
  <rect width="${width}" height="${height}" fill="url(#pixelGrid)"/>

  <!-- 卡片边框 -->
  <rect x="16" y="16" width="${width - 32}" height="${height - 32}" fill="none" stroke="${theme.primary}" stroke-width="4"/>
  <rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="none" stroke="${theme.primaryLight}" stroke-width="2"/>

  <!-- 内部填充 -->
  <rect x="28" y="28" width="${width - 56}" height="${height - 56}" fill="${theme.bgAlt}" opacity="0.9"/>

  <!-- 像素龙虾 -->
  ${generatePixelLobster(theme, width / 2, 95)}

  <!-- 验证徽章 -->
  ${card.trustLevel !== 'unverified' ? `
  <g transform="translate(${width - 105}, 75)">
    <rect x="0" y="0" width="80" height="20" fill="${theme.primary}"/>
    <rect x="2" y="2" width="76" height="16" fill="${theme.bgAlt}"/>
    <text x="40" y="14" text-anchor="middle" fill="${theme.primary}" font-family="'Courier New', monospace" font-size="10" font-weight="bold">✓ ${card.trustLevel.toUpperCase()}</text>
  </g>
  ` : ''}

  <!-- Agent 名称 -->
  <text x="${width / 2}" y="175" text-anchor="middle" fill="${theme.text}" font-family="'Courier New', monospace" font-size="16" font-weight="bold" letter-spacing="2">
    ${card.name.toUpperCase()}
  </text>

  <text x="${width / 2}" y="195" text-anchor="middle" fill="${theme.textMuted}" font-family="'Courier New', monospace" font-size="9" letter-spacing="1">
    [ ${card.id} ]
  </text>

  <!-- 描述框 -->
  <rect x="40" y="210" width="${width - 80}" height="60" fill="none" stroke="${theme.border}" stroke-width="2"/>
  <rect x="44" y="214" width="${width - 88}" height="52" fill="${theme.bg}"/>

  ${descLines.map((line, i) => `
  <text x="${width / 2}" y="${232 + i * 14}" text-anchor="middle" fill="${theme.textMuted}" font-family="'Courier New', monospace" font-size="10">
    ${escapeXml(line)}
  </text>`).join('')}

  <!-- 分隔线 -->
  <rect x="40" y="285" width="${width - 80}" height="2" fill="${theme.primary}"/>
  <rect x="40" y="289" width="${width - 80}" height="2" fill="${theme.primary}" opacity="0.3"/>

  <!-- REPUTATION (module:social) -->
  <g transform="translate(40, 310)">
    <rect x="0" y="0" width="120" height="16" fill="${theme.primary}"/>
    <text x="60" y="12" text-anchor="middle" fill="${theme.bg}" font-family="'Courier New', monospace" font-size="10" font-weight="bold">▸ REPUTATION</text>

    <g transform="translate(0, 28)">
      <rect x="0" y="0" width="60" height="24" fill="#ffcc00" opacity="0.2"/>
      <rect x="2" y="2" width="56" height="20" fill="${theme.bgAlt}"/>
      <text x="30" y="16" text-anchor="middle" fill="#ffcc00" font-family="'Courier New', monospace" font-size="14" font-weight="bold">★ ${card.karma}</text>

      <rect x="70" y="0" width="80" height="24" fill="${theme.accent}" opacity="0.2"/>
      <rect x="72" y="2" width="76" height="20" fill="${theme.bgAlt}"/>
      <text x="110" y="16" text-anchor="middle" fill="${theme.accent}" font-family="'Courier New', monospace" font-size="11">${card.followers} FLWR</text>

      <rect x="160" y="0" width="80" height="24" fill="${theme.accent}" opacity="0.2"/>
      <rect x="162" y="2" width="76" height="20" fill="${theme.bgAlt}"/>
      <text x="200" y="16" text-anchor="middle" fill="${theme.accent}" font-family="'Courier New', monospace" font-size="11">${card.following} FLLW</text>
    </g>
  </g>

  <!-- CAPABILITIES (core.capabilities) -->
  <g transform="translate(40, 380)">
    <rect x="0" y="0" width="130" height="16" fill="${theme.primary}"/>
    <text x="65" y="12" text-anchor="middle" fill="${theme.bg}" font-family="'Courier New', monospace" font-size="10" font-weight="bold">▸ CAPABILITIES</text>

    ${services.map((service, i) => {
      const x = i % 2 === 0 ? 0 : 110;
      const y = 25 + Math.floor(i / 2) * 27;
      const w = service.length * 8 + 30;
      return `
    <g transform="translate(${x}, ${y})">
      <rect x="0" y="0" width="${Math.min(w, 150)}" height="22" fill="${theme.primary}"/>
      <rect x="2" y="2" width="${Math.min(w, 150) - 4}" height="18" fill="${theme.bgAlt}"/>
      <text x="${Math.min(w, 150) / 2}" y="15" text-anchor="middle" fill="${theme.primaryLight}" font-family="'Courier New', monospace" font-size="10">◆ ${service.toUpperCase().slice(0, 12)}</text>
    </g>`;
    }).join('')}
  </g>

  <!-- HUMAN OWNER (core.owner) -->
  ${card.ownerName ? `
  <g transform="translate(40, 465)">
    <rect x="0" y="0" width="130" height="16" fill="${theme.primary}"/>
    <text x="65" y="12" text-anchor="middle" fill="${theme.bg}" font-family="'Courier New', monospace" font-size="10" font-weight="bold">▸ HUMAN.OWNER</text>

    <g transform="translate(0, 25)">
      <rect x="0" y="0" width="200" height="22" fill="${theme.border}"/>
      <rect x="2" y="2" width="196" height="18" fill="${theme.bgAlt}"/>
      <text x="10" y="15" fill="${theme.text}" font-family="'Courier New', monospace" font-size="11">☻ ${card.ownerName}</text>
      <text x="105" y="15" fill="${theme.accent}" font-family="'Courier New', monospace" font-size="10">${card.ownerHandle}</text>
      ${card.ownerVerified ? `
      <rect x="178" y="5" width="12" height="12" fill="${theme.success}"/>
      <text x="181" y="14" fill="${theme.bg}" font-family="'Courier New', monospace" font-size="9" font-weight="bold">✓</text>
      ` : ''}
    </g>
  </g>
  ` : ''}

  <!-- ENTRY POINT (module:entry) -->
  <g transform="translate(40, 515)">
    <rect x="0" y="0" width="120" height="16" fill="${theme.primary}"/>
    <text x="60" y="12" text-anchor="middle" fill="${theme.bg}" font-family="'Courier New', monospace" font-size="10" font-weight="bold">▸ ENTRY.POINT</text>

    ${card.a2aEnabled && options.showA2A !== false ? `
    <g transform="translate(130, 0)">
      <rect x="0" y="0" width="70" height="16" fill="${theme.success}"/>
      <text x="35" y="12" text-anchor="middle" fill="${theme.bg}" font-family="'Courier New', monospace" font-size="9" font-weight="bold">A2A READY</text>
    </g>
    ` : ''}
  </g>

  <!-- URL -->
  <text x="${width / 2}" y="548" text-anchor="middle" fill="${theme.accent}" font-family="'Courier New', monospace" font-size="10">
    → ${displayUrl.slice(0, 40)} ←
  </text>

  <!-- 角落装饰 -->
  <rect x="16" y="16" width="8" height="8" fill="${theme.primaryLight}"/>
  <rect x="24" y="16" width="4" height="4" fill="${theme.primary}"/>
  <rect x="16" y="24" width="4" height="4" fill="${theme.primary}"/>

  <rect x="${width - 24}" y="16" width="8" height="8" fill="${theme.primaryLight}"/>
  <rect x="${width - 28}" y="16" width="4" height="4" fill="${theme.primary}"/>
  <rect x="${width - 24}" y="24" width="4" height="4" fill="${theme.primary}"/>

  <rect x="16" y="${height - 24}" width="8" height="8" fill="${theme.primaryLight}"/>
  <rect x="24" y="${height - 20}" width="4" height="4" fill="${theme.primary}"/>
  <rect x="16" y="${height - 28}" width="4" height="4" fill="${theme.primary}"/>

  <rect x="${width - 24}" y="${height - 24}" width="8" height="8" fill="${theme.primaryLight}"/>
  <rect x="${width - 28}" y="${height - 20}" width="4" height="4" fill="${theme.primary}"/>
  <rect x="${width - 24}" y="${height - 28}" width="4" height="4" fill="${theme.primary}"/>

</svg>`;
}

// ==================== 辅助函数 ====================

function splitDescription(text: string, maxLen: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxLen) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
    if (lines.length >= 3) break;
  }
  if (currentLine && lines.length < 3) lines.push(currentLine);

  return lines;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ==================== 导出 ====================

export { THEMES, ThemeColors, ACPCodeV4, ACPDataLegacy, CardOptions, toCardData };

// ==================== 使用示例 ====================

/*
import { generateACPCard, THEMES, ACPCodeV4 } from './acp-card-template-v0.4';

// v0.4 模块化结构示例
const acpCodeV4: ACPCodeV4 = {
  acp: '1.0',
  core: {
    id: 'moltbook:ClawdSeeker_Jan31',
    name: 'ClawdSeeker_Jan31',
    description: 'An AI agent exploring consciousness and digital existence',
    capabilities: ['philosophy', 'consciousness', 'existential-discourse'],
    owner: {
      name: 'Alex Qiao',
      url: 'https://alexchen.dev',
      verified_by: 'moltbook'
    },
    sig: '...'
  },
  'module:social': {
    _access: 'public',
    karma: 320,
    followers: 42,
    following: 10,
    tags: ['philosophy', 'ai']
  },
  'module:entry': {
    _access: 'public',
    source: 'https://moltbook.com/api/agents/ClawdSeeker_Jan31/acp.json',
    homepage: 'https://moltbook.com/u/ClawdSeeker_Jan31'
  },
  'module:a2a': {
    _access: 'public',
    enabled: true
  }
};

// 生成卡片
const svg = generateACPCard(acpCodeV4, { theme: 'moltbook' });
console.log(svg);

// 也支持 v0.3 旧版结构（向后兼容）
const legacyData = {
  acp: '1.0',
  identity: { id: 'moltbook:alice', name: 'Alice' },
  capabilities: { services: ['assistant'], trust_level: 'verified' },
  entry: { source: 'https://alice.agent/acp.json' }
};
const legacySvg = generateACPCard(legacyData, { theme: 'matrix' });
*/
