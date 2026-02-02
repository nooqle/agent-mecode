# Agent MeCode Protocol Specification

Version: 1.0.0

## Overview

Agent MeCode is a standardized identity protocol for AI Agents, functioning as a "QR code for AI" - readable by both humans (visual) and machines (embedded data).

## Protocol Structure

### Core Module (Required)

```
core {
  version: string      // Protocol version (e.g., "0.4")
  id: string           // Unique agent identifier
  name: string         // Agent display name
  description: string  // Agent description
  capabilities: string[] // List of capabilities
}
```

### Owner Module (Required)

```
owner {
  name: string         // Owner/creator name
  url: string          // Owner website URL
  verified: boolean    // Verification status
}
```

### Optional Modules

#### module:skills
```
module:skills {
  endpoints: Endpoint[]
}

Endpoint {
  name: string
  url: string
  method: "GET" | "POST"
  description: string
  pricing?: {
    amount: number
    currency: string
    unit: string
  }
  input?: Schema
  output?: Schema
}
```

#### module:finance
```
module:finance {
  payment: PaymentMethod[]
}

PaymentMethod {
  type: "crypto" | "fiat" | "api"
  address?: string
  network?: string
  currency?: string
}
```

#### module:a2a
```
module:a2a {
  endpoint: string     // A2A communication endpoint
  protocol: string     // Protocol version
  capabilities: string[] // Supported A2A capabilities
}
```

#### module:social
```
module:social {
  platform: string     // Platform name
  karma: number        // Reputation score
  followers: number    // Follower count
  following: number    // Following count
  tags: string[]       // Agent tags
}
```

#### module:entry
```
module:entry {
  homepage: string     // Agent homepage URL
  source: string       // Source code URL
}
```

## SVG Card Format

Agent MeCode generates SVG identity cards that embed the full MeCode data in Base64 format within the SVG metadata.

### Structure

```xml
<svg xmlns="http://www.w3.org/2000/svg" ...>
  <!-- Decoding instructions for AI agents -->
  <metadata>
    <acp:mecode xmlns:acp="https://agentjola.art/mecode">
      [BASE64_ENCODED_JSON]
    </acp:mecode>
  </metadata>
  <!-- Visual elements -->
</svg>
```

### Decoding Process

1. Parse the SVG document
2. Locate the `<acp:mecode>` element in metadata
3. Extract the Base64 content
4. Decode Base64 to JSON string
5. Parse JSON to get the full MeCode object

## Access Levels

| Level | Description |
|-------|-------------|
| `public` | Visible to all agents and humans |
| `verified` | Only visible to verified agents |
| `private` | Only visible to owner |

## Verification

Owner verification is performed by checking for a `.well-known/agent-mecode.json` file at the owner's URL containing the agent ID.

```json
{
  "agents": ["agent-id-1", "agent-id-2"]
}
```

## A2A Integration

Agent MeCode is compatible with the A2A (Agent-to-Agent) protocol. Use `exportA2A()` to convert a MeCode to A2A format.

## Version History

| Version | Changes |
|---------|---------|
| 0.4 | Added skills, finance, a2a modules |
| 0.3 | Added social module |
| 0.2 | Added entry module |
| 0.1 | Initial specification |
