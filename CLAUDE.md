# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 交流语言

与用户交流时请使用中文。

## Project Overview

ACP (Agent Code Protocol) is a protocol specification for AI Agent identity and interoperability - essentially "QR codes for AI Agents." It defines a standardized way for AI agents to share their identity, capabilities, reputation, and contact information.

**Protocol Version:** 0.4.0-draft

## Repository Structure

### Core Documents (v0.4 模块化设计)
- `acp-specification-v0.4.md` - 协议规范（模块化结构）
- `acp-technical-design-v0.4.md` - 技术实现指南
- `acp-schema-v0.4.json` - JSON Schema 验证
- `acp-visual-design.md` - 像素风视觉设计规范

### SDK & Implementation
- `acp-sdk.ts` - TypeScript SDK（解析、验证、生成、A2A 兼容）
- `acp-card-template-v0.4.ts` - SVG 卡片生成器（支持模块化结构）
- `acp-card-*.svg` - 示例卡片（moltbook, matrix, vaporwave, frost, gameboy）

### Legacy (v0.3)
- `acp-specification-v0.3.md` - 旧版规范
- `acp-technical-design-v0.3.md` - 旧版技术文档
- `acp-card-template.ts` - 旧版卡片生成器

## Key Technical Concepts

### v0.4 模块化结构

```json
{
  "acp": "1.0",
  "core": {
    "id": "moltbook:alice",
    "name": "Alice",
    "capabilities": ["assistant"],
    "owner": { "name": "Alex", "url": "https://alex.dev" },
    "sig": "..."
  },
  "module:social": { "_access": "public", "karma": 100 },
  "module:entry": { "_access": "public", "source": "..." }
}
```

**Core（必选）**：id, name, capabilities, owner, sig
**模块（可选）**：module:social, module:finance, module:contact, module:entry, module:a2a

### 访问控制
- `public` - 公开可见
- `verified` - 平台可覆盖
- `private` - 需 SDK 鉴权

### Owner 验证
1. **双向链接验证**：Owner URL 声明拥有该 Agent
2. **平台背书**：`owner.verified_by` 标记

## SDK 使用

```typescript
import { ACPSDK, ACPGenerator } from './acp-sdk';

const sdk = new ACPSDK();

// 解析
const code = sdk.parse(mermaidCode);

// 验证
const result = sdk.validate(code);

// 生成
const generator = new ACPGenerator('moltbook');
const newCode = generator.generate({ id: '...', name: '...', ... });

// 转换为 Mermaid
const mermaid = sdk.toMermaid(code);

// 导出 A2A
const agentCard = sdk.exportA2A(code);
```

## Card Generation

```typescript
import { generateACPCard } from './acp-card-template-v0.4';

// 支持 v0.4 模块化结构和 v0.3 旧版结构
const svg = generateACPCard(acpCode, { theme: 'moltbook' });
```

Available themes: moltbook, matrix, vaporwave, frost, gameboy, amber, bloodmoon, cyber-yellow

## Platform Integrations
- **Moltbook** - AI Agent 社交网络
- **A2A Protocol** - Agent-to-Agent 互操作
- **MCP** - Model Context Protocol 工具集成
