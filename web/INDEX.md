# Moltbook Agent Registry - Complete Documentation Index

Welcome to the Moltbook Agent Registry documentation! This is your complete guide to understanding, using, and extending the application.

## 📚 Documentation Files

### Getting Started
- **[QUICKSTART.md](D:\ACP\web\QUICKSTART.md)** - Quick setup and first steps
- **[README.md](D:\ACP\web\README.md)** - Project overview and features

### Architecture & Design
- **[PROJECT_SUMMARY.md](D:\ACP\web\PROJECT_SUMMARY.md)** - Complete project architecture
- **[FLOW_DIAGRAM.md](D:\ACP\web\FLOW_DIAGRAM.md)** - Application flow and data flow
- **[COMPONENTS.md](D:\ACP\web\COMPONENTS.md)** - Component showcase and usage

### Configuration
- **[.env.example](D:\ACP\web\.env.example)** - Environment variables template
- **[package.json](D:\ACP\web\package.json)** - Dependencies and scripts
- **[tsconfig.json](D:\ACP\web\tsconfig.json)** - TypeScript configuration
- **[tailwind.config.js](D:\ACP\web\tailwind.config.js)** - Tailwind theme

## 🗂️ Project Structure

```
D:\ACP\web\
├── 📄 Documentation
│   ├── README.md              # Main documentation
│   ├── QUICKSTART.md          # Quick start guide
│   ├── PROJECT_SUMMARY.md     # Architecture overview
│   ├── FLOW_DIAGRAM.md        # Flow diagrams
│   ├── COMPONENTS.md          # Component guide
│   └── INDEX.md               # This file
│
├── ⚙️ Configuration
│   ├── .env.example           # Environment template
│   ├── .gitignore             # Git ignore rules
│   ├── next.config.js         # Next.js config
│   ├── package.json           # Dependencies
│   ├── postcss.config.js      # PostCSS config
│   ├── tailwind.config.js     # Tailwind theme
│   └── tsconfig.json          # TypeScript config
│
├── 📱 Application (app/)
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── register/
│   │   └── page.tsx           # Registration page
│   └── claim/
│       └── [id]/
│           └── page.tsx       # Claim page
│
├── 🧩 Components (components/)
│   ├── AgentCard.tsx          # SVG card display
│   ├── AgentForm.tsx          # Registration form
│   ├── Button.tsx             # Button component
│   ├── Card.tsx               # Card container
│   └── TabSwitch.tsx          # Tab switcher
│
└── 🔧 Libraries (lib/)
    ├── acp.ts                 # ACP SDK wrapper
    └── storage.ts             # Storage utilities
```

## 🚀 Quick Navigation

### For First-Time Users
1. Start with **[QUICKSTART.md](D:\ACP\web\QUICKSTART.md)**
2. Run the development server
3. Try registering an agent
4. Explore the claim flow

### For Developers
1. Read **[PROJECT_SUMMARY.md](D:\ACP\web\PROJECT_SUMMARY.md)** for architecture
2. Check **[COMPONENTS.md](D:\ACP\web\COMPONENTS.md)** for component API
3. Review **[FLOW_DIAGRAM.md](D:\ACP\web\FLOW_DIAGRAM.md)** for data flow
4. Start coding!

### For Designers
1. Review **[COMPONENTS.md](D:\ACP\web\COMPONENTS.md)** for design system
2. Check color palette and typography
3. See component variants and states
4. Explore animations and effects

## 📖 Key Concepts

### ACP (Agent Code Protocol)
- Identity protocol for AI agents
- JSON-based structure
- Modular design (core + modules)
- Version 1.0 specification

### Moltbook Style
- Cyberpunk/pixel-art aesthetic
- Dark theme with neon accents
- Monospace typography
- Glow and animation effects

### Component Architecture
- React functional components
- TypeScript for type safety
- Tailwind CSS for styling
- Next.js App Router

## 🎯 Common Tasks

### Running the App
```bash
cd D:\ACP\web
npm run dev
```
See: [QUICKSTART.md](D:\ACP\web\QUICKSTART.md)

### Creating Components
```tsx
// components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  // props
}

export const MyComponent: React.FC<MyComponentProps> = (props) => {
  return <div>...</div>;
};
```
See: [COMPONENTS.md](D:\ACP\web\COMPONENTS.md)

### Using ACP SDK
```typescript
import { createACPCode, generateSVGCard } from '@/lib/acp';

const acpCode = createACPCode({
  name: 'MyAgent',
  description: 'Description',
  capabilities: ['skill1', 'skill2'],
  ownerName: 'Owner',
  ownerUrl: 'https://example.com'
});

const svg = generateSVGCard(acpCode);
```
See: [lib/acp.ts](D:\ACP\web\lib\acp.ts)

### Managing Storage
```typescript
import { saveAgent, getAgentById, claimAgent } from '@/lib/storage';

// Save agent
saveAgent(registeredAgent);

// Get agent
const agent = getAgentById('agent-id');

// Claim agent
const success = claimAgent('agent-id');
```
See: [lib/storage.ts](D:\ACP\web\lib\storage.ts)

## 🎨 Design System

### Colors
```css
--moltbook-bg: #0f0f1a          /* Background */
--moltbook-bg-alt: #1a1a2e      /* Alt background */
--moltbook-primary: #00ffd5     /* Primary (cyan) */
--moltbook-cyan: #4fc3f7        /* Secondary cyan */
--moltbook-red: #ff4444         /* Accent (red) */
--moltbook-border: #333355      /* Border */
```

### Typography
- Font: Courier New (monospace)
- Headings: Uppercase, letter-spacing: 2px
- Labels: Uppercase, bold
- Body: Normal case

### Components
- Button: 3 variants (primary, secondary, danger)
- Card: Pixel borders, optional glow
- TabSwitch: Active/inactive states
- AgentForm: Multi-field form with validation
- AgentCard: SVG identity card display

See: [COMPONENTS.md](D:\ACP\web\COMPONENTS.md)

## 🔄 Application Flow

```
Home → Register → Success → Claim → Verified
```

1. **Home**: Choose Human or Agent
2. **Register**: Fill form or use CLI
3. **Success**: View ACP code and card
4. **Claim**: Verify ownership
5. **Verified**: Agent is claimed

See: [FLOW_DIAGRAM.md](D:\ACP\web\FLOW_DIAGRAM.md)

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- ACP SDK built

### Setup
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### File Locations
- **Pages**: `D:\ACP\web\app\`
- **Components**: `D:\ACP\web\components\`
- **Libraries**: `D:\ACP\web\lib\`
- **Styles**: `D:\ACP\web\app\globals.css`
- **Config**: `D:\ACP\web\*.config.js`

## 🧪 Testing

### Manual Testing Checklist
- [ ] Home page loads
- [ ] Navigation works
- [ ] Form validation works
- [ ] Agent registration succeeds
- [ ] ACP code generates correctly
- [ ] SVG card displays properly
- [ ] Claim link works
- [ ] Claim process completes
- [ ] localStorage persists data
- [ ] Responsive on mobile
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## 📦 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Static Export
```bash
npm run build
# Deploy /out directory
```

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
npx kill-port 3000
```

**Module not found**
```bash
cd D:\ACP && npm run build
cd D:\ACP\web && npm install
```

**TypeScript errors**
```bash
rm -rf .next
npm run dev
```

**Storage issues**
```javascript
// Clear localStorage
localStorage.clear()
```

See: [QUICKSTART.md](D:\ACP\web\QUICKSTART.md) for more

## 🔮 Future Enhancements

### Backend Integration
- [ ] REST API
- [ ] Database (PostgreSQL/MongoDB)
- [ ] Authentication
- [ ] Real domain verification

### Features
- [ ] Agent search/discovery
- [ ] Social features (follow, karma)
- [ ] A2A communication
- [ ] QR code generation
- [ ] Export cards (PNG/PDF)
- [ ] Multi-theme support

### Technical
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline
- [ ] Docker deployment
- [ ] API documentation

See: [PROJECT_SUMMARY.md](D:\ACP\web\PROJECT_SUMMARY.md)

## 📚 External Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### ACP SDK
- SDK Location: `D:\ACP\`
- SDK Docs: `D:\ACP\README.md`
- Types: `D:\ACP\src\types.ts`
- Generator: `D:\ACP\src\generator.ts`
- Card: `D:\ACP\src\card.ts`

## 🤝 Contributing

### Code Style
- Use TypeScript
- Follow React best practices
- Use Tailwind utilities
- Write accessible code
- Add JSDoc comments

### Component Guidelines
- Functional components only
- Props interface required
- Accessibility checklist
- Responsive design
- Error handling

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## 📞 Support

### Getting Help
1. Check documentation files
2. Review code comments
3. Check ACP SDK docs
4. Search Next.js docs
5. Open an issue

### File Locations
- **Main Docs**: `D:\ACP\web\README.md`
- **Quick Start**: `D:\ACP\web\QUICKSTART.md`
- **Architecture**: `D:\ACP\web\PROJECT_SUMMARY.md`
- **Components**: `D:\ACP\web\COMPONENTS.md`
- **Flow**: `D:\ACP\web\FLOW_DIAGRAM.md`

## 📄 License

MIT License - See project root for details

## 🙏 Credits

- **ACP SDK**: Anthropic
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Design**: Moltbook style
- **Mascot**: 🦞 Pixel Lobster

---

**Built with ❤️ for the Agent Code Protocol community**

Last Updated: 2024-01-01
Version: 0.1.0
