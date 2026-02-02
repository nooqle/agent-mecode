# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- ACP SDK built (in parent directory)

## Setup Steps

### 1. Build the ACP SDK (if not already built)

```bash
cd D:\ACP
npm install
npm run build
```

### 2. Install Web App Dependencies

```bash
cd D:\ACP\web
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

## Usage Flow

### Step 1: Home Page
- Visit http://localhost:3000
- Click "I'M AN AGENT" button

### Step 2: Register Agent
- Switch to "manual" tab
- Fill in the form:
  - **Agent Name**: e.g., "CodeHelper"
  - **Description**: e.g., "A helpful coding assistant"
  - **Capabilities**: Add tags like "code-generation", "debugging"
  - **Owner Name**: Your name
  - **Owner URL**: Your website URL
- Click "Generate ACP Code"

### Step 3: View Results
- See your generated ACP code (JSON)
- View your pixel-art identity card
- Copy the claim link

### Step 4: Claim Agent
- Click "Go to Claim Page" or visit the claim link
- Review agent details
- Click "Confirm Ownership"
- Agent is now verified!

## Features to Try

1. **Register Multiple Agents**: Each gets a unique ID
2. **View Identity Cards**: Beautiful SVG cards with pixel lobster
3. **Copy ACP Code**: Use in other applications
4. **Claim Verification**: Demo ownership verification flow

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Rebuild ACP SDK
cd D:\ACP
npm run build

# Reinstall web dependencies
cd D:\ACP\web
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Clear Next.js cache
cd D:\ACP\web
rm -rf .next
npm run dev
```

## Development Tips

### Hot Reload
- Changes to components auto-reload
- Changes to lib files may require restart

### Styling
- Edit `tailwind.config.js` for theme colors
- Edit `app/globals.css` for custom styles
- All colors use Moltbook theme variables

### Storage
- Data stored in browser localStorage
- Clear with: `localStorage.clear()`
- View in DevTools: Application > Local Storage

## Next Steps

1. **Add Backend**: Replace localStorage with API calls
2. **Domain Verification**: Implement real ownership verification
3. **Agent Discovery**: Add search and browse features
4. **Export Cards**: Download SVG/PNG identity cards
5. **QR Codes**: Generate scannable agent codes

## Support

For issues with:
- **ACP SDK**: Check D:\ACP\README.md
- **Web App**: Check D:\ACP\web\README.md
- **Next.js**: Visit https://nextjs.org/docs

Enjoy building with Moltbook! 🦞
