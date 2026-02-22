# Tailwind CSS Guidelines

## Core Principles

### Utility-First Mindset

Tailwind utility-first does not mean every UI must be abstracted into components.
When reuse and behavior are uncertain, prefer writing utilities directly.
Abstract only when the UI has stable reuse and includes behavior (for example, event handlers).

### Prohibited

- Using `@apply`
- Defining custom classes outside Tailwind (including `@layer utilities` custom classes)
- Accepting `className` as a generic extension prop by default (except controlled wrappers)
- CSS-only abstractions such as `.btn-primary` or `.surface-panel`
- Adding new `@keyframes` to `globals.css`

### Allowed

- Component abstraction that includes behavior and not just style
- Variant modeling with `cva`
- Limited `.prose` usage for rich-text rendering
- Normalize/reset rules in `@layer base`
- Design token definitions via `@theme`
- Built-in Tailwind animations such as `animate-spin` and `animate-pulse`

### Design Goals

- Manage design tokens as a single source of truth (color, type, radius, motion)
- Use Tailwind in a token-first way and reduce arbitrary values in components
- Use shadcn/ui as shared primitives while preserving brand identity
- Keep future theming possible (dark mode, seasonal themes) without component rewrites

## Design Tokens

### Token Architecture

| Layer | Description | Example |
|------|-------------|---------|
| Base palette | Raw values without semantic intent | `--palette-ink-900`, `--palette-coral-100` |
| Semantic tokens | Intent-based aliases | `--token-canvas`, `--token-text`, `--token-border` |
| Component tokens | Component-specific overrides (only when needed) | `--token-dark-canvas` |
| Motion tokens | Timing and easing | `--duration-fast`, `--ease-standard` |

### Tailwind v4 CSS-First Setup

Define tokens in `@theme` and expose them as utilities.

```css
@theme {
  /* Colors */
  --color-background: var(--token-canvas);
  --color-foreground: var(--token-text);
  --color-primary: var(--token-surface-ink);
  --color-accent: var(--token-accent);

  /* Typography */
  --font-body: "M PLUS Rounded 1c", sans-serif;
  --font-display: "Shippori Mincho B1", serif;

  /* Radius */
  --radius-sm: 0.5rem;
  --radius-md: 0.875rem;
  --radius-lg: 1.25rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;
}
```

### Color Format

Use `oklch()` for all color definitions.

```css
:root {
  --palette-ink-900: oklch(0.21 0.02 285);
  --palette-ink-800: oklch(0.28 0.02 285);
  --palette-coral-100: oklch(0.90 0.08 50);
  --palette-line: oklch(0.21 0.03 285 / 0.12);
}
```

### JS Token Mirror

Mirror important color tokens in TypeScript for app-side usage.

```ts
// shared/lib/design-tokens.ts
export const colors = {
  ink: {
    900: "oklch(0.21 0.02 285)",
    800: "oklch(0.28 0.02 285)",
  },
  coral: {
    100: "oklch(0.90 0.08 50)",
  },
} as const;
```

## Arbitrary Value Rules

Do not use arbitrary values in design-critical areas.

| Area | Disallowed Example | Preferred Alternative |
|------|--------------------|-----------------------|
| Spacing | `p-[13px]`, `m-[7px]` | Tailwind scale (`p-3`, `m-2`) |
| Font size | `text-[15px]` | Tokenized size via `@theme` |
| Radius | `rounded-[10px]` | `--radius-*` tokens |
| Colors | `bg-[#ff6b6b]` | Add to palette first |

Allowed cases:

- Layout-driven calculations such as `w-[calc(100%-2rem)]`
- One-off visual backgrounds/gradients
- Fixed values required by external constraints

```tsx
// Bad: arbitrary spacing and color
<div className="p-[13px] bg-[#custom]" />

// Good: layout calculation
<div className="w-[calc(100%-var(--sidebar-width))]" />

// Good: one-off artistic background
<div className="bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]" />
```

When an exception is unavoidable, document the reason near the component.

## Component Design

### Variants with `cva`

```ts
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
  {
    variants: {
      intent: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-11 px-6 text-lg",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  },
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  onClick?: () => void;
  disabled?: boolean;
};
```

### Always Use `cn` for Conditional Classes

```ts
// shared/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
<div
  className={cn(
    "bg-card rounded-lg p-4",
    isActive && "ring-2 ring-primary",
  )}
/>
```

### `className` Policy

Default rule: do not accept generic `className` extension props.

```tsx
// Bad
interface CardProps {
  className?: string;
  children: ReactNode;
}

// Good
interface CardProps {
  variant: "default" | "elevated" | "outlined";
  children: ReactNode;
}
```

Exception: wrappers around shadcn primitives may internally accept `className`.

## shadcn/ui Adoption

### Recommended Primitives

`Button`, `Input`, `Textarea`, `Select`, `Dialog`, `Tooltip`, `Popover`, `Tabs`, `Badge`, `Card`, `DropdownMenu`

### Brand Wrappers

Place brand-level wrappers in `shared/components/presenters`.

| Wrapper | Base | Added Behavior |
|---------|------|----------------|
| `ActionButton` | Button | Optional `href` support |
| `SurfaceCard` | Card | Tone variants (`glass`, `soft`, `ink`) |
| `TagPill` | Badge | Simplified API |

### UI Primitive Inventory

Keep low-level primitives in `shared/components/ui/`.

| Component | Variants | Notes |
|-----------|----------|-------|
| `Button` | primary, secondary, ghost / sm, md, lg | CVA-based |
| `Card` | - | Base card container |
| `Badge` | mint, sky, lilac, amber, coral, ink | Color tones |
| `Input` | default, error | Form input |
| `Textarea` | default, error | Multiline input |
| `Select` | default, error | Native select wrapper |
| `Chart` | - | Recharts wrapper |

## Normalize / Reset

Keep base rules inside `@layer base`.

```css
@layer base {
  :root {
    color-scheme: light;
  }

  html {
    font-family: var(--font-body);
  }

  body {
    background: var(--token-canvas);
    color: var(--token-text);
    text-rendering: optimizeLegibility;
  }

  button,
  [role="button"] {
    cursor: pointer;
  }

  button:disabled,
  [role="button"][aria-disabled="true"] {
    cursor: not-allowed;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-display);
  }

  a {
    color: inherit;
  }
}
```

## Animation Policy

### Preferred Options

1. UI animation libraries: Framer Motion, React Spring
2. JS-driven animations: GSAP, Anime.js
3. Tailwind built-ins: `animate-spin`, `animate-pulse`

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Content
</motion.div>;
```

### Disallowed

- Adding new `@keyframes` to `globals.css`
- Defining CSS-only custom animations

### Legacy Migration

Treat existing CSS animations as legacy and migrate gradually to JS-based animations.

## Token Catalog

### Color Utilities

| Token | Usage |
|-------|-------|
| `bg-background` / `text-foreground` | Main canvas |
| `bg-primary` / `text-primary-foreground` | Primary action |
| `bg-accent` / `text-accent-foreground` | Accent |
| `bg-card` / `text-card-foreground` | Card surfaces |
| `bg-dark-canvas` / `bg-dark-bar` | Dark-mode-only surfaces |

### Radius Utilities

| Token | Value |
|-------|-------|
| `rounded-sm` | 0.5rem |
| `rounded-md` | 0.875rem |
| `rounded-lg` | 1.25rem |
| `rounded-xl` | 1.5rem |
| `rounded-2xl` | 2rem |

### Shadow Variables

| Variable | Usage |
|----------|-------|
| `--shadow-card` | Standard cards |
| `--shadow-action` | Action buttons and prominent controls |
| `--shadow-hero` | Hero sections and large cards |

Usage example: `shadow-[var(--shadow-card)]` or inline `boxShadow: 'var(--shadow-card)'`.

### Motion Variables

| Variable | Value |
|----------|-------|
| `--duration-fast` | 150ms |
| `--duration-md` | 300ms |
| `--ease-standard` | `cubic-bezier(0.2, 0.7, 0.2, 1)` |

## File Structure

```text
services/my-app/
├── app/
│   └── globals.css          # only @theme, @layer base, CSS variables
└── shared/
    ├── components/
    │   ├── ui/              # shadcn/ui primitives (CVA)
    │   └── presenters/      # brand wrappers
    └── lib/
        ├── utils.ts         # cn() utility
        └── design-tokens.ts # optional JS token mirror
```

### Allowed Content in `globals.css`

```css
/* Allowed */
@import "tailwindcss";
@theme {
  /* ... */
}
@layer base {
  /* ... */
}
:root {
  /* CSS variables */
}

/* Disallowed */
@layer utilities {
  .custom-class {
    /* ... */
  }
}
@keyframes newAnimation {
  /* ... */
}
.my-class {
  /* ... */
}
```

## Guardrails

- Treat token names as stable; refactor usage sites instead of renaming published tokens
- Add new colors to the palette first, then map them to semantic roles
- Prefer the default Tailwind spacing scale; add custom spacing only when repeated usage is clear
- Define all new colors in `oklch()` format

## Checklist

When adding new styles:

- [ ] No arbitrary values in design-critical areas
- [ ] No `@apply`
- [ ] No custom classes in `@layer utilities`
- [ ] Components include behavior (event handlers, state), not just className wrappers
- [ ] Variants are modeled with `cva`
- [ ] Conditional classes use `cn()`
- [ ] New colors use `oklch()`
- [ ] Existing primitives (`ActionButton`, `SurfaceCard`, `TagPill`) were considered first
- [ ] Props use explicit variant types over booleans when there are more than 2 states
- [ ] `VariantProps<typeof variants>` is used with `cva` for variant prop types

## References

- [Tailwind CSS v4 - Adding Custom Styles](https://tailwindcss.com/docs/adding-custom-styles)
- [Class Variance Authority](https://cva.style/docs)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [5 Best Practices for Preventing Chaos in Tailwind CSS](https://evilmartians.com/chronicles/5-best-practices-for-preventing-chaos-in-tailwind-css)
