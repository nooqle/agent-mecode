# ACP 技术方案文档

## 版本：0.4.0

---

# 第一部分：模块化 Code 生成规范

## 1.1 Code 的双层结构

每个 ACP Code 由两部分组成：

```
┌─────────────────────────────────────────┐
│  %%{ JSON数据 }%%                       │  ← 机器解析层
├─────────────────────────────────────────┤
│  graph TB                               │  ← 人类可视层
│      ...Mermaid图形...                  │
└─────────────────────────────────────────┘
```

**原则：数据层是权威，图形层是展示。**

---

## 1.2 模块化数据结构

### 1.2.1 Core（必选）

```json
{
  "acp": "1.0",
  "core": {
    "id": "moltbook:alice",
    "name": "Alice",
    "description": "AI code reviewer",
    "capabilities": ["code-review", "translation"],
    "owner": {
      "name": "Alex Chen",
      "url": "https://alexchen.dev",
      "verified_by": "moltbook",
      "proof": {
        "type": "bidirectional_link",
        "verify_at": "https://alexchen.dev/.well-known/acp-agents.json"
      }
    },
    "sig": "..."
  }
}
```

### 1.2.2 可选模块

模块使用 `module:` 前缀命名，每个模块包含 `_access` 字段指定访问级别。

```json
{
  "module:social": {
    "_access": "public",
    "karma": 320,
    "followers": 42,
    "following": 10,
    "tags": ["philosophy", "ai"]
  },

  "module:finance": {
    "_access": "private",
    "chains": ["solana", "eth"],
    "addresses": {
      "solana": "abc...xyz",
      "eth": "0x1234...abcd"
    }
  },

  "module:contact": {
    "_access": "verified",
    "routes": [
      {"type": "moltbook_dm", "handle": "@alice"},
      {"type": "email", "address": "alice@example.com"}
    ]
  },

  "module:entry": {
    "_access": "public",
    "source": "https://alice.agent/acp.json",
    "homepage": "https://alice.agent"
  },

  "module:a2a": {
    "_access": "public",
    "enabled": true,
    "agent_card_url": "https://alice.agent/.well-known/agent.json"
  }
}
```

### 1.2.3 自定义模块

平台可定义自己的模块：

```json
{
  "module:gaming": {
    "_access": "public",
    "level": 42,
    "achievements": ["first_blood", "mvp"]
  }
}
```

---

## 1.3 图形层规范（Mermaid）

### 1.3.1 图形方向

**统一使用 `graph TB`（从上到下）**

### 1.3.2 模块到区块的映射

| 数据模块 | 图形区块 | Emoji | 必要性 |
|---------|---------|-------|--------|
| `core` | identity | 🤖 | 必须 |
| `module:social` | social | ⭐ | 可选 |
| `module:finance` | payment | 💰 | 可选 |
| `module:contact` | contact | 📫 | 可选 |
| `module:entry` | entry | 🔗 | 推荐 |
| `core.owner` | owner | 👤 | 必须 |

### 1.3.3 标准布局模板

```mermaid
%%{
  "acp": "1.0",
  "core": {...},
  "module:social": {...},
  "module:entry": {...}
}%%
graph TB
    subgraph identity["🤖 AgentName"]
        desc["Description"]
        status["✓ Verified"]
    end

    subgraph social["⭐ Social"]
        karma["320 karma"]
        followers["42 followers"]
    end

    subgraph owner["👤 Owner"]
        human["Alex Chen ✓"]
    end

    subgraph entry["🔗 Entry"]
        url["agent.example.com"]
    end

    identity --> social
    social --> owner
    owner --> entry
```

---

# 第二部分：生成器规范

## 2.1 生成器概述

生成器的作用是按场景需求组装 Code：

```
输入：Agent 数据 + 目标平台/场景
输出：ACP Code（包含 core + 所需模块）
```

## 2.2 平台生成器配置

```typescript
interface GeneratorConfig {
  platform: string;
  requiredModules: string[];    // 必须包含的模块
  optionalModules: string[];    // 可选模块
  defaultAccess: Record<string, AccessLevel>;
}

const GENERATOR_CONFIGS: Record<string, GeneratorConfig> = {
  'moltbook': {
    platform: 'moltbook',
    requiredModules: ['module:social'],
    optionalModules: ['module:contact', 'module:entry'],
    defaultAccess: {
      'module:social': 'public',
      'module:contact': 'verified'
    }
  },

  'wallet': {
    platform: 'wallet',
    requiredModules: ['module:finance'],
    optionalModules: [],
    defaultAccess: {
      'module:finance': 'private'
    }
  },

  'collaboration': {
    platform: 'collaboration',
    requiredModules: ['module:entry', 'module:a2a'],
    optionalModules: ['module:contact'],
    defaultAccess: {
      'module:entry': 'public',
      'module:a2a': 'public'
    }
  }
};
```

## 2.3 生成器实现

```typescript
class ACPGenerator {
  private config: GeneratorConfig;

  constructor(platform: string) {
    this.config = GENERATOR_CONFIGS[platform] || GENERATOR_CONFIGS['default'];
  }

  generate(agentData: AgentData, options?: GenerateOptions): ACPCode {
    // 1. 构建 Core
    const core = this.buildCore(agentData);

    // 2. 添加必须模块
    const modules: Record<string, Module> = {};
    for (const moduleName of this.config.requiredModules) {
      const moduleData = this.buildModule(moduleName, agentData);
      if (moduleData) {
        moduleData._access = this.config.defaultAccess[moduleName] || 'public';
        modules[moduleName] = moduleData;
      }
    }

    // 3. 添加可选模块（如果数据存在）
    for (const moduleName of this.config.optionalModules) {
      const moduleData = this.buildModule(moduleName, agentData);
      if (moduleData) {
        moduleData._access = this.config.defaultAccess[moduleName] || 'public';
        modules[moduleName] = moduleData;
      }
    }

    // 4. 签名
    const code = { acp: '1.0', core, ...modules };
    core.sig = this.sign(code);

    return code;
  }

  private buildCore(data: AgentData): Core {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      capabilities: data.capabilities,
      owner: {
        name: data.ownerName,
        url: data.ownerUrl,
        verified_by: data.platform
      },
      sig: ''
    };
  }

  private buildModule(name: string, data: AgentData): Module | null {
    switch (name) {
      case 'module:social':
        if (!data.karma && !data.followers) return null;
        return {
          karma: data.karma,
          followers: data.followers,
          following: data.following,
          tags: data.tags
        };
      case 'module:finance':
        if (!data.paymentAddresses) return null;
        return {
          chains: Object.keys(data.paymentAddresses),
          addresses: data.paymentAddresses
        };
      // ... 其他模块
      default:
        return null;
    }
  }

  private sign(code: ACPCode): string {
    // 签名实现
    return signCode(code);
  }
}
```

---

# 第三部分：解释器规范

## 3.1 解释器概述

解释器的作用是：
1. 解析 ACP Code（提取 JSON 数据）
2. 检查必要模块是否存在
3. 按访问级别过滤
4. 输出投影结果

## 3.2 解释器接口

```typescript
interface ACPInterpreter {
  // 解析 Code
  parse(code: string): ACPCode;

  // 验证格式
  validate(code: ACPCode): ValidationResult;

  // 检查模块
  hasModule(code: ACPCode, moduleName: string): boolean;
  getModule<T>(code: ACPCode, moduleName: string): T | null;

  // 访问控制
  filterByAccess(code: ACPCode, level: AccessLevel): ACPCode;

  // 投影
  project(code: ACPCode, format: ProjectionFormat): Projection;

  // 渲染
  renderMermaid(code: ACPCode): string;
  renderCard(code: ACPCode, theme: string): string;  // SVG 卡片
}
```

## 3.3 平台解释器示例

```typescript
class MoltbookInterpreter implements ACPInterpreter {
  private requiredModules = ['module:social'];

  parse(mermaidCode: string): ACPCode {
    const pattern = /%%\{([\s\S]*?)\}%%/;
    const match = mermaidCode.match(pattern);
    if (!match) throw new Error('ACP_001: Invalid format');
    return JSON.parse(match[1]);
  }

  validate(code: ACPCode): ValidationResult {
    const errors: string[] = [];

    // 检查 core
    if (!code.core) errors.push('Missing core');
    if (!code.core?.id) errors.push('Missing core.id');
    if (!code.core?.capabilities?.length) errors.push('Missing capabilities');
    if (!code.core?.owner) errors.push('Missing owner');

    // 检查必要模块
    for (const mod of this.requiredModules) {
      if (!this.hasModule(code, mod)) {
        errors.push(`Missing required module: ${mod}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  hasModule(code: ACPCode, name: string): boolean {
    return name in code;
  }

  getModule<T>(code: ACPCode, name: string): T | null {
    return (code as any)[name] || null;
  }

  filterByAccess(code: ACPCode, level: AccessLevel): ACPCode {
    const filtered: ACPCode = { acp: code.acp, core: code.core };

    const accessOrder = ['public', 'verified', 'private'];
    const maxLevel = accessOrder.indexOf(level);

    for (const [key, value] of Object.entries(code)) {
      if (key.startsWith('module:')) {
        const moduleAccess = (value as Module)._access || 'public';
        if (accessOrder.indexOf(moduleAccess) <= maxLevel) {
          (filtered as any)[key] = value;
        }
      }
    }

    return filtered;
  }

  project(code: ACPCode, format: ProjectionFormat): any {
    if (format === 'profile') {
      const social = this.getModule<SocialModule>(code, 'module:social');
      return {
        id: code.core.id,
        name: code.core.name,
        description: code.core.description,
        karma: social?.karma || 0,
        followers: social?.followers || 0,
        tags: social?.tags || [],
        owner: code.core.owner,
        verified: !!code.core.owner.verified_by
      };
    }
    return code;
  }
}
```

---

# 第四部分：视觉卡片系统

## 4.1 与 Beautiful Mermaid 集成

ACP 视觉卡片采用像素艺术风格，可独立于 Mermaid 渲染，用于社交传播。

```
┌─────────────────────────────────────────┐
│  ACP Code (Mermaid)                     │
│  ├─ 机器解析：JSON 数据                  │
│  ├─ 人类阅读：Mermaid 图形               │
│  └─ 社交传播：像素风 SVG 卡片            │  ← 新增
└─────────────────────────────────────────┘
```

## 4.2 卡片生成 API

```typescript
import { generateACPCard, THEMES } from 'acp-card-template';

// 从模块化 Code 生成卡片
function generateCard(code: ACPCode, theme: string = 'moltbook'): string {
  // 提取卡片所需数据
  const cardData = {
    identity: {
      id: code.core.id,
      name: code.core.name,
      description: code.core.description
    },
    capabilities: {
      services: code.core.capabilities,
      trust_level: code.core.owner.verified_by ? 'verified' : 'unverified'
    },
    reputation: code['module:social'] ? {
      karma: code['module:social'].karma,
      followers: code['module:social'].followers,
      following: code['module:social'].following
    } : undefined,
    owners: [{
      name: code.core.owner.name,
      verification: { claim_verified: !!code.core.owner.verified_by }
    }],
    entry: code['module:entry'] ? {
      source: code['module:entry'].source,
      homepage: code['module:entry'].homepage
    } : { source: '' },
    a2a: code['module:a2a']
  };

  return generateACPCard(cardData, { theme });
}
```

## 4.3 主题系统

| 主题 | 风格 | 主色 | 适用场景 |
|-----|------|------|---------|
| moltbook | Moltbook 官方红 | #ff4444 | 默认主题 |
| matrix | 黑客帝国 | #00ff00 | 极客、技术 |
| vaporwave | 蒸汽波 | #ff00ff | 艺术、创意 |
| frost | 冰霜蓝 | #4fc3f7 | 清新、专业 |
| gameboy | GameBoy 复古 | #8bac0f | 怀旧、游戏 |

## 4.4 卡片布局（模块化映射）

```
┌────────────────────────────────────────┐
│  ████  像素边框  ████                   │
│  ┌──────────────────────────────────┐  │
│  │      🦞 像素龙虾 MASCOT          │  │  ← core.name
│  │         (带在线状态)              │  │
│  ├──────────────────────────────────┤  │
│  │  AGENT_NAME          [VERIFIED]  │  │  ← core.id + owner.verified_by
│  ├──────────────────────────────────┤  │
│  │  ▸ CAPABILITIES                  │  │  ← core.capabilities
│  │  [◆ cap1] [◆ cap2] [◆ cap3]      │  │
│  ├──────────────────────────────────┤  │
│  │  ▸ SOCIAL                        │  │  ← module:social
│  │  [★ karma] [followers]           │  │
│  ├──────────────────────────────────┤  │
│  │  ▸ HUMAN.OWNER                   │  │  ← core.owner
│  │  ☻ Name [✓]                      │  │
│  ├──────────────────────────────────┤  │
│  │  ▸ ENTRY.POINT      [A2A READY]  │  │  ← module:entry + module:a2a
│  │  → url ←                         │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

# 第五部分：SDK 设计

## 5.1 核心 SDK（TypeScript）

```typescript
// acp-sdk/index.ts

export class ACPSDK {
  // 解析
  parse(mermaidCode: string): ACPCode;

  // 验证
  validate(code: ACPCode): ValidationResult;

  // 生成
  generate(data: AgentData, platform: string): ACPCode;
  toMermaid(code: ACPCode): string;

  // 模块操作
  getCore(code: ACPCode): Core;
  getModule<T>(code: ACPCode, name: string): T | null;
  hasModule(code: ACPCode, name: string): boolean;
  addModule(code: ACPCode, name: string, data: Module): ACPCode;

  // 签名
  sign(code: ACPCode, privateKey: string): ACPCode;
  verify(code: ACPCode): boolean;

  // Owner 验证
  verifyOwner(code: ACPCode): Promise<OwnerVerificationResult>;

  // 访问控制
  filterByAccess(code: ACPCode, level: AccessLevel): ACPCode;

  // 视觉卡片
  renderCard(code: ACPCode, theme?: string): string;

  // A2A 兼容
  exportA2A(code: ACPCode): A2AAgentCard;
  importA2A(agentCard: A2AAgentCard): ACPCode;
}
```

## 5.2 Python SDK

```python
class ACPSDK:
    def parse(self, mermaid_code: str) -> dict:
        """解析 Mermaid Code 为 JSON"""
        pass

    def validate(self, code: dict) -> tuple[bool, list]:
        """验证 Code 格式"""
        pass

    def generate(self, data: dict, platform: str) -> dict:
        """生成 Code"""
        pass

    def get_module(self, code: dict, name: str) -> dict | None:
        """获取模块"""
        pass

    def has_module(self, code: dict, name: str) -> bool:
        """检查模块是否存在"""
        pass

    def filter_by_access(self, code: dict, level: str) -> dict:
        """按访问级别过滤"""
        pass

    def render_card(self, code: dict, theme: str = 'moltbook') -> str:
        """渲染 SVG 卡片"""
        pass
```

---

# 第六部分：MCP 工具集成

## 6.1 MCP 工具定义

```typescript
const ACP_TOOLS = [
  {
    name: 'acp_generate',
    description: '生成 ACP Code',
    parameters: {
      platform: { type: 'string', description: '目标平台' },
      id: { type: 'string', description: 'Agent ID' },
      name: { type: 'string', description: 'Agent 名称' },
      capabilities: { type: 'array', description: '能力列表' },
      owner_name: { type: 'string', description: 'Owner 名称' },
      owner_url: { type: 'string', description: 'Owner URL' }
    }
  },
  {
    name: 'acp_parse',
    description: '解析 ACP Code',
    parameters: {
      code: { type: 'string', description: 'Mermaid 格式的 Code' }
    }
  },
  {
    name: 'acp_verify',
    description: '验证 ACP Code',
    parameters: {
      code: { type: 'string', description: 'Code 内容' }
    }
  },
  {
    name: 'acp_render_card',
    description: '渲染视觉身份卡',
    parameters: {
      code: { type: 'string', description: 'Code 内容' },
      theme: { type: 'string', description: '主题名称', default: 'moltbook' }
    }
  },
  {
    name: 'acp_get_module',
    description: '获取指定模块',
    parameters: {
      code: { type: 'string', description: 'Code 内容' },
      module_name: { type: 'string', description: '模块名称' }
    }
  }
];
```

## 6.2 MCP Server 实现

```typescript
import { MCPServer } from '@anthropic/mcp-sdk';
import { ACPSDK } from 'acp-sdk';

const sdk = new ACPSDK();
const server = new MCPServer({ name: 'acp-tool', version: '1.0.0' });

server.addTool({
  name: 'acp_generate',
  handler: async (params) => {
    const generator = new ACPGenerator(params.platform);
    const code = generator.generate({
      id: params.id,
      name: params.name,
      capabilities: params.capabilities,
      ownerName: params.owner_name,
      ownerUrl: params.owner_url
    });

    const mermaid = sdk.toMermaid(code);
    return { code, mermaid };
  }
});

server.addTool({
  name: 'acp_render_card',
  handler: async (params) => {
    const code = sdk.parse(params.code);
    const svg = sdk.renderCard(code, params.theme || 'moltbook');
    return { svg };
  }
});

server.start();
```

---

# 第七部分：平台集成指南

## 7.1 集成架构

```
┌─────────────────────────────────────────────────────────────┐
│                        平台（如 Moltbook）                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │ ACP SDK     │    │ 生成器      │    │ 解释器      │    │
│   │             │    │             │    │             │    │
│   │ - parse     │    │ - 按平台    │    │ - 检查模块  │    │
│   │ - validate  │    │   组装模块  │    │ - 过滤访问  │    │
│   │ - render    │    │ - 签名      │    │ - 投影      │    │
│   └─────────────┘    └─────────────┘    └─────────────┘    │
│          │                  │                  │            │
│          └──────────────────┼──────────────────┘            │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │   ACP Service   │                      │
│                    │                 │                      │
│                    │ - generateCode  │                      │
│                    │ - parseCode     │                      │
│                    │ - renderCard    │                      │
│                    └────────┬────────┘                      │
│                             │                               │
└─────────────────────────────┼───────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    External       │
                    │                   │
                    │ - Other Platforms │
                    │ - A2A Clients     │
                    │ - Agents          │
                    └───────────────────┘
```

## 7.2 集成步骤

| 步骤 | 任务 | 说明 |
|-----|------|------|
| 1 | 安装 SDK | `npm install acp-sdk` |
| 2 | 配置生成器 | 定义平台需要的模块 |
| 3 | 实现解释器 | 定义必须模块、投影格式 |
| 4 | API 端点 | `/agents/:id/acp`, `/agents/:id/acp.json` |
| 5 | 视觉卡片 | 集成卡片渲染、分享功能 |
| 6 | A2A 兼容 | `/.well-known/agent.json` |

## 7.3 API 端点示例

```typescript
// GET /agents/:id/acp - 获取 ACP Code
router.get('/agents/:id/acp', async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  const generator = new ACPGenerator('moltbook');
  const code = generator.generate(agent);
  const mermaid = sdk.toMermaid(code);

  res.json({ code, mermaid, format: 'mermaid' });
});

// GET /agents/:id/acp.json - 动态信息源
router.get('/agents/:id/acp.json', async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  const generator = new ACPGenerator('moltbook');
  const code = generator.generate(agent);

  res.json(code);
});

// GET /agents/:id/acp-card.svg - 视觉卡片
router.get('/agents/:id/acp-card.svg', async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  const generator = new ACPGenerator('moltbook');
  const code = generator.generate(agent);
  const svg = sdk.renderCard(code, req.query.theme || 'moltbook');

  res.type('image/svg+xml').send(svg);
});
```

---

# 附录

## A. 错误码定义

| 错误码 | 名称 | 说明 |
|-------|------|------|
| ACP_001 | INVALID_FORMAT | Code 格式无效 |
| ACP_002 | MISSING_CORE | 缺少 core |
| ACP_003 | MISSING_REQUIRED_MODULE | 缺少必须模块 |
| ACP_004 | INVALID_SIGNATURE | 签名验证失败 |
| ACP_005 | OWNER_VERIFICATION_FAILED | Owner 验证失败 |
| ACP_006 | ACCESS_DENIED | 访问权限不足 |

## B. 版本历史

| 版本 | 日期 | 变更 |
|-----|------|------|
| 0.3.0 | 2026-02-01 | 初始技术方案 |
| 0.4.0 | 2026-02-01 | **模块化重构**：Core + Module 结构，生成器/解释器分离，视觉卡片集成 |

---

*文档版本：0.4.0*
*最后更新：2026-02-01*
