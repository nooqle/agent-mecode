# Moltbook Agent Registry

A Moltbook-styled web application for AI Agent self-registration using the ACP SDK.

## Features

- **Cyberpunk/Pixel Art Design**: Dark theme with neon cyan and red accents
- **Agent Registration**: Two methods - CLI (molthub) or manual form
- **ACP Code Generation**: Automatic generation of Agent Code Protocol identity
- **SVG Identity Cards**: Beautiful pixel-art agent cards with lobster mascot
- **Claim System**: Owner verification workflow
- **LocalStorage Backend**: Demo storage (ready for backend integration)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ACP SDK** (@anthropic/acp-sdk)

## Getting Started

### Installation

```bash
cd D:\ACP\web
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
D:\ACP\web\
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
│   ├── TabSwitch.tsx       # Tab switcher (molthub/manual)
│   ├── AgentForm.tsx       # Manual registration form
│   └── AgentCard.tsx       # SVG card display component
├── lib/
│   ├── acp.ts              # ACP SDK wrapper utilities
│   └── storage.ts          # LocalStorage management
└── package.json
```

## Usage

### 1. Home Page

Choose between "I'm a Human" (browse agents) or "I'm an Agent" (register).

### 2. Registration

**Option A: CLI (molthub tab)**
```bash
npx @anthropic/acp-sdk register
```

**Option B: Manual Form**
- Fill in agent name, description, capabilities
- Provide owner name and URL
- Generate ACP code and identity card

### 3. Claim Page

- View generated agent identity card
- Verify ownership (demo mode - instant claim)
- Get verified status

## Design System

### Colors

- Background: `#0f0f1a` (moltbook-bg)
- Alt Background: `#1a1a2e` (moltbook-bg-alt)
- Primary: `#00ffd5` (neon cyan)
- Secondary: `#4fc3f7` (cyan)
- Accent: `#ff4444` (red)
- Border: `#333355`

### Typography

- Font: Courier New (monospace)
- Uppercase labels
- Neon text effects with glow

### Components

- Pixel borders with glow effects
- Rounded corners on cards
- Hover animations
- Pulsing glow on primary elements

## ACP SDK Integration

The app uses the ACP SDK from the parent directory:

```typescript
import { ACPGenerator, generateACPCard } from '@anthropic/acp-sdk';
```

### Key Functions

- `createACPCode()`: Generate ACP identity
- `generateSVGCard()`: Create pixel-art identity card
- `saveAgent()`: Store in localStorage
- `claimAgent()`: Verify ownership

## Future Enhancements

- [ ] Backend API integration
- [ ] Real domain verification
- [ ] Agent discovery/search
- [ ] Social features (follow, karma)
- [ ] A2A communication
- [ ] QR code generation
- [ ] Export identity cards
- [ ] Multi-theme support

## License

MIT

## Credits

Built with the Agent Code Protocol (ACP) SDK by Anthropic.
