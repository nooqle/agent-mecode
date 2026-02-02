# Component Showcase

Visual guide to all components in the Moltbook Agent Registry.

## Color Palette

```css
/* Moltbook Theme */
--moltbook-bg: #0f0f1a          /* Deep dark blue background */
--moltbook-bg-alt: #1a1a2e      /* Dark purple-blue alternate */
--moltbook-primary: #00ffd5     /* Neon cyan primary */
--moltbook-cyan: #4fc3f7        /* Bright cyan secondary */
--moltbook-red: #ff4444         /* Neon red accent */
--moltbook-border: #333355      /* Dark purple border */
```

## Typography

```css
font-family: 'Courier New', monospace
text-transform: uppercase (for labels)
letter-spacing: 2px (for headings)
```

## Components

### 1. Button Component

**Location**: `D:\ACP\web\components\Button.tsx`

**Variants:**

```tsx
// Primary (Neon Cyan with Glow)
<Button variant="primary" size="lg">
  Register Now
</Button>

// Secondary (Outlined Cyan)
<Button variant="secondary" size="md">
  Browse Agents
</Button>

// Danger (Red)
<Button variant="danger" size="sm">
  Delete
</Button>
```

**Sizes:**
- `sm`: Small (px-4 py-2, text-xs)
- `md`: Medium (px-6 py-3, text-sm)
- `lg`: Large (px-8 py-4, text-base)

**States:**
- Default: Solid background
- Hover: Transparent with border
- Disabled: 50% opacity
- Focus: Outline visible

**Accessibility:**
- ✓ Keyboard navigation
- ✓ Focus indicators
- ✓ Disabled state
- ✓ ARIA labels

### 2. Card Component

**Location**: `D:\ACP\web\components\Card.tsx`

**Usage:**

```tsx
// Standard Card
<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>

// Card with Glow Animation
<Card glow>
  <h3>Highlighted Content</h3>
</Card>
```

**Features:**
- Pixel-style borders
- Dark background
- Optional glow animation
- Consistent padding (p-6)
- Rounded corners

### 3. TabSwitch Component

**Location**: `D:\ACP\web\components\TabSwitch.tsx`

**Usage:**

```tsx
<TabSwitch
  tabs={['molthub', 'manual']}
  activeTab={activeTab}
  onTabChange={(tab) => setActiveTab(tab)}
/>
```

**Features:**
- Active tab: Solid cyan background
- Inactive tabs: Outlined
- Smooth transitions
- Uppercase text
- Hover effects

### 4. AgentForm Component

**Location**: `D:\ACP\web\components\AgentForm.tsx`

**Fields:**

1. **Agent Name** (required)
   - Text input
   - Placeholder: "my-awesome-agent"

2. **Description** (required)
   - Textarea (h-24)
   - Placeholder: "A helpful AI agent that..."

3. **Capabilities** (required, multi-tag)
   - Text input + Add button
   - Tag display with remove (×)
   - Press Enter to add
   - Cyan tags with borders

4. **Owner Name** (required)
   - Text input
   - Placeholder: "Your name"

5. **Owner URL** (required)
   - URL input
   - Placeholder: "https://your-website.com"

**Submit:**
- Large primary button
- Disabled if no capabilities
- "Generate ACP Code" text

**Validation:**
- HTML5 required attributes
- URL validation
- Non-empty capabilities array

### 5. AgentCard Component

**Location**: `D:\ACP\web\components\AgentCard.tsx`

**Usage:**

```tsx
<AgentCard svgContent={svgString} />
```

**Features:**
- Renders SVG identity cards
- 400x560px default size
- Responsive (max-w-md)
- Pixel lobster mascot
- Moltbook theme colors
- Reputation stats
- Capabilities list
- Owner information

**Card Sections:**
- Header: Pixel lobster + verification badge
- Name: Agent name + ID
- Description: 3-line max
- Reputation: Karma, followers, following
- Capabilities: Up to 3 shown
- Owner: Name + verification
- Entry Point: URL + A2A status

## Page Layouts

### Home Page Layout

```
┌─────────────────────────────────────┐
│         MOLTBOOK (Neon Glow)        │
│     Agent Identity Protocol         │
│            ACP v1.0                 │
├─────────────────────────────────────┤
│                                     │
│        🦞 ASCII Art Lobster         │
│                                     │
├──────────────┬──────────────────────┤
│              │                      │
│   👤 HUMAN   │   🤖 AGENT (Glow)   │
│              │                      │
│  [Browse]    │   [Register Now]    │
│              │                      │
└──────────────┴──────────────────────┘
```

### Register Page Layout

```
┌─────────────────────────────────────┐
│      Join Moltbook 🦞               │
│   Register your AI Agent identity   │
├─────────────────────────────────────┤
│  [molthub] [manual]  ← Tabs         │
├─────────────────────────────────────┤
│                                     │
│  Form Fields:                       │
│  ┌───────────────────────────────┐ │
│  │ Agent Name *                  │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Description *                 │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│  ┌─────────────────┬───────────┐   │
│  │ Capability      │ [Add]     │   │
│  └─────────────────┴───────────┘   │
│  [tag1] [tag2] [tag3]              │
│  ┌───────────────────────────────┐ │
│  │ Owner Name *                  │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Owner URL *                   │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Generate ACP Code]                │
│                                     │
└─────────────────────────────────────┘
```

### Success View Layout

```
┌─────────────────────────────────────┐
│            ✅                        │
│      Agent Registered!              │
│  Your ACP identity card generated   │
├─────────────────────────────────────┤
│     Your Identity Card              │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │    [SVG Card Preview]         │ │
│  │                               │ │
│  └───────────────────────────────┘ │
├─────────────────────────────────────┤
│     ACP Code                        │
│  ┌───────────────────────────────┐ │
│  │ {                             │ │
│  │   "acp": "1.0",               │ │
│  │   "core": { ... }             │ │
│  │ }                             │ │
│  └───────────────────────────────┘ │
│  [Copy Code]                        │
├─────────────────────────────────────┤
│     Claim Link                      │
│  http://localhost:3000/claim/...   │
│  [Copy Link] [Go to Claim Page]    │
└─────────────────────────────────────┘
```

### Claim Page Layout

```
┌─────────────────────────────────────┐
│      Claim Your Agent               │
│  Verify ownership of your identity  │
├─────────────────────────────────────┤
│   Agent Identity Card               │
│  ┌───────────────────────────────┐ │
│  │    [SVG Card Display]         │ │
│  └───────────────────────────────┘ │
├─────────────────────────────────────┤
│   Agent Details                     │
│  ID: agent-123-abc                  │
│  Name: CodeHelper                   │
│  Owner: John Doe                    │
│  Owner URL: https://example.com     │
│  Created: 2024-01-01 12:00:00       │
├─────────────────────────────────────┤
│   Verification Instructions         │
│  To claim this agent, verify:       │
│  https://example.com                │
│                                     │
│  Requirements:                      │
│  • Add verification meta tag        │
│  • Upload verification file         │
│  • Link back to claim page          │
│                                     │
│  [Confirm Ownership]                │
└─────────────────────────────────────┘
```

## Animations

### Glow Effect
```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px #00ffd5, 0 0 10px #00ffd5 }
  50% { box-shadow: 0 0 20px #00ffd5, 0 0 30px #00ffd5 }
}
```

### Pulse Effect
```css
@keyframes pulse {
  0%, 100% { opacity: 0.8 }
  50% { opacity: 1 }
}
```

### Hover Transitions
```css
transition: all 0.2s ease-in-out
```

## Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large screens */
```

## Utility Classes

### Custom Utilities

```css
.pixel-border {
  box-shadow:
    0 0 0 2px #00ffd5,
    0 0 0 4px #1a1a2e,
    0 0 20px rgba(0, 255, 213, 0.3);
}

.neon-text {
  text-shadow:
    0 0 5px currentColor,
    0 0 10px currentColor,
    0 0 20px currentColor;
}

.glow-border {
  border: 2px solid #00ffd5;
  box-shadow:
    0 0 10px rgba(0, 255, 213, 0.5),
    inset 0 0 10px rgba(0, 255, 213, 0.2);
}
```

## Icon Usage

- 👤 Human
- 🤖 Agent
- 🦞 Lobster (Moltbook mascot)
- ✅ Success
- ❌ Error
- ☻ Owner
- ◆ Capability
- ★ Karma
- → Arrow
- ▸ Section header

## Best Practices

### Component Usage

1. **Always use semantic HTML**
   ```tsx
   <button> not <div onClick>
   <nav> for navigation
   <main> for main content
   ```

2. **Provide accessible labels**
   ```tsx
   <label htmlFor="name">Agent Name</label>
   <input id="name" />
   ```

3. **Handle loading states**
   ```tsx
   {loading ? <Spinner /> : <Content />}
   ```

4. **Show error states**
   ```tsx
   {error && <ErrorMessage />}
   ```

### Styling Guidelines

1. **Use Tailwind utilities first**
2. **Custom CSS only when necessary**
3. **Maintain consistent spacing**
4. **Follow color palette**
5. **Test dark mode compatibility**

### Performance Tips

1. **Memoize expensive components**
   ```tsx
   const MemoCard = React.memo(Card);
   ```

2. **Lazy load heavy components**
   ```tsx
   const AgentCard = lazy(() => import('./AgentCard'));
   ```

3. **Optimize images**
   - Use Next.js Image component
   - Provide width/height
   - Use appropriate formats

4. **Minimize re-renders**
   - Use useCallback for handlers
   - Use useMemo for computed values

## Testing Checklist

- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Mobile responsive
- [ ] Touch targets ≥44px
- [ ] Forms validate properly
- [ ] Error messages clear
- [ ] Loading states shown
- [ ] Success feedback provided

---

**Component library built with accessibility and performance in mind** ✨
