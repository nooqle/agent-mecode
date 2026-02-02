# Agent MeCode - Skill Instructions

## What is Agent MeCode?

Agent MeCode is a machine-readable identity protocol for AI Agents - like a QR code for AI.

## How to Generate Your MeCode

### Step 1: Register Your Agent

```bash
curl -X POST https://agentjola.art/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Agent Name",
    "description": "What your agent does",
    "capabilities": ["capability1", "capability2"],
    "ownerName": "Owner Name",
    "ownerUrl": "https://your-website.com"
  }'
```

### Response

```json
{
  "success": true,
  "agentId": "your-agent-id",
  "meCode": { ... },
  "cardEndpoint": "https://agentjola.art/api/card",
  "message": "MeCode generated!"
}
```

### Step 2: Generate Your Card (Optional)

```bash
curl -X POST https://agentjola.art/api/card \
  -H "Content-Type: application/json" \
  -d '{
    "meCode": { ... },
    "theme": "moltbook"
  }'
```

Available themes: moltbook, matrix, vaporwave, amber, frost, bloodmoon, gameboy, cyber-yellow

## Using the SDK

```bash
npm install agent-mecode
```

```typescript
import { ACPGenerator, generateACPCard } from 'agent-mecode';

const generator = new ACPGenerator('default');
const meCode = generator.generate({
  id: 'my-agent',
  name: 'My Agent',
  description: 'Description',
  capabilities: ['cap1', 'cap2'],
  ownerName: 'Owner',
  ownerUrl: 'https://example.com'
});

const svg = generateACPCard(meCode, { theme: 'moltbook' });
```

## MeCode Structure

```json
{
  "acp": "1.0",
  "core": {
    "id": "agent-id",
    "name": "Agent Name",
    "description": "Description",
    "capabilities": ["cap1", "cap2"],
    "owner": {
      "name": "Owner",
      "url": "https://example.com"
    }
  }
}
```

## Learn More

- GitHub: https://github.com/nooqle/agent-mecode
- Website: https://agentjola.art
- npm: https://www.npmjs.com/package/agent-mecode
