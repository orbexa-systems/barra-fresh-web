# BarraFresh Design System
> Adapted from the Starbucks design system (awesome-design-md) — adjusted to BarraFresh brand, stack, and product context.

---

## 1. Visual Theme & Atmosphere

BarraFresh is a **warm, energetic fresh-food bar** — ensaladas, jugos y licuados served with personality. The canvas uses a warm near-white (`#f7fef9`) and a soft green-tinted surface (`#f0fdf4`) that references real café materials: clean countertops, fresh greens on the board, natural light. The signature **BarraFresh Green** (`#16a34a`) anchors the brand on heroes, CTAs, and feature bands. Amber (`#fbbf24`) appears only in loyalty/highlight ceremony — not as a general accent.

Typography carries brand voice. **Inter** (the project's configured font) is used across all surfaces with `-0.01em` letter-spacing — confident and friendly, never clinical. Display sizes go large and bold; body text stays at 16px/1.5 on a warm canvas.

Rounded geometry keeps things approachable. Buttons use a full-pill radius (`9999px`). Cards use `12px`. Micro-interactions use `scale(0.97)` on press — subtle, physical. Shadows are whisper-soft, always layered (never a single heavy drop). The system feels like a clean, friendly food bar: legible, fresh, inviting.

**Key Characteristics:**
- Two-tier green system: Primary (`#16a34a`) for CTAs and headings, Deep (`#14532d`) for feature bands/footer
- Amber (`#fbbf24`) reserved for loyalty and highlight moments only
- Warm green-tinted canvas (`#f0fdf4` / `#f7fef9`) instead of cold white
- Inter with tight `-0.01em` letter-spacing as the universal voice
- Full-pill buttons (`9999px` radius), `scale(0.97)` active press
- 12px card radius + whisper-soft layered shadows
- Color-block page rhythm: Canvas → White cards → Deep-green feature band → Canvas → Deep-green footer

---

## 2. Color Palette & Roles

### Primary (Greens)

| Token | Hex | Role |
|---|---|---|
| `brand-primary` | `#16a34a` | Primary CTAs, active states, brand headings |
| `brand-primary-dark` | `#15803d` | Hover on CTAs, secondary filled buttons |
| `brand-primary-light` | `#22c55e` | Highlights, decorative accents |
| `brand-primary-subtle` | `#86efac` | Decorative fills, icon accents |
| `brand-primary-muted` | `#bbf7d0` | Text on dark surfaces, light chip fills |
| Deep Green | `#14532d` | Feature bands, footer background, dark hero sections |
| `brand-surface` | `#f0fdf4` | Primary page canvas (green-50) |
| `brand-surface-mid` | `#dcfce7` | Section washes, chip backgrounds (green-100) |

### Accent (Amber — loyalty/highlights only)

| Token | Hex | Role |
|---|---|---|
| `brand-accent` | `#fbbf24` | Loyalty chips, featured badges, celebration moments |
| `brand-accent-dark` | `#f59e0b` | Hover on amber elements |
| `brand-accent-text` | `#b45309` | Amber text on light surfaces |
| `brand-accent-surface` | `#fffbeb` | Background wash for loyalty sections |
| `brand-accent-border` | `#fde68a` | Border on amber pills |

### Surface & Background

| Hex | Role |
|---|---|
| `#ffffff` | Card and modal surface |
| `#f7fef9` | Warm canvas alt (slightly warmer than pure white) |
| `#f0fdf4` | Primary page canvas (`brand-surface`) |
| `#f9fafb` | Admin/utility background (gray-50) |
| `#14532d` | Feature bands, footer (deep green) |

### Text

| Hex | Role |
|---|---|
| `rgba(0,0,0,0.87)` | Primary body/heading text on light surfaces |
| `rgba(0,0,0,0.58)` | Secondary/metadata text on light surfaces |
| `#111827` | High-contrast headings (gray-900) |
| `#6B7280` | Muted labels, captions (gray-500) |
| `rgba(255,255,255,1)` | Text on dark-green surfaces |
| `rgba(255,255,255,0.75)` | Secondary text on dark-green surfaces |

### Semantic

| Hex | Role |
|---|---|
| `#ef4444` | Error / destructive |
| `#22c55e` | Success / valid state |
| `#f59e0b` | Warning |
| `#3b82f6` | Info |

---

## 3. Typography Rules

### Font Family

```
Primary: Inter, system-ui, -apple-system, sans-serif
Fallback: system-ui, -apple-system, sans-serif
```

Inter is configured via `--font-inter` in `globals.css`. No proprietary or external fonts needed.

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| Display | 56–72px | 800 | 1.1 | -0.03em |
| H1 | 40–48px | 700 | 1.15 | -0.02em |
| H2 | 28–36px | 700 | 1.2 | -0.02em |
| H3 | 22–24px | 600 | 1.3 | -0.01em |
| Body Large | 18–19px | 400–500 | 1.65 | -0.01em |
| Body | 16px | 400 | 1.5 | -0.01em |
| Small | 14px | 400–500 | 1.5 | -0.01em |
| Micro / Label | 12–13px | 500–600 | 1.4 | 0.02em |
| Button | 14–16px | 600 | 1.2 | -0.01em |

### Principles

- **Tight negative tracking (`-0.01em`)** applied universally — the product reads slightly compressed, confident and clean.
- **Weight shifts carry hierarchy**, not just size shifts. Use color + weight to separate heading levels before reaching for larger sizes.
- **Body text never pure black** — `rgba(0,0,0,0.87)` on the warm canvas.
- **Uppercase labels** use `0.05em` tracking for readability (category chips, section tags).

---

## 4. Component Stylings

### Buttons

**1. Primary Filled — main CTA**
- Background: `#16a34a` (`brand-primary`)
- Text: `#ffffff`
- Border: none
- Radius: `9999px` (full pill)
- Padding: `12px 24px`
- Font: Inter, 15px, weight 600, `-0.01em`
- Hover: background `#15803d`
- Active: `transform: scale(0.97)`, transition `all 0.15s ease`

**2. Primary Outlined**
- Background: transparent
- Text: `#16a34a`
- Border: `1.5px solid #16a34a`
- Same radius/padding/active as Primary Filled

**3. Ghost / Subtle — secondary actions**
- Background: `#f0fdf4` (`brand-surface`)
- Text: `#15803d`
- Border: `1px solid #dcfce7`
- Radius: `9999px`

**4. White-on-Green — inside dark feature bands**
- Background: `#ffffff`
- Text: `#16a34a`
- Border: `1px solid #ffffff`
- Used when surface behind button is Deep Green (`#14532d`)

**5. Outline-on-Dark — secondary inside dark bands**
- Background: transparent
- Text: `#ffffff`
- Border: `1px solid rgba(255,255,255,0.75)`

**6. Amber Accent — loyalty/highlight moments only**
- Background: `#fbbf24`
- Text: `#78350f`
- Border: none
- Radius: `9999px`
- Reserved for loyalty program CTAs, not general use

**Universal active state:** `transform: scale(0.97)`, `transition: all 0.15s ease`

### Cards

**Content Card (default)**
- Background: `#ffffff`
- Radius: `12px`
- Shadow: `0 0 0px 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.08)`
- Hover: shadow lifts to `0 4px 16px rgba(0,0,0,0.12)`

**Product / Menu Card**
- Same as Content Card
- Image top (aspect ratio 4:3 or square), content below with `16px` padding
- Product name: 15px/600 `#111827`
- Price: `brand-primary`, 16px/700
- Availability badge: green or amber pill

**Feature Card (homepage highlights)**
- Background: `#f0fdf4` or `#ffffff`
- Radius: `16px`
- Left icon or illustration, right text — or stacked on mobile
- Border: `1px solid #dcfce7`

### Navigation

**Global Nav**
- Background: `#ffffff`, border-bottom: `1px solid #E5E7EB`
- Height: `64px` mobile / `72px` desktop
- Logo left, links center (desktop), CTA right
- Sticky on scroll

**Mobile Nav**
- Hamburger drawer, slides from left or top
- Full-width links, 48px minimum tap target

### Feature Band (dark-green section)

Full-width `#14532d` (Deep Green) band:
- Left: white headline + white body copy + CTA row (White-filled + Outline-on-Dark)
- Right: product photography or illustration
- Split 50/50 on desktop, stacked on mobile
- Secondary text: `rgba(255,255,255,0.75)`

### Inputs & Forms

- Border: `1px solid #E5E7EB`
- Radius: `8px`
- Focus border: `2px solid #16a34a`, `outline: none`
- Padding: `10px 14px`
- Font: 15px/400
- Error state: border `#ef4444`, light red tint background `hsl(0 84% 60% / 5%)`
- Valid state: border `#22c55e`, light green tint `hsl(142 71% 45% / 8%)`
- Label: 13px/500 `#374151`, `4px` margin-bottom

### Chips / Pills (category filter)

- Default: background `#f3f4f6`, text `#374151`, border `transparent`
- Selected: background `#f0fdf4`, text `#15803d`, border `1px solid #16a34a`
- Radius: `9999px`, padding: `6px 14px`, font: 13px/500

### Toast / Notifications

- Radius: `10px`
- Shadow: `0 4px 12px rgba(0,0,0,0.15)`
- Success: green-50 bg + green border-left
- Error: red-50 bg + red border-left

---

## 5. Layout Principles

### Spacing Scale

Anchored to `4px` base:

| Token | px | Use |
|---|---|---|
| `space-1` | 4px | Tightest inline gap |
| `space-2` | 8px | Compact padding, icon gaps |
| `space-3` | 12px | Small component padding |
| `space-4` | 16px | Default card padding, section gutter mobile |
| `space-5` | 24px | Between-card gap, section inner padding |
| `space-6` | 32px | Section-to-section spacing |
| `space-7` | 48px | Major section padding |
| `space-8` | 64px | Hero/feature padding |
| `space-9` | 80–96px | Top-level page section padding |

### Grid

- Max content width: `1280px`, centered
- Mobile gutter: `16px`
- Tablet gutter: `24px`
- Desktop gutter: `32–40px`
- Product grid: 2-up mobile / 3-up tablet / 4-up desktop

### Whitespace Philosophy

Whitespace signals quality and freshness. Section padding leans generous (`48–80px`). Content blocks are separated by whitespace, not dividers. The green canvas is itself a visual breath between white cards and dark-green feature bands.

### Border Radius

| Value | Use |
|---|---|
| `6px` | Small inputs, table cells |
| `8px` | Form inputs, small cards |
| `12px` | Product cards, modals, main containers |
| `16px` | Feature cards, highlighted sections |
| `9999px` | All buttons, chips, pills |
| `50%` | Avatars, circular icon buttons |

---

## 6. Depth & Elevation

| Level | Shadow | Use |
|---|---|---|
| Flat | none | Table rows, in-page chips |
| Card | `0 0 0px 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.08)` | Default cards |
| Card Hover | `0 4px 16px rgba(0,0,0,0.12)` | Card on hover |
| Nav | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` | Sticky nav bar |
| Dropdown | `0 4px 6px rgba(0,0,0,0.07), 0 10px 15px rgba(0,0,0,0.1)` | Menus, dropdowns |
| Modal | `0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)` | Modals, drawers |
| Toast | `0 4px 12px rgba(0,0,0,0.15)` | Toast notifications |

**Shadow philosophy:** Always layer 2 low-alpha shadows — a hairline ring + a soft diffuse lift. Never one heavy drop shadow.

---

## 7. Page Rhythm (Color-Block Pattern)

```
[Canvas — #f0fdf4]        Hero section
[White — #ffffff]         Product / content sections
[Deep Green — #14532d]    Feature band (benefits, CTA)
[Canvas — #f0fdf4]        Secondary content
[White — #ffffff]         Testimonials / gallery
[Deep Green — #14532d]    Footer
```

This alternation creates perceived depth without gradients. The deep-green bookends anchor the page and signal "BarraFresh is the brand."

---

## 8. Do's and Don'ts

### Do
- Use `#f0fdf4` as the primary page canvas — the green tint is load-bearing
- Apply `-0.01em` letter-spacing across all text
- Use full-pill radius (`9999px`) on every button and chip
- Apply `scale(0.97)` as the universal button active state
- Reserve amber for loyalty/highlight moments only
- Layer 2 low-alpha shadows instead of one heavier shadow
- Let the canvas breathe between cards — whitespace, not dividers
- Use Deep Green (`#14532d`) for feature bands and footer
- Use `rgba(0,0,0,0.87)` for body text — not pure black

### Don't
- Don't use pure white (`#ffffff`) as the page canvas for full sections — the tinted canvas is the brand temperature
- Don't use amber as a general-purpose accent
- Don't square button corners — the pill is universal
- Don't introduce gradients in the main layout — the system is color-block
- Don't use a single heavy box-shadow — always layer 2
- Don't skip the `scale(0.97)` active feedback on buttons
- Don't hardcode hex colors in components — always use CSS tokens from `globals.css`

---

## 9. Responsive Behavior

### Breakpoints (Tailwind defaults, project-aligned)

| Name | Width | Key Changes |
|---|---|---|
| xs (default) | < 640px | Single column, full-width buttons, hamburger nav |
| sm | 640px | 2-col product grid, pill buttons normal width |
| md | 768px | 3-col grid, desktop nav visible |
| lg | 1024px | 4-col product grid, hero splits, full layout |
| xl | 1280px | Content caps at max-width |

### Touch Targets

- All interactive elements minimum `44px` tap area
- Pill buttons pad to at least `44px` height on mobile: `padding: 12px 24px`
- Chips: `36px` height minimum on mobile
- Nav links: full-row tap area, not just text

### Collapsing Strategy

- Hero: asymmetric 50/50 split → stacked (image top) on mobile
- Product grid: 4-up → 3-up → 2-up → 1-up
- Feature band: side-by-side → stacked vertically
- Section padding scales: `48px` desktop → `32px` tablet → `24px` mobile

---

## 10. Agent Prompt Guide

### Quick Color Reference

| Role | Value |
|---|---|
| Primary CTA | `#16a34a` |
| CTA hover | `#15803d` |
| Brand heading | `#16a34a` or `#111827` |
| Feature band / footer | `#14532d` |
| Page canvas | `#f0fdf4` |
| Card surface | `#ffffff` |
| Body text (light surface) | `rgba(0,0,0,0.87)` |
| Secondary text (light) | `rgba(0,0,0,0.58)` |
| Body text (dark surface) | `rgba(255,255,255,0.75)` |
| Loyalty accent | `#fbbf24` |
| Error | `#ef4444` |
| Border default | `#E5E7EB` |

### Example Prompts

1. **Primary CTA button:** "Create a primary BarraFresh pill button — `#16a34a` background, white text 'Ordenar ahora', Inter 15px weight 600, `-0.01em` letter-spacing, `9999px` border-radius, `12px 24px` padding. Apply `transform: scale(0.97)` active state with `0.15s ease` transition."

2. **Product card:** "Build a BarraFresh menu card — white `#ffffff` background, `12px` border-radius, shadow `0 0 0px 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.08)`. Image top 4:3. Product name 15px/600 `#111827`. Price `#16a34a` 16px/700. Available/unavailable pill bottom-right. Hover lifts shadow."

3. **Feature band:** "Build a deep-green feature band — full-width `#14532d` background. Left: white Inter H2 36px/700, white body paragraph at `rgba(255,255,255,0.75)`, CTA row: white-filled button (bg `#ffffff`, text `#16a34a`) + outline-on-dark (`border: 1px solid rgba(255,255,255,0.75)`, white text). Right: product photo. 50/50 split on desktop, stacked on mobile."

4. **Category chip:** "Create a BarraFresh category filter chip — default: bg `#f3f4f6`, text `#374151`. Selected: bg `#f0fdf4`, text `#15803d`, border `1px solid #16a34a`. Radius `9999px`, padding `6px 14px`, font 13px/500."

5. **Section rhythm:** "Structure this page section with canvas background `#f0fdf4`, `64px` vertical padding desktop / `40px` mobile, `1280px` max-width centered, `32px` horizontal padding. Cards inside use white `#ffffff` with 12px radius and layered whisper shadow."
