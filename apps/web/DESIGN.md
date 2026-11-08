# Design System: FilmDrop (Direct TVOD Cinema)

The locked design system for FilmDrop. Formulated for direct-to-consumer independent film sales, festival premieres, and 4K DRM video distribution. Bound by Hallmark's strict anti-slop craft floor and presented in a pristine, high-contrast editorial cinema light theme.

## 1. System Identity & Philosophy
- **Genre**: modern-minimal / editorial-cinema
- **World**: Editorial Cinema Gazette
- **Theme**: Light Gallery Canvas (`#FAFAFA`), Crisp White Poster Cards (`#FFFFFF`), with Warm Tungsten Gold (`#D97706`) and Slate Charcoal (`#0F172A`)
- **Vibe**: "gallery aesthetic, 2:3 locked poster ratios, tabular ticket pricing, zero dark AI slop"
- **Posture**: High-craft indie cinema marketplace & creator monetization suite

## 2. Token Architecture (`app/globals.css`)
```css
:root {
  /* Surfaces & Bedrock */
  --background: 0 0% 98%;        /* #FAFAFA */
  --foreground: 222 47% 11%;     /* #0F172A */
  --card: 0 0% 100%;             /* #FFFFFF */
  --card-foreground: 222 47% 11%;
  --border: 214 32% 91%;         /* #E2E8F0 */

  /* Cinema Pigments */
  --primary: 38 92% 50%;         /* #D97706 warm amber / tungsten gold */
  --secondary: 210 40% 96%;      /* #F1F5F9 */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;/* #64748B */

  /* Hallmark Tokens */
  --border-hairline: #E2E8F0;
  --border-focus: #D97706;
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## 3. Typographic Discipline & Rules
- **Headlines**: Clean sans-serif, bold, untracked, sentence case, zero italic inside headings (Hallmark Floor 3 & 9).
- **Ticket Prices, Revenue Splits, & Durations**: `JetBrains Mono` strictly formatted with `font-variant-numeric: tabular-nums` (`₹99 standard 48h rental`, `85% Net`, `98m`).
- **Prohibitions**: Never `transition: all` (Floor 2), no purple-to-blue gradients (Floor 11), `overflow-x: clip` on `html` and `body` (Floor 4).

## 4. Layout & Card Standards
- **Header**: Light gallery navigation bar (`bg-white/95 border-b border-slate-200`) with quick catalog search and filmmaker studio switcher.
- **Film Cards**: Locked 2:3 aspect ratio posters with 1px hairlines and subtle elevation shadows on hover.
- **Focus & Motion**: High-contrast `:focus-visible` outline rings (`2px solid #D97706`, offset `2px`) with `@media (prefers-reduced-motion: reduce)` fallbacks.
