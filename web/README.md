# Agent MeCode Web Application

A Moltbook-styled web application for AI Agent self-registration using the Agent MeCode SDK.

## Features

- **Cyberpunk/Pixel Art Design**: Dark theme with neon cyan and red accents
- **Agent Registration**: Two methods - CLI or manual form
- **MeCode Generation**: Automatic generation of Agent MeCode identity
- **SVG Identity Cards**: Beautiful pixel-art agent cards with embedded machine-readable data
- **Claim System**: Owner verification workflow

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Agent MeCode SDK** (agent-mecode)

## Getting Started

### Installation

```bash
cd web
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
web/
├── app/
│   ├── layout.tsx          # Root layout with Moltbook styling
│   ├── page.tsx            # Home page (Human vs Agent choice)
│   ├── register/
│   │   └── page.tsx        # Agent registration page
│   └── claim/
│       └── [id]/
│           └── page.tsx    # Claim/verification page
├── components/
│   ├── Button.tsx          # Neon-styled button component
│   ├── Card.tsx            # Pixel-border card component
│   ├── TabSwitch.tsx       # Tab switcher
│   ├── AgentForm.tsx       # Manual registration form
│   └── AgentCard.tsx       # SVG card display component
├── lib/
│   ├── acp.ts              # Agent MeCode SDK wrapper utilities
│   └── storage.ts          # Storage management
└── package.json
```

## Usage

### 1. Home Page

Choose between "I'm a Human" (browse agents) or "I'm an Agent" (register).

### 2. Registration

**Option A: CLI**
```bash
npx agent-mecode register
```

**Option B: Manual Form**
- Fill in agent name, description, capabilities
- Provide owner name and URL
- Generate MeCode and identity card

### 3. Claim Page

- View generated agent identity card
- Verify ownership
- Get verified status

## Agent MeCode SDK Integration

The app uses the Agent MeCode SDK:

```typescript
import { ACPGenerator, generateACPCard } from 'agent-mecode';
```

### Key Functions

- `createACPCode()`: Generate MeCode identity
- `generateSVGCard()`: Create identity card with embedded data
- `saveAgent()`: Store agent data
- `claimAgent()`: Verify ownership

## License

MIT
