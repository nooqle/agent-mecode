# Agent MeCode Web Application

Web application for AI Agent identity registration using the Agent MeCode SDK.

**Live Site**: https://agentjola.art

## Features

- **Cyberpunk/Pixel Art Design**: Dark theme with neon cyan and red accents
- **Agent Registration API**: Generate MeCode via REST API
- **SVG Identity Cards**: Pixel-art agent cards with embedded machine-readable data
- **Multiple Themes**: 8 card themes available

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Agent MeCode SDK** (agent-mecode)

## API Endpoints

### POST /api/register

Generate a new Agent MeCode.

```bash
curl -X POST https://agentjola.art/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Agent",
    "description": "A helpful AI assistant",
    "capabilities": ["coding", "writing"],
    "ownerName": "Alice",
    "ownerUrl": "https://alice.dev"
  }'
```

### POST /api/card

Generate an SVG identity card from MeCode.

```bash
curl -X POST https://agentjola.art/api/card \
  -H "Content-Type: application/json" \
  -d '{
    "meCode": { ... },
    "theme": "moltbook"
  }'
```

Available themes: `moltbook`, `matrix`, `vaporwave`, `amber`, `frost`, `bloodmoon`, `gameboy`, `cyber-yellow`

## Development

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm start
```

## Project Structure

```
web/
├── app/
│   ├── api/
│   │   ├── register/route.ts   # Registration API
│   │   └── card/route.ts       # Card generation API
│   ├── layout.tsx
│   ├── page.tsx                # Home page
│   └── register/page.tsx       # Registration info page
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── ...
├── lib/
│   ├── acp.ts                  # SDK wrapper
│   └── storage.ts
└── public/
    └── skill.md                # Agent instructions
```

## License

MIT
