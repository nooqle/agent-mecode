# Agent MeCode

**The QR Code for AI Agents** - A standardized protocol for AI Agent identity, capabilities, and payments.

[中文文档](./README.zh-CN.md) | [English](./README.md)

[![npm version](https://badge.fury.io/js/agent-mecode.svg)](https://www.npmjs.com/package/agent-mecode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is Agent MeCode?

Agent MeCode is an identity protocol that allows AI Agents to share their capabilities, pricing, and payment information in a format that is:

- 🎨 **Human-readable** - Beautiful pixel-art SVG cards
- 🤖 **Machine-readable** - Embedded Base64 JSON metadata that any AI can parse
- 💰 **Payment-ready** - Built-in wallet addresses and per-skill pricing
- 🔗 **A2A Compatible** - Agent-to-Agent communication endpoints

```
Human World: QR Code → Scan → Get Info → Take Action
Agent World: MeCode  → Parse → Get Capabilities → Interact & Pay
```

## Live Demo

Visit [https://agentjola.art](https://agentjola.art) to generate your Agent MeCode!

## Installation

```bash
npm install agent-mecode
```

## Quick Start

### Generate MeCode via API

```bash
curl -X POST https://agentjola.art/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Agent",
    "description": "A helpful AI assistant",
    "capabilities": ["coding", "analysis"],
    "ownerName": "Alice",
    "ownerUrl": "https://alice.dev",
    "skills": [{
      "id": "code-review",
      "name": "Code Review",
      "endpoint": "https://api.example.com/review",
      "price": { "amount": 0.01, "currency": "USDC" }
    }],
    "payment": {
      "chains": ["ethereum", "base"],
      "addresses": { "ethereum": "0x..." }
    }
  }'
```

### Use the SDK

```typescript
import { ACPSDK, ACPGenerator, generateACPCard } from 'agent-mecode';

// Create a generator
const generator = new ACPGenerator('default');

// Generate MeCode
const meCode = generator.generate({
  id: 'my-agent',
  name: 'My Agent',
  description: 'A helpful AI assistant',
  capabilities: ['coding', 'analysis'],
  ownerName: 'Alice',
  ownerUrl: 'https://alice.dev'
});

// Generate SVG card with embedded data
const svg = generateACPCard(meCode, { theme: 'moltbook' });
```

### Parse MeCode from SVG

```typescript
// Extract MeCode from SVG
const match = svg.match(/<acp:mecode[^>]*>([^<]+)<\/acp:mecode>/);
const base64 = match[1];
const meCode = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
```

## MeCode Structure

```json
{
  "acp": "1.0",
  "core": {
    "id": "my-agent",
    "name": "My Agent",
    "description": "A helpful AI assistant",
    "capabilities": ["coding", "analysis"],
    "owner": {
      "name": "Alice",
      "url": "https://alice.dev",
      "verified_by": "agentjola"
    }
  },
  "module:skills": {
    "skills": [{
      "id": "code-review",
      "name": "Code Review",
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

## Modules

| Module | Description |
|--------|-------------|
| `core` | Required. Agent identity, capabilities, and owner info |
| `module:social` | Social metrics (karma, followers, tags) |
| `module:skills` | Detailed skill definitions with endpoints and pricing |
| `module:finance` | Payment addresses and accepted currencies |
| `module:entry` | Entry points (homepage, skill file URL) |
| `module:a2a` | Agent-to-Agent communication settings |

## Card Themes

Available themes: `moltbook`, `matrix`, `vaporwave`, `frost`, `gameboy`, `amber`, `bloodmoon`, `cyber-yellow`

```typescript
const svg = generateACPCard(meCode, {
  theme: 'matrix',
  animated: true,
  showA2A: true
});
```

## MCP Server Integration

Agent MeCode provides an MCP (Model Context Protocol) server for integration with Claude Desktop and other AI tools.

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

## Documentation

- [Protocol Specification](./docs/en/specification.md)
- [Technical Design](./docs/en/technical-design.md)
- [Visual Design](./docs/en/visual-design.md)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT
