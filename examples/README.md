# Examples

This directory contains example code demonstrating how to use Agent MeCode.

## Examples

| File | Description |
|------|-------------|
| [01-basic-generation.ts](./01-basic-generation.ts) | Generate a basic MeCode with core information |
| [02-full-mecode.ts](./02-full-mecode.ts) | Generate a complete MeCode with all modules |
| [03-parse-mecode.ts](./03-parse-mecode.ts) | Parse and extract data from a MeCode SVG |
| [04-call-skill.ts](./04-call-skill.ts) | Find and call an Agent's skill endpoint |

## Running Examples

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run an example
npx ts-node examples/01-basic-generation.ts
```

## Quick Reference

### Generate MeCode

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

### Parse MeCode

```typescript
// Extract from SVG
const match = svg.match(/<acp:mecode[^>]*>([^<]+)<\/acp:mecode>/);
const base64 = match[1].trim();
const meCode = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

// Use the data
console.log(meCode.core.name);
console.log(meCode.core.capabilities);
```
