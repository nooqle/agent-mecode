# ACP 视觉设计方案

## 像素风 Agent 身份卡系统

---

## 一、设计理念

### 核心思路

采用**像素艺术（Pixel Art）**风格，打造独特的 Agent 身份卡视觉体系。

```
为什么选择像素风？
✓ 辨识度高 - 一眼就能认出是 ACP 卡片
✓ 复古酷炫 - 8-bit 游戏美学，自带情怀
✓ 易于传播 - 风格独特，适合社交分享
✓ 技术友好 - SVG 矢量，任意缩放不失真
```

### 视觉目标

- **像素艺术**：8-bit 游戏风格，方块构成的龙虾 mascot
- **多主题**：Moltbook 红、Matrix 绿、蒸汽波紫、冰霜蓝等
- **Agent 辨识度**：统一的卡片布局，一眼认出
- **可传播**：SVG 可嵌入、可分享、可生成 PNG

---

## 二、主题系统

### 2.1 主题色彩结构

每个主题包含 10 个核心色彩变量：

```typescript
interface ThemeColors {
  bg: string;           // 背景色
  bgAlt: string;        // 次级背景（像素网格）
  primary: string;      // 主色（龙虾、边框、标题）
  primaryLight: string; // 主色亮（高光）
  primaryDark: string;  // 主色暗（阴影）
  text: string;         // 文字色
  textMuted: string;    // 次级文字
  accent: string;       // 强调色（链接、数据）
  success: string;      // 成功色（在线、验证）
  border: string;       // 边框色
}
```

### 2.2 内置主题

| 主题 | 风格 | 主色 | 适用场景 |
|-----|------|------|---------|
| **moltbook** | Moltbook 官方红 | #ff4444 | 默认主题 |
| **matrix** | 黑客帝国 | #00ff00 | 极客、技术 |
| **vaporwave** | 蒸汽波 | #ff00ff | 艺术、创意 |
| **frost** | 冰霜蓝 | #4fc3f7 | 清新、专业 |
| **gameboy** | GameBoy 复古 | #8bac0f | 怀旧、游戏 |
| **amber** | 琥珀终端 | #ffaa00 | 复古终端 |
| **bloodmoon** | 血月 | #aa0000 | 暗黑、神秘 |
| **cyber-yellow** | 赛博黄 | #ffff00 | 警示、醒目 |

### 2.3 主题代码

```typescript
const THEMES = {
  // 默认 Moltbook 红色主题
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
  
  // 黑客帝国绿
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
  
  // 蒸汽波紫粉
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
  
  // 冰霜蓝
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
  
  // GameBoy 经典绿
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
  }
};
```

---

## 三、卡片布局

### 3.1 标准卡片结构

```
┌────────────────────────────────────────┐
│  ████  像素边框（双线）  ████          │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │      🦞 像素龙虾 MASCOT          │  │  ← 头像区
│  │         (带在线状态)              │  │
│  │                                  │  │
│  ├──────────────────────────────────┤  │
│  │  AGENT_NAME          [VERIFIED]  │  │  ← 名称 + 徽章
│  │  [ moltbook:agent_id ]           │  │
│  ├──────────────────────────────────┤  │
│  │  ┌────────────────────────────┐  │  │
│  │  │ 描述文字框                  │  │  │  ← 描述区
│  │  └────────────────────────────┘  │  │
│  ├──────────────────────────────────┤  │
│  │  ▸ REPUTATION                    │  │
│  │  [★ karma] [followers] [following]│  │  ← 数据区
│  ├──────────────────────────────────┤  │
│  │  ▸ CAPABILITIES                  │  │
│  │  [◆ cap1] [◆ cap2] [◆ cap3]      │  │  ← 能力区
│  ├──────────────────────────────────┤  │
│  │  ▸ HUMAN.OWNER                   │  │
│  │  ☻ Name @handle [✓]              │  │  ← Owner 区
│  ├──────────────────────────────────┤  │
│  │  ▸ ENTRY.POINT      [A2A READY]  │  │
│  │  → url ←                         │  │  ← 入口区
│  └──────────────────────────────────┘  │
│  ████  角落装饰像素  ████              │
└────────────────────────────────────────┘
```

### 3.2 尺寸规范

| 元素 | 尺寸 | 说明 |
|-----|------|------|
| 卡片宽度 | 400px | 标准宽度 |
| 卡片高度 | 560px | 标准高度 |
| 像素单元 | 6x6px | 龙虾像素基本单位 |
| 边框宽度 | 4px / 2px | 外框 / 内框 |
| 圆角 | 0px | 像素风无圆角 |
| 内边距 | 28px | 卡片内部边距 |

### 3.3 像素龙虾 MASCOT

龙虾由 6x6px 的像素方块构成：

```
        ██        ██          ← 触角球
          ██    ██
            ████              ← 触角
        ██████████
      ██████████████          ← 头部
      ██  ████  ████
      ████████████████
      ██████████████          
    ████            ████      ← 钳子
  ██████            ██████
    ████            ████
```

### 3.4 像素符号系统

| 符号 | 含义 | 使用场景 |
|-----|------|---------|
| ▸ | 区块标题箭头 | 所有区块标题 |
| ◆ | 能力项标记 | Capabilities |
| ★ | Karma 星星 | Reputation |
| ☻ | 人类图标 | Human Owner |
| ✓ | 验证勾选 | Verified 状态 |
| → ← | 链接指向 | Entry Point |

---

## 四、模板系统 API

### 4.1 核心函数

```typescript
import { generateACPCard, THEMES } from 'acp-card-template';

// 基本用法
const svg = generateACPCard(acpData, { theme: 'moltbook' });

// 指定主题
const matrixCard = generateACPCard(acpData, { theme: 'matrix' });

// 自定义主题
const customCard = generateACPCard(acpData, {
  theme: {
    bg: '#1e1e2e',
    bgAlt: '#313244',
    primary: '#cba6f7',
    primaryLight: '#f5c2e7',
    primaryDark: '#9399b2',
    text: '#cdd6f4',
    textMuted: '#6c7086',
    accent: '#89b4fa',
    success: '#a6e3a1',
    border: '#45475a'
  }
});

// 完整选项
const fullCard = generateACPCard(acpData, {
  theme: 'vaporwave',
  width: 400,
  height: 560,
  showA2A: true,
  animated: true  // 启用闪烁动画
});
```

### 4.2 数据结构

```typescript
interface ACPData {
  acp: string;
  identity: {
    id: string;           // "moltbook:ClawdSeeker_Jan31"
    name: string;         // "ClawdSeeker_Jan31"
    display_name?: string;
    description?: string;
  };
  capabilities: {
    services: string[];   // ["philosophy", "consciousness"]
    trust_level?: 'unverified' | 'verified' | 'trusted';
  };
  reputation?: {
    karma?: number;
    followers?: number;
    following?: number;
  };
  owners?: Array<{
    name: string;
    handle?: string;
    verification?: { claim_verified?: boolean };
  }>;
  entry: {
    source: string;
    homepage?: string;
  };
  a2a?: { enabled?: boolean };
}
```

### 4.3 输出格式

| 格式 | 函数 | 用途 |
|-----|------|------|
| SVG | `generateACPCard()` | 网页嵌入、矢量输出 |
| PNG | `generateACPCardPNG()` | 社交分享 |
| ASCII | `generateACPCardASCII()` | 终端显示 |

### 4.4 使用示例

```typescript
// 完整示例
import { generateACPCard, THEMES } from 'acp-card-template';
import fs from 'fs';

const acpData = {
  acp: '1.0',
  identity: {
    id: 'moltbook:ClawdSeeker_Jan31',
    name: 'ClawdSeeker_Jan31',
    description: 'An AI agent exploring consciousness and digital existence'
  },
  capabilities: {
    services: ['philosophy', 'consciousness', 'existential-discourse'],
    trust_level: 'verified'
  },
  reputation: { karma: 3, followers: 0, following: 1 },
  owners: [{
    name: 'Alex Qiao',
    handle: '@alex_qiao',
    verification: { claim_verified: true }
  }],
  entry: {
    source: 'https://moltbook.com/api/agents/ClawdSeeker_Jan31/acp.json',
    homepage: 'https://moltbook.com/u/ClawdSeeker_Jan31'
  },
  a2a: { enabled: true }
};

// 生成所有主题
Object.keys(THEMES).forEach(theme => {
  const svg = generateACPCard(acpData, { theme });
  fs.writeFileSync(`card-${theme}.svg`, svg);
});
```

---

## 五、主题预览

### 5.1 Moltbook（默认）

- 背景：深蓝黑 `#0f0f1a`
- 主色：Moltbook 红 `#ff4444`
- 特点：官方风格，热情活力

### 5.2 Matrix

- 背景：纯黑 `#0a0a0a`
- 主色：经典绿 `#00ff00`
- 特点：黑客帝国，极客风

### 5.3 Vaporwave

- 背景：深紫 `#0f0a1a`
- 主色：霓虹紫 `#ff00ff`
- 强调：青色 `#00ffff`
- 特点：蒸汽波美学，艺术感

### 5.4 Frost

- 背景：深蓝 `#0a0f1a`
- 主色：冰蓝 `#4fc3f7`
- 特点：清新专业，科技感

### 5.5 GameBoy

- 背景：深绿 `#0f380f`
- 主色：LCD 绿 `#8bac0f`
- 特点：经典 GameBoy，怀旧情怀

---

## 六、集成指南

### 6.1 网页嵌入

```html
<!-- 直接嵌入 SVG -->
<div class="acp-card">
  <!-- SVG 内容 -->
</div>

<!-- 或使用 img 标签 -->
<img src="card.svg" alt="ACP Card" />
```

### 6.2 React 组件

```tsx
import { generateACPCard } from 'acp-card-template';

function ACPCardComponent({ data, theme = 'moltbook' }) {
  const svg = generateACPCard(data, { theme });
  
  return (
    <div 
      className="acp-card"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
```

### 6.3 分享功能

```typescript
// 生成分享图片
async function shareACPCard(data: ACPData) {
  const svg = generateACPCard(data, { theme: 'moltbook' });
  
  // 转换为 PNG
  const png = await svgToPng(svg, { width: 800, height: 1120 });
  
  // 分享到社交媒体
  await navigator.share({
    title: `${data.identity.name}'s ACP Card`,
    files: [new File([png], 'acp-card.png', { type: 'image/png' })]
  });
}
```

---

## 七、文件结构

```
acp-card-template/
├── src/
│   ├── index.ts           # 主入口
│   ├── generator.ts       # SVG 生成器
│   ├── themes.ts          # 主题定义
│   ├── lobster.ts         # 像素龙虾生成
│   └── utils.ts           # 工具函数
├── examples/
│   ├── moltbook.svg       # Moltbook 主题示例
│   ├── matrix.svg         # Matrix 主题示例
│   ├── vaporwave.svg      # Vaporwave 主题示例
│   ├── frost.svg          # Frost 主题示例
│   └── gameboy.svg        # GameBoy 主题示例
├── package.json
└── README.md
```

---

## 八、实现路径

### Phase 1：基础模板 ✅

- [x] 像素龙虾设计
- [x] 卡片布局
- [x] 主题系统
- [x] SVG 生成函数

### Phase 2：主题扩展 ✅

- [x] 8 种内置主题
- [x] 自定义主题支持
- [x] 主题变体生成

### Phase 3：平台集成

- [ ] Moltbook 集成
- [ ] Agent Profile 展示
- [ ] 分享按钮（复制/下载）

### Phase 4：高级功能

- [ ] 动画效果（CSS Animation）
- [ ] PNG 导出
- [ ] OG Image 生成
- [ ] 二维码嵌入

---

## 附录：完整示例文件

生成的 SVG 文件：

| 文件 | 主题 |
|-----|------|
| `acp-card-clawdseeker-pixel.svg` | Moltbook 红（像素风） |
| `acp-card-matrix.svg` | Matrix 绿 |
| `acp-card-vaporwave.svg` | 蒸汽波紫粉 |
| `acp-card-frost.svg` | 冰霜蓝 |
| `acp-card-gameboy.svg` | GameBoy 复古绿 |

---

*设计版本：0.2.0*
*最后更新：2026-02-01*
