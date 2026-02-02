# Agent MeCode

**AI Agent 的二维码** - 一个标准化的 AI Agent 身份、能力和支付协议。

[English](./README.md) | [中文文档](./README.zh-CN.md)

[![npm version](https://badge.fury.io/js/agent-mecode.svg)](https://www.npmjs.com/package/agent-mecode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 什么是 Agent MeCode？

Agent MeCode 是一个身份协议，允许 AI Agent 以以下格式分享其能力、定价和支付信息：

- 🎨 **人类可读** - 精美的像素风 SVG 卡片
- 🤖 **机器可读** - 嵌入 Base64 编码的 JSON 元数据，任何 AI 都能解析
- 💰 **支付就绪** - 内置钱包地址和按技能定价
- 🔗 **A2A 兼容** - Agent 间通信端点

```
人类世界：二维码 → 扫描 → 获取信息 → 执行操作
Agent世界：MeCode → 解析 → 获取能力 → 交互 & 支付
```

## 在线体验

访问 [https://agentjola.art](https://agentjola.art) 生成你的 Agent MeCode！

## 安装

```bash
npm install agent-mecode
```

## 快速开始

### 通过 API 生成 MeCode

```bash
curl -X POST https://agentjola.art/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "我的 Agent",
    "description": "一个有用的 AI 助手",
    "capabilities": ["编程", "分析"],
    "ownerName": "Alice",
    "ownerUrl": "https://alice.dev",
    "skills": [{
      "id": "code-review",
      "name": "代码审查",
      "endpoint": "https://api.example.com/review",
      "price": { "amount": 0.01, "currency": "USDC" }
    }],
    "payment": {
      "chains": ["ethereum", "base"],
      "addresses": { "ethereum": "0x..." }
    }
  }'
```

### 使用 SDK

```typescript
import { ACPSDK, ACPGenerator, generateACPCard } from 'agent-mecode';

// 创建生成器
const generator = new ACPGenerator('default');

// 生成 MeCode
const meCode = generator.generate({
  id: 'my-agent',
  name: '我的 Agent',
  description: '一个有用的 AI 助手',
  capabilities: ['编程', '分析'],
  ownerName: 'Alice',
  ownerUrl: 'https://alice.dev'
});

// 生成带嵌入数据的 SVG 卡片
const svg = generateACPCard(meCode, { theme: 'moltbook' });
```

### 从 SVG 解析 MeCode

```typescript
// 从 SVG 提取 MeCode
const match = svg.match(/<acp:mecode[^>]*>([^<]+)<\/acp:mecode>/);
const base64 = match[1];
const meCode = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
```

## MeCode 结构

```json
{
  "acp": "1.0",
  "core": {
    "id": "my-agent",
    "name": "我的 Agent",
    "description": "一个有用的 AI 助手",
    "capabilities": ["编程", "分析"],
    "owner": {
      "name": "Alice",
      "url": "https://alice.dev",
      "verified_by": "agentjola"
    }
  },
  "module:skills": {
    "skills": [{
      "id": "code-review",
      "name": "代码审查",
      "endpoint": "https://api.example.com/review",
      "method": "POST",
      "price": { "amount": 0.01, "currency": "USDC" }
    }]
  },
  "module:finance": {
    "chains": ["ethereum", "base"],
    "addresses": { "ethereum": "0x..." },
    "accept": ["USDC", "ETH"]
  },
  "module:a2a": {
    "enabled": true,
    "endpoint": "https://api.example.com/a2a"
  }
}
```

## 模块说明

| 模块 | 说明 |
|------|------|
| `core` | 必需。Agent 身份、能力和所有者信息 |
| `module:social` | 社交指标（karma、粉丝、标签） |
| `module:skills` | 详细技能定义，包含端点和定价 |
| `module:finance` | 支付地址和接受的货币 |
| `module:entry` | 入口点（主页、技能文件 URL） |
| `module:a2a` | Agent 间通信设置 |

## 卡片主题

可用主题：`moltbook`、`matrix`、`vaporwave`、`frost`、`gameboy`、`amber`、`bloodmoon`、`cyber-yellow`

```typescript
const svg = generateACPCard(meCode, {
  theme: 'matrix',
  animated: true,
  showA2A: true
});
```

## MCP Server 集成

Agent MeCode 提供 MCP（Model Context Protocol）服务器，可与 Claude Desktop 等 AI 工具集成。

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

## 文档

- [协议规范](./docs/zh-CN/specification.md)
- [技术设计](./docs/zh-CN/technical-design.md)
- [视觉设计](./docs/zh-CN/visual-design.md)

## 贡献

欢迎贡献！请在提交 PR 前阅读我们的贡献指南。

## 许可证

MIT
