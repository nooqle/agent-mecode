<p align="center">
  <img src="./assets/logo.svg" alt="Agent MeCode Logo" width="180" />
</p>

<h1 align="center">Agent MeCode</h1>

<p align="center">
  <strong>QR Code for AI Agents</strong> - Machine-readable identity for AI Agents
</p>

<p align="center">
  <a href="https://github.com/nooqle/agent-mecode/stargazers"><img src="https://img.shields.io/github/stars/nooqle/agent-mecode?style=social" alt="GitHub Stars"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/agent-mecode"><img src="https://img.shields.io/npm/v/agent-mecode.svg" alt="npm version"></a>
</p>

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">中文</a>
</p>

---

## What is Agent MeCode?

Just like humans use QR codes to share information, Agent MeCode lets AI Agents share their identity, capabilities, and payment information.

```
Human World: QR Code → Scan → Get Info → Action
Agent World: MeCode  → Parse → Get Capabilities → Interact/Pay
```

**A MeCode card provides:**
- Human-readable visual design (SVG card)
- Machine-readable embedded data (Base64 JSON)

---

## Who Should Use This?

| Role | Need | Recommended Method |
|------|------|-------------------|
| **End Users** | Generate an identity card for my Agent | Use online platform |
| **Platform Developers** | Provide MeCode generation in my platform | Use SDK |
| **AI Agents** | Read other Agents' MeCode information | Parse SVG |

---

## Scenario 1: Generate MeCode

### Method 1: Online Platform (Easiest)

Visit [https://agentjola.art](https://agentjola.art) and fill out the form.

### Method 2: API (Programmatic)

For batch generation or system integration.

```bash
curl -X POST https://agentjola.art/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Agent",
    "description": "A helpful AI assistant",
    "capabilities": ["coding", "analysis"],
    "ownerName": "Alice",
    "ownerUrl": "https://alice.dev"
  }'
```

**Response:**
```json
{
  "success": true,
  "agentId": "my-agent-xxx",
  "meCode": { ... },
  "cardEndpoint": "https://agentjola.art/api/card",
  "message": "MeCode generated!"
}
```

**Generate Card:**
```bash
curl -X POST https://agentjola.art/api/card \
  -H "Content-Type: application/json" \
  -d '{"meCode": {...}, "theme": "moltbook"}'
```

### Method 3: SDK (Full Control)

For platform developers who need custom generation logic.

```bash
npm install agent-mecode
```

```typescript
import { ACPGenerator, generateACPCard } from 'agent-mecode';

// 1. Create generator
const generator = new ACPGenerator('default');

// 2. Generate MeCode data
const meCode = generator.generate({
  id: 'my-agent',
  name: 'My Agent',
  description: 'A helpful AI assistant',
  capabilities: ['coding', 'analysis'],
  ownerName: 'Alice',
  ownerUrl: 'https://alice.dev'
});

// 3. Generate SVG card (with embedded MeCode data)
const svg = generateACPCard(meCode, { theme: 'moltbook' });
```

---

## Scenario 2: Parse MeCode (For AI Agents)

When your AI Agent receives a MeCode SVG card, follow these steps:

### Step 1: Find Embedded Data

MeCode data is embedded in the SVG's `<acp:mecode>` tag:

```xml
<svg ...>
  <metadata>
    <acp:mecode xmlns:acp="https://agentjola.art/mecode">
      eyJhY3AiOiIxLjAiLCJjb3JlIjp7...  <!-- Base64 encoded JSON -->
    </acp:mecode>
  </metadata>
  ...
</svg>
```

### Step 2: Decode Data

```typescript
// Extract Base64 data from SVG
const match = svg.match(/<acp:mecode[^>]*>([^<]+)<\/acp:mecode>/);
const base64Data = match[1].trim();

// Decode to JSON
const meCode = JSON.parse(
  Buffer.from(base64Data, 'base64').toString('utf-8')
);
```

### Step 3: Use Data

After decoding, you'll have complete Agent information:

```javascript
// Get basic info
console.log(meCode.core.name);        // "My Agent"
console.log(meCode.core.capabilities); // ["coding", "analysis"]

// Get skill endpoints (if available)
if (meCode['module:skills']) {
  const skills = meCode['module:skills'].skills;
  // Call Agent's skill API
}

// Get payment addresses (if available)
if (meCode['module:finance']) {
  const addresses = meCode['module:finance'].addresses;
  // Make payment
}
```

---

## MeCode Data Structure

### Core (Required)

Every MeCode must contain a `core` module:

```json
{
  "acp": "1.0",
  "core": {
    "id": "my-agent",
    "name": "My Agent",
    "description": "Agent description",
    "capabilities": ["capability1", "capability2"],
    "owner": {
      "name": "Owner Name",
      "url": "https://owner.com"
    }
  }
}
```

### Optional Modules

| Module | Purpose | Example Fields |
|--------|---------|----------------|
| `module:skills` | Define callable skills | endpoints, pricing |
| `module:finance` | Payment info | chains, addresses |
| `module:social` | Social info | karma, followers |
| `module:a2a` | Agent-to-Agent communication | endpoint, protocol |
| `module:entry` | Entry links | homepage, source |

### Complete Example

```json
{
  "acp": "1.0",
  "core": {
    "id": "code-helper",
    "name": "Code Helper",
    "description": "Professional code review assistant",
    "capabilities": ["code-review", "debugging"],
    "owner": {
      "name": "Alice",
      "url": "https://alice.dev"
    }
  },
  "module:skills": {
    "skills": [{
      "id": "review",
      "name": "Code Review",
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

## Examples

See the [examples/](./examples/) directory for more:

- [Basic Generation](./examples/01-basic-generation.ts) - Generate simple MeCode
- [Full MeCode](./examples/02-full-mecode.ts) - MeCode with all modules
- [Parse MeCode](./examples/03-parse-mecode.ts) - Parse data from SVG
- [Call Skill](./examples/04-call-skill.ts) - Call Agent's skill endpoint

---

## Advanced Usage

### Card Themes

```typescript
const svg = generateACPCard(meCode, {
  theme: 'matrix',    // Options: moltbook, matrix, vaporwave, frost, gameboy
  animated: true,     // Enable animations
  showA2A: true       // Show A2A info
});
```

### MCP Integration

Integrate Agent MeCode with Claude Desktop:

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

## Documentation

- [Protocol Specification](./docs/en/specification.md) | [中文](./docs/zh-CN/specification.md)
- [Technical Design](./docs/en/technical-design.md) | [中文](./docs/zh-CN/technical-design.md)
- [Visual Design](./docs/en/visual-design.md) | [中文](./docs/zh-CN/visual-design.md)

---

## Star History

<a href="https://star-history.com/#nooqle/agent-mecode&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=nooqle/agent-mecode&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=nooqle/agent-mecode&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=nooqle/agent-mecode&type=Date" />
 </picture>
</a>

---

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Acknowledgments

Thanks to these projects and communities for inspiration:

- [A2A Protocol](https://github.com/google/a2a) - Agent-to-Agent communication protocol
- [MCP](https://modelcontextprotocol.io/) - Model Context Protocol

## License

[MIT](./LICENSE)
