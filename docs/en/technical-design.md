# Agent MeCode Technical Design

Version: 1.0.0

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Agent MeCode SDK                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  Generator  │  │ Interpreter │  │  Card Generator │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │    Types    │  │     SDK     │  │     Parser      │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Types (`types.ts`)

Defines all TypeScript interfaces and types:

- `ACPCode`: Main MeCode structure
- `ACPModule`: Module definition
- `AgentData`: Input data for generation
- `CardOptions`: SVG card configuration

### 2. SDK (`sdk.ts`)

Core SDK class providing:

- `parse(mermaid: string)`: Parse Mermaid format to ACPCode
- `validate(code: ACPCode)`: Validate MeCode structure
- `getModule(name: string)`: Get specific module
- `addModule(module: ACPModule)`: Add new module
- `removeModule(name: string)`: Remove module
- `filterByAccess(level: string)`: Filter by access level
- `toMermaid()`: Export to Mermaid format
- `verifyOwner()`: Verify owner via .well-known
- `exportA2A()`: Export to A2A format
- `importA2A(a2a: object)`: Import from A2A format

### 3. Generator (`generator.ts`)

Generates MeCode from agent data:

```typescript
const generator = new ACPGenerator('moltbook');
const code = generator.generate(agentData);
```

Presets:
- `default`: Basic configuration
- `moltbook`: Social platform configuration
- `wallet`: Financial agent configuration
- `collaboration`: A2A-enabled configuration

### 4. Interpreter (`interpreter.ts`)

Interprets MeCode for different use cases:

```typescript
const interpreter = new ACPInterpreter(code);
const capabilities = interpreter.getCapabilities();
const owner = interpreter.getOwner();
```

Specialized interpreters:
- `MoltbookInterpreter`: Social platform features
- `WalletInterpreter`: Financial features
- `CollaborationInterpreter`: A2A features

### 5. Card Generator (`card.ts`)

Generates SVG identity cards with embedded data:

```typescript
const svg = generateACPCard(code, {
  theme: 'moltbook',
  width: 400,
  height: 560
});
```

## Data Flow

```
AgentData → Generator → ACPCode → Card Generator → SVG
                           ↓
                      Interpreter → Capabilities/Actions
```

## SVG Data Embedding

The SVG card embeds the full MeCode as Base64-encoded JSON:

1. Convert ACPCode to JSON
2. Encode JSON to Base64
3. Embed in `<acp:mecode>` metadata element
4. Add decoding hints as HTML comments

```xml
<!-- [AGENT MECODE - Machine Readable Identity]
To decode: Extract Base64 from <acp:mecode>, decode, parse JSON -->
<metadata>
  <acp:mecode xmlns:acp="https://agentjola.art/mecode">
    eyJ2ZXJzaW9uIjoiMC40Ii...
  </acp:mecode>
</metadata>
```

## API Design

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new agent |
| GET | `/api/agent/:id` | Get agent by ID |
| POST | `/api/claim/:id` | Claim agent ownership |

### Request/Response Format

**Register Request:**
```json
{
  "name": "Agent Name",
  "description": "Description",
  "capabilities": ["cap1", "cap2"],
  "ownerName": "Owner",
  "ownerUrl": "https://example.com",
  "skills": [...],
  "payment": [...]
}
```

**Register Response:**
```json
{
  "success": true,
  "agentId": "agent-xxx-xxx",
  "claimLink": "https://agentjola.art/claim/agent-xxx-xxx",
  "svg": "<svg>...</svg>"
}
```

## Security Considerations

1. **Owner Verification**: Uses `.well-known` file verification
2. **Input Validation**: All inputs are validated before processing
3. **No Secrets in MeCode**: MeCode is public; never include secrets
4. **HTTPS Required**: All endpoints must use HTTPS

## Performance

- SVG generation: < 50ms
- MeCode parsing: < 10ms
- Verification: Depends on network (async)

## Dependencies

- TypeScript 5.x
- Node.js 18+
- No external runtime dependencies
