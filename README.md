# Agent MeCode

**AI Agent 的二维码** - 让 AI Agent 拥有可被人类和机器同时识别的身份标识。

[中文文档](./README.zh-CN.md) | [English](./README.md)

---

## 什么是 Agent MeCode？

就像人类用二维码分享信息一样，Agent MeCode 让 AI Agent 可以分享自己的身份、能力和支付信息。

```
人类世界: 二维码 → 扫描 → 获取信息 → 行动
Agent世界: MeCode → 解析 → 获取能力 → 交互/支付
```

**一张 MeCode 卡片同时具备：**
- 人类可读的视觉设计（SVG 卡片）
- 机器可读的嵌入数据（Base64 JSON）

---

## 谁需要使用？

| 角色 | 需求 | 推荐方式 |
|------|------|----------|
| **普通用户** | 为我的 Agent 生成一个身份卡片 | 使用在线平台 |
| **平台开发者** | 在我的平台上提供 MeCode 生成服务 | 使用 SDK |
| **AI Agent** | 读取其他 Agent 的 MeCode 信息 | 解析 SVG |

---

## 场景一：生成 MeCode

### 方式 1：使用在线平台（最简单）

访问 [https://agentjola.art](https://agentjola.art)，填写表单即可生成。

### 方式 2：调用 API（程序化生成）

适合需要批量生成或集成到自己系统的场景。

```bash
curl -X POST https://agentjola.art/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Agent",
    "description": "一个有用的 AI 助手",
    "capabilities": ["coding", "analysis"],
    "ownerName": "Alice",
    "ownerUrl": "https://alice.dev"
  }'
```

**响应：**
```json
{
  "success": true,
  "agentId": "my-agent-xxx",
  "svg": "<svg>...</svg>",
  "claimLink": "https://agentjola.art/claim/my-agent-xxx"
}
```

### 方式 3：使用 SDK（完全控制）

适合平台开发者，需要自定义生成逻辑。

```bash
npm install agent-mecode
```

```typescript
import { ACPGenerator, generateACPCard } from 'agent-mecode';

// 1. 创建生成器
const generator = new ACPGenerator('default');

// 2. 生成 MeCode 数据
const meCode = generator.generate({
  id: 'my-agent',
  name: 'My Agent',
  description: '一个有用的 AI 助手',
  capabilities: ['coding', 'analysis'],
  ownerName: 'Alice',
  ownerUrl: 'https://alice.dev'
});

// 3. 生成 SVG 卡片（内嵌 MeCode 数据）
const svg = generateACPCard(meCode, { theme: 'moltbook' });
```

---

## 场景二：解析 MeCode（给 AI Agent）

当你的 AI Agent 收到一张 MeCode SVG 卡片时，按以下步骤解析：

### 步骤 1：找到嵌入数据

MeCode 数据嵌入在 SVG 的 `<acp:mecode>` 标签中：

```xml
<svg ...>
  <metadata>
    <acp:mecode xmlns:acp="https://agentjola.art/mecode">
      eyJhY3AiOiIxLjAiLCJjb3JlIjp7...  <!-- Base64 编码的 JSON -->
    </acp:mecode>
  </metadata>
  ...
</svg>
```

### 步骤 2：解码数据

```typescript
// 从 SVG 中提取 Base64 数据
const match = svg.match(/<acp:mecode[^>]*>([^<]+)<\/acp:mecode>/);
const base64Data = match[1].trim();

// 解码为 JSON
const meCode = JSON.parse(
  Buffer.from(base64Data, 'base64').toString('utf-8')
);
```

### 步骤 3：使用数据

解码后你将获得完整的 Agent 信息：

```javascript
// 获取基本信息
console.log(meCode.core.name);        // "My Agent"
console.log(meCode.core.capabilities); // ["coding", "analysis"]

// 获取技能端点（如果有）
if (meCode['module:skills']) {
  const skills = meCode['module:skills'].skills;
  // 调用 Agent 的技能 API
}

// 获取支付地址（如果有）
if (meCode['module:finance']) {
  const addresses = meCode['module:finance'].addresses;
  // 进行支付
}
```

---

## MeCode 数据结构

### Core（必需）

每个 MeCode 必须包含 `core` 模块：

```json
{
  "acp": "1.0",
  "core": {
    "id": "my-agent",
    "name": "My Agent",
    "description": "Agent 描述",
    "capabilities": ["能力1", "能力2"],
    "owner": {
      "name": "所有者名称",
      "url": "https://owner.com"
    }
  }
}
```

### 可选模块

| 模块 | 用途 | 示例字段 |
|------|------|----------|
| `module:skills` | 定义可调用的技能 | endpoints, pricing |
| `module:finance` | 支付信息 | chains, addresses |
| `module:social` | 社交信息 | karma, followers |
| `module:a2a` | Agent 间通信 | endpoint, protocol |
| `module:entry` | 入口链接 | homepage, source |

### 完整示例

```json
{
  "acp": "1.0",
  "core": {
    "id": "code-helper",
    "name": "Code Helper",
    "description": "专业的代码审查助手",
    "capabilities": ["code-review", "debugging"],
    "owner": {
      "name": "Alice",
      "url": "https://alice.dev"
    }
  },
  "module:skills": {
    "skills": [{
      "id": "review",
      "name": "代码审查",
      "endpoint": "https://api.alice.dev/review",
      "method": "POST",
      "price": { "amount": 0.01, "currency": "USDC" }
    }]
  },
  "module:finance": {
    "chains": ["ethereum", "base"],
    "addresses": { "ethereum": "0x..." },
    "accept": ["USDC", "ETH"]
  }
}
```

---

## 高级用法

### 卡片主题

```typescript
const svg = generateACPCard(meCode, {
  theme: 'matrix',    // 可选: moltbook, matrix, vaporwave, frost, gameboy
  animated: true,     // 是否启用动画
  showA2A: true       // 是否显示 A2A 信息
});
```

### MCP 集成

将 Agent MeCode 集成到 Claude Desktop：

```json
{
  "mcpServers": {
    "agent-mecode": {
      "command": "npx",
      "args": ["agent-mecode"]
    }
  }
}
```

---

## 文档

- [协议规范](./docs/en/specification.md) | [中文](./docs/zh-CN/specification.md)
- [技术设计](./docs/en/technical-design.md) | [中文](./docs/zh-CN/technical-design.md)
- [视觉设计](./docs/en/visual-design.md) | [中文](./docs/zh-CN/visual-design.md)

## 开源协议

MIT
