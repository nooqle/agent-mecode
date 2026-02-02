# Agent MeCode (ACP SDK)

**Agent Code Protocol** - AI Agent 的"二维码"

[![npm version](https://badge.fury.io/js/agent-mecode.svg)](https://www.npmjs.com/package/agent-mecode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 什么是 Agent MeCode？

Agent MeCode 是一个标准化协议，用于 AI Agent 的身份、能力、声誉和联系信息的表达与交换。

```
人类世界：二维码 → 扫码 → 获取信息 → 操作
Agent世界：MeCode → 解析 → 获取能力 → 交互
```

**特点：**
- 🎨 **人类可读** - 生成漂亮的像素风 SVG 卡片
- 🤖 **机器可读** - SVG 中嵌入 Base64 编码的 JSON 数据
- 💰 **支持付款** - 内置钱包地址和定价信息
- 🔗 **A2A Ready** - 支持 Agent-to-Agent 通信协议

## 在线体验

访问 [https://agentjola.art](https://agentjola.art) 生成你的 Agent MeCode！

## 安装

```bash
npm install agent-mecode
```

## 快速开始

### 解析 ACP Code

```typescript
import { ACPSDK } from '@anthropic/acp-sdk';

const sdk = new ACPSDK();

// 从 Mermaid 格式解析
const code = sdk.parse(mermaidCode);

// 验证格式
const result = sdk.validate(code);
if (!result.valid) {
  console.error(result.errors);
}

// 获取模块
const social = sdk.getModule(code, 'module:social');
console.log(social?.karma);
```

### 生成 ACP Code

```typescript
import { ACPGenerator } from '@anthropic/acp-sdk';

// 创建 Moltbook 平台生成器
const generator = new ACPGenerator('moltbook');

// 生成 Code
const code = generator.generate({
  id: 'moltbook:alice',
  name: 'Alice',
  capabilities: ['assistant', 'code-review'],
  ownerName: 'Alex',
  ownerUrl: 'https://alex.dev',
  karma: 100,
  followers: 50
});

// 转换为 Mermaid 格式
const mermaid = sdk.toMermaid(code);
```

### 生成视觉卡片

```typescript
import { generateACPCard } from '@anthropic/acp-sdk';

// 生成 SVG 卡片
const svg = generateACPCard(code, { theme: 'moltbook' });

// 可用主题: moltbook, matrix, vaporwave, frost, gameboy, amber, bloodmoon, cyber-yellow
```

## v0.4 模块化结构

```json
{
  "acp": "1.0",
  "core": {
    "id": "moltbook:alice",
    "name": "Alice",
    "capabilities": ["assistant"],
    "owner": {
      "name": "Alex",
      "url": "https://alex.dev",
      "verified_by": "moltbook"
    },
    "sig": "..."
  },
  "module:social": {
    "_access": "public",
    "karma": 100,
    "followers": 50
  },
  "module:entry": {
    "_access": "public",
    "source": "https://alice.agent/acp.json"
  }
}
```

### Core（必选）

| 字段 | 说明 |
|-----|------|
| `id` | Agent ID，格式：`platform:name` |
| `name` | Agent 名称 |
| `capabilities` | 能力列表 |
| `owner` | 人类 Owner（name + url） |
| `sig` | 签名 |

### 模块（可选）

| 模块 | 说明 |
|-----|------|
| `module:social` | 社交属性（karma, followers, tags） |
| `module:finance` | 支付信息（chains, addresses） |
| `module:contact` | 联系方式 |
| `module:entry` | 入口点（source, homepage） |
| `module:a2a` | A2A 协议兼容 |

### 访问控制

每个模块可设置 `_access` 字段：
- `public` - 公开可见
- `verified` - 需身份验证
- `private` - 需授权

## API 文档

### ACPSDK

```typescript
class ACPSDK {
  parse(mermaidCode: string): ACPCode;
  validate(code: ACPCode): ValidationResult;
  getCore(code: ACPCode): Core;
  getModule<T>(code: ACPCode, name: string): T | null;
  hasModule(code: ACPCode, name: string): boolean;
  addModule(code: ACPCode, name: string, data: any): ACPCode;
  removeModule(code: ACPCode, name: string): ACPCode;
  filterByAccess(code: ACPCode, level: AccessLevel): ACPCode;
  toMermaid(code: ACPCode): string;
  verifyOwner(code: ACPCode): Promise<OwnerVerificationResult>;
  exportA2A(code: ACPCode): A2AAgentCard;
  importA2A(agentCard: A2AAgentCard): ACPCode;
}
```

### ACPGenerator

```typescript
class ACPGenerator {
  constructor(platform: string);
  generate(data: AgentData): ACPCode;
}

// 预定义平台: 'moltbook', 'wallet', 'collaboration', 'default'
```

### ACPInterpreter

```typescript
class ACPInterpreter {
  constructor(requiredModules: string[]);
  validate(code: ACPCode): ValidationResult;
  project(code: ACPCode, format: string): any;
}

// 预定义解释器: MoltbookInterpreter, WalletInterpreter, CollaborationInterpreter
```

### generateACPCard

```typescript
function generateACPCard(
  data: ACPCode | ACPDataLegacy,
  options?: CardOptions
): string;

interface CardOptions {
  theme: string | ThemeColors;
  width?: number;
  height?: number;
  showA2A?: boolean;
  animated?: boolean;
}
```

## 协议兼容

- **A2A Protocol** - 支持导入/导出 A2A AgentCard
- **Mermaid** - 使用 Mermaid 图作为载体格式

## MCP Server

ACP SDK 提供 MCP (Model Context Protocol) Server，可与 Claude Desktop 等 AI 应用集成。

### 配置 Claude Desktop

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "acp": {
      "command": "npx",
      "args": ["@anthropic/acp-sdk"]
    }
  }
}
```

### 可用工具

| 工具 | 说明 |
|-----|------|
| `acp-parse` | 从 Mermaid 格式解析 ACP Code |
| `acp-validate` | 验证 ACP Code 结构 |
| `acp-generate` | 从 agent 数据生成 ACP Code |
| `acp-to-mermaid` | 转换为 Mermaid 格式 |
| `acp-generate-card` | 生成 SVG 身份卡 |
| `acp-export-a2a` | 导出为 A2A 格式 |
| `acp-import-a2a` | 从 A2A 格式导入 |
| `acp-filter-access` | 按访问级别过滤模块 |
| `acp-list-themes` | 列出可用卡片主题 |
| `acp-list-platforms` | 列出可用平台配置 |

## 文档

- [协议规范](./docs/acp-specification-v0.4.md)
- [技术设计](./docs/acp-technical-design-v0.4.md)
- [视觉设计](./docs/acp-visual-design.md)

## License

MIT
