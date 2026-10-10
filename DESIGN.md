# Unchained Wallet — Design System & Brand Guide

> Own your tools. Keep your freedom.

---

## Brand Identity

**Unchained** is an open-source personal software suite. Every app in the suite shares the same **four-link broken chain** mark with a **gold burst** at the break point. The Wallet app adds a wallet silhouette around the chain, but the chain remains the dominant shared symbol.

### Brand Essence

- **Sovereign** — your data, your rules
- **Simple** — clean, focused interfaces
- **Trusted** — transparent, open-source
- **Open** — self-hostable, no lock-in

---

## Color Palette

| Name            | Hex       | CSS Variable          | Usage                                    |
| --------------- | --------- | --------------------- | ---------------------------------------- |
| Charcoal        | `#20201F` | `--color-charcoal`    | Logo, headings, primary text             |
| Champagne gold  | `#C4A168` | `--color-gold`        | Broken link accent, small highlights     |
| Warm ivory      | `#F7F4ED` | `--color-ivory`       | Page backgrounds                         |
| Soft white      | `#FFFFFF` | `--color-white`       | Cards, app surfaces                      |
| Warm gray       | `#77736C` | `--color-warm-gray`   | Secondary text, borders, muted elements  |
| Pale stone      | `#E7E1D7` | `--color-pale-stone`  | Subtle dividers, secondary backgrounds   |
| Gold tint       | `#F0E5D0` | `--color-gold-tint`   | Very light gold wash for hover/active    |

### Color Rules

- **No green.** Never use green for success states — use gold or charcoal instead.
- **Gold is sparingly used.** Only for the chain burst accent, small highlights, active indicators, and CTAs. The app should feel premium, not flashy.
- **No neon, no gradients, no heavy shadows.**
- Error/destructive actions: use `#B85C5C` (muted warm red), never bright red.
- All text on ivory backgrounds must meet WCAG AA contrast.

---

## Typography

| Element         | Font     | Weight   | Size (desktop) | Size (mobile) |
| --------------- | -------- | -------- | -------------- | ------------- |
| Page headings   | Inter    | 600      | 28px           | 24px          |
| Section titles  | Inter    | 500      | 20px           | 18px          |
| Body text       | Inter    | 400      | 16px           | 15px          |
| Secondary text  | Inter    | 400      | 14px           | 13px          |
| Captions/labels | Inter    | 500      | 12px           | 12px          |
| Amounts/numbers | Inter    | 600      | varies         | varies        |

### Typography Rules

- Use a **clean sans-serif**: Inter (primary) or Manrope (alternate).
- Prefer **medium-weight (500) headings** and **regular (400) body text**.
- Avoid overly bold or futuristic fonts.
- Letter-spacing: use default or very slight tracking on uppercase labels (`0.05em`).

---

## Design Style

### Overall Tone

**Light, calm, and premium.** The interface should feel like a high-end financial tool — trustworthy and uncluttered.

### Layout Principles

- **Generous whitespace** — don't crowd elements
- **Thin dividers** (`1px`, `--color-pale-stone`)
- **Rounded cards** (`border-radius: 16px` for cards, `12px` for buttons, `8px` for inputs)
- **Clear visual hierarchy** through size and weight, not color overload
- Max content width: `768px` on desktop, full-width on mobile

### Cards & Surfaces

- Cards: `#FFFFFF` background, `1px` border `#E7E1D7`, `border-radius: 16px`
- No heavy box shadows. Use at most `0 1px 3px rgba(0,0,0,0.04)` for subtle lift.
- Page background: `#F7F4ED`

### Buttons

- **Primary**: Charcoal `#20201F` background, white text, rounded pill (`border-radius: 12px`)
- **Secondary**: Transparent with `1px` charcoal border, charcoal text
- **Accent**: Gold `#C4A168` — use only for the single most important CTA on a page
- **Destructive**: Muted red `#B85C5C`, white text

### Icons

- Use simple, outlined icons (Lucide React or similar)
- Icon color: `#77736C` (warm gray) default, `#20201F` when active
- Size: `20px` for navigation, `16px` inline

### Animations

- Use Framer Motion for page transitions and micro-interactions
- Keep animations **subtle and fast** (150–300ms)
- Entrance: fade + slight upward slide
- No bouncy or elastic easing — use `ease-out` or `[0.25, 0.1, 0.25, 1]`

---

## Logo Assets

| File | Purpose |
| ---- | ------- |
| `public/unchained-broken-chain-logo.png` | Suite mark — four-link broken chain with gold burst |
| `public/unchained-wallet-matching-chain-logo.png` | Wallet app logo — chain inside wallet silhouette |
| `public/unchained-brand-board-gpt-image-2-5.png` | Full brand board reference |

### Logo Usage

- The wallet logo is used in the app header and PWA icon.
- The chain mark is used in the splash/loading screen.
- Always maintain clear space equal to the height of one chain link around the logo.
- Never recolor the gold burst — it's always `#C4A168`.

---

## Navigation Pattern

### Mobile (< 768px)

- **Bottom tab bar** with 5 items: Dashboard, Transactions, Budgets, Analytics, Settings
- Active tab: charcoal icon + gold dot indicator
- Inactive tabs: warm gray icons

### Desktop (≥ 768px)

- **Left sidebar** with the wallet logo at top, navigation links below
- Active link: charcoal text with gold left-border accent
- Collapsed state: icon-only with tooltip

---

## Data & Privacy

- **All data stored locally** in the browser (localStorage / IndexedDB)
- No server, no analytics, no tracking
- Users can export/import their data as JSON
- Self-hostable — runs as a static PWA

---

## PWA Configuration

- `display: standalone`
- `theme_color: #20201F` (charcoal)
- `background_color: #F7F4ED` (warm ivory)
- Offline support via Next.js 16 `useOffline` hook + service worker
- Icons: 192×192 and 512×512 PNG versions of the wallet logo

---

## Component Naming Convention

All components use PascalCase and live in `app/components/`:

```
Card.tsx           — generic rounded card wrapper
BalanceCard.tsx    — hero balance display on dashboard
TransactionItem.tsx — single transaction row
TransactionForm.tsx — add/edit transaction modal
BudgetCard.tsx     — budget with progress bar
BudgetForm.tsx     — add/edit budget modal
Navigation.tsx     — responsive bottom nav / sidebar
EmptyState.tsx     — friendly empty state illustration
OfflineBanner.tsx  — connectivity status bar
```

---

## Spending Categories

| Category       | Icon (Lucide)   | Color accent     |
| -------------- | --------------- | ---------------- |
| Food & Dining  | `UtensilsCrossed` | `#C4A168` (gold) |
| Transport      | `Car`           | `#77736C`        |
| Shopping       | `ShoppingBag`   | `#77736C`        |
| Entertainment  | `Film`          | `#77736C`        |
| Bills & Utilities | `Zap`        | `#77736C`        |
| Health         | `Heart`         | `#77736C`        |
| Education      | `GraduationCap` | `#77736C`        |
| Savings        | `PiggyBank`     | `#C4A168` (gold) |
| Income         | `ArrowDownLeft` | `#20201F`        |
| Other          | `MoreHorizontal`| `#77736C`        |

---

*This document is the single source of truth for all visual and interaction design decisions in Unchained Wallet. Update it before deviating from any guideline.*
