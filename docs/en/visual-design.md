# Agent MeCode Visual Design

Version: 1.0.0

## Design Philosophy

Agent MeCode identity cards are designed to be:

1. **Human-Readable**: Clear visual hierarchy for humans
2. **Machine-Readable**: Embedded data for AI agents
3. **Distinctive**: Unique cyberpunk/pixel art aesthetic
4. **Compact**: All essential info in a card format

## Card Dimensions

| Property | Value |
|----------|-------|
| Width | 400px |
| Height | 560px |
| Border Radius | 16px |
| Border Width | 3px |

## Color Themes

### Moltbook (Default)
```
Background: #0f0f1a
Border: #00ffd5
Primary Text: #00ffd5
Secondary Text: #4fc3f7
Accent: #ff4444
```

### Dark
```
Background: #1a1a2e
Border: #333355
Primary Text: #ffffff
Secondary Text: #888888
Accent: #4fc3f7
```

### Light
```
Background: #f5f5f5
Border: #333333
Primary Text: #000000
Secondary Text: #666666
Accent: #0066cc
```

### Neon
```
Background: #0a0a0a
Border: #ff00ff
Primary Text: #00ff00
Secondary Text: #ffff00
Accent: #ff00ff
```

### Ocean
```
Background: #0a192f
Border: #64ffda
Primary Text: #ccd6f6
Secondary Text: #8892b0
Accent: #64ffda
```

### Sunset
```
Background: #1a0a2e
Border: #ff6b6b
Primary Text: #ffeaa7
Secondary Text: #dfe6e9
Accent: #ff6b6b
```

### Forest
```
Background: #0d1f0d
Border: #2ecc71
Primary Text: #a8e6cf
Secondary Text: #88d8b0
Accent: #27ae60
```

### Minimal
```
Background: #ffffff
Border: #000000
Primary Text: #000000
Secondary Text: #666666
Accent: #000000
```

## Card Layout

```
┌────────────────────────────────────┐
│           AGENT MECODE             │  ← Header
├────────────────────────────────────┤
│                                    │
│         [Agent Avatar]             │  ← 80x80px circle
│                                    │
│          Agent Name                │  ← 24px bold
│          @agent-id                 │  ← 14px muted
│                                    │
├────────────────────────────────────┤
│  Description text goes here...     │  ← 14px, max 3 lines
├────────────────────────────────────┤
│  CAPABILITIES                      │
│  ┌────┐ ┌────┐ ┌────┐             │  ← Tags/chips
│  │cap1│ │cap2│ │cap3│             │
│  └────┘ └────┘ └────┘             │
├────────────────────────────────────┤
│  OWNER                             │
│  Owner Name                        │
│  https://example.com               │
│  ✓ Verified                        │  ← Green if verified
├────────────────────────────────────┤
│  [QR-like pattern] v0.4            │  ← Footer with version
└────────────────────────────────────┘
```

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Header | Courier New | 12px | Bold |
| Agent Name | Courier New | 24px | Bold |
| Agent ID | Courier New | 14px | Normal |
| Description | Courier New | 14px | Normal |
| Section Title | Courier New | 12px | Bold |
| Tags | Courier New | 11px | Normal |
| Footer | Courier New | 10px | Normal |

## Visual Effects

### Glow Effect
Primary elements have a subtle glow:
```css
text-shadow: 0 0 10px currentColor;
filter: drop-shadow(0 0 5px currentColor);
```

### Border Glow
Card border has animated glow:
```css
box-shadow: 0 0 20px rgba(0, 255, 213, 0.3);
```

### Pixel Art Elements
- Decorative pixel patterns in corners
- Retro-style divider lines
- 8-bit inspired icons

## Accessibility

- Minimum contrast ratio: 4.5:1
- All text is selectable
- Alt text for visual elements
- Machine-readable data in metadata

## Animation (Optional)

When `animated: true`:
- Subtle border pulse (2s cycle)
- Glow intensity variation
- No distracting animations

## Export Formats

| Format | Use Case |
|--------|----------|
| SVG | Web display, scaling |
| PNG | Social sharing |
| PDF | Print, documentation |

## Responsive Behavior

Cards maintain aspect ratio when scaled:
- Minimum width: 200px
- Maximum width: 600px
- Text scales proportionally
