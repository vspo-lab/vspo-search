---
name: frontend-review
description: Review frontend code for CSS, accessibility, React patterns, and design compliance. Use for requests like "review frontend" or "frontend review."
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git show:*)
---

# /frontend-review Command

Review frontend code diffs or specified files based on project CSS, accessibility, React, and design token conventions.

## Usage

- `/frontend-review` - Review unstaged changes from `git diff`
- `/frontend-review --staged` - Review staged changes
- `/frontend-review <file>` - Review a specific file
- `/frontend-review <commit>` - Review the diff of a specific commit

## Procedure

1. **Identify the target**: Run `git diff` / `git diff --staged` / `git show` / file reads based on arguments.
2. **Check conventions**: Read relevant documents under `docs/web-frontend/` and `docs/design/` to understand the latest conventions.
3. **Run checks by category**: Apply the review criteria below in order.
4. **Report results**: For each issue, provide severity, file location, and a proposed fix.

---

## Review Criteria

### 1. Tailwind CSS & Styling

**Reference**: `docs/web-frontend/css.md`

| Check | Violation Example |
|---|---|
| Is `@apply` absent from all files? | `@apply flex items-center` in a CSS file |
| Are there no custom classes in `@layer utilities`? | `.btn-primary { ... }` inside `@layer utilities` |
| Are arbitrary values avoided in design-critical areas (spacing, font-size, radius, colors)? | `p-[13px]`, `text-[15px]`, `rounded-[10px]`, `bg-[#ff6b6b]` |
| Are layout-driven calculations the only allowed arbitrary values? | `w-[calc(100%-2rem)]` is acceptable |
| Are variants modeled with `cva`? | Inline ternary chains for 3+ visual states |
| Are conditional classes composed with `cn()`? | Manual string concatenation for class toggling |
| Is the `className` extension prop avoided (except shadcn wrappers)? | `interface CardProps { className?: string }` |
| Do new colors use `oklch()` format? | Adding `#ff6b6b` or `rgb(255, 107, 107)` to CSS variables |
| Are there no new `@keyframes` in `globals.css`? | `@keyframes fadeIn { ... }` in globals.css |
| Are there no CSS-only class abstractions? | `.surface-panel { ... }` without component behavior |

### 2. Design Token Compliance

**Reference**: `docs/design/design-tokens.md`, `docs/web-frontend/css.md`

| Check | Violation Example |
|---|---|
| Do colors follow the token pipeline (palette -> semantic -> component)? | Hardcoded `oklch(0.5 0.2 250)` instead of referencing a token |
| Are Tailwind built-in colors avoided? | `bg-blue-500`, `text-gray-700` |
| Are legacy alias tokens avoided in new code? | Using `--color-ink` instead of `--color-foreground` |
| Do shadows use token variables? | `shadow-lg` instead of `shadow-[var(--shadow-card)]` |
| Do motion values reference tokens? | `duration-300` instead of `var(--duration-md)` |
| Does radius use the token scale? | `rounded-[10px]` instead of `rounded-md` |

### 3. Container/Presentational Architecture

**Reference**: `docs/web-frontend/architecture.md`

| Check | Violation Example |
|---|---|
| Do Presenters receive data/callbacks via props only? | `useState` or `useEffect` inside a Presenter component |
| Do Containers handle state, data fetching, and event logic? | API calls or `fetch` inside Presenter components |
| Are there no cross-feature imports? | `import { X } from '@/features/other-feature'` |
| Is the dependency direction correct (shared -> features -> app)? | Shared code importing from features |
| Is the module structure feature-based? | Grouping by technical layer across features |
| Are direct file imports used (no barrel files)? | `import { X } from '@/features/foo'` via index.ts |

### 4. Accessibility (WCAG 2.2 AA)

**Reference**: `docs/web-frontend/accessibility.md`, `docs/design/accessibility.md`

| Check | Violation Example |
|---|---|
| Is semantic HTML used before custom roles? | `<div onClick={...} role="button">` instead of `<button>` |
| Are labels associated via `htmlFor`/`id`? | `<input>` without a linked `<label>` |
| Do icon-only buttons have `aria-label`? | `<button><SearchIcon /></button>` without `aria-label` |
| Are touch targets >= 44x44px (minimum 24x24px)? | `h-6 w-6` button without padding |
| Are `focus-visible` styles on interactive elements? | Buttons or links without visible focus indicator |
| Do modals have `role="dialog"`, `aria-modal`, focus trap, Escape close? | Custom modal without ARIA attributes |
| Is state conveyed by more than color alone? | Red text without icon or label for errors |
| Does dynamic content use `aria-live` regions? | Status updates without `aria-live="polite"` |
| Do informative images have meaningful `alt`? | `<img src="chart.png" alt="" />` for an informative chart |
| Do decorative images use `alt="" aria-hidden="true"`? | Decorative SVG without `aria-hidden` |

### 5. React Hooks & Patterns

**Reference**: `docs/web-frontend/react-hooks.md`

| Check | Violation Example |
|---|---|
| Are derived values computed during render (no `useEffect`)? | `useEffect(() => setFullName(first + last), [first, last])` |
| Is `useMemo` used for expensive computations? | `useEffect` + `useState` for filtered lists |
| Is event-specific logic in event handlers, not effects? | `useEffect(() => { if (submitted) notify() }, [submitted])` |
| Are there no chained effects? | One `useEffect` setting state that triggers another `useEffect` |
| Does data fetching use React Query or dedicated library? | Raw `fetch` inside `useEffect` without race condition handling |
| Do external subscriptions use `useSyncExternalStore`? | Manual `addEventListener` + `useEffect` for browser APIs |
| Do effects with subscriptions include cleanup functions? | Missing `return () => { ... }` in subscription effects |

### 6. Animation Policy

**Reference**: `docs/web-frontend/css.md` (Animation Policy section)

| Check | Violation Example |
|---|---|
| Are JS-driven animation libraries used (Framer Motion, React Spring, GSAP)? | CSS-only `transition` for complex multi-step animations |
| Are there no new `@keyframes` definitions in CSS? | `@keyframes slideIn { ... }` in any CSS file |
| Are Tailwind built-in animations used appropriately? | Custom CSS animation when `animate-spin` or `animate-pulse` would work |
| Are existing CSS animations treated as legacy? | Adding new features that depend on legacy CSS animations |

### 7. Responsive Design & Layout

**Reference**: `docs/design/design-review.md`

| Check | Violation Example |
|---|---|
| Is responsive design mobile-aware? | Desktop-only layout with no mobile breakpoints |
| Do sticky/fixed elements avoid obscuring focused content? | `sticky top-0` header with no `scroll-padding-top` |
| Do layouts work at 200% zoom? | Fixed pixel widths that break at zoom |
| Is touch-friendly spacing used on mobile? | Tiny tap targets on mobile views |
| Are responsive prefixes used consistently? | Mixing `sm:` / `md:` / `max-md:` without clear pattern |

### 8. Component API Design

**Reference**: `docs/web-frontend/css.md`, `docs/web-frontend/architecture.md`

| Check | Violation Example |
|---|---|
| Do components include behavior, not just style? | A component that only wraps className without event handlers |
| Are existing shared primitives reused? | Creating a new button instead of using `shared/components/ui/Button` |
| Do props use explicit variant types over booleans for > 2 states? | `isPrimary?: boolean; isGhost?: boolean` instead of `variant: 'primary' \| 'ghost'` |
| Is `VariantProps<typeof variants>` used with `cva`? | Manual prop type definition duplicating `cva` variants |

---

## Output Format

Report each issue in the following format. Skip criteria with no issues.

```
## Frontend Review Results

### [Severity: High] Issue Summary

**File**: `path/to/file.tsx:line`
**Category**: Tailwind CSS & Styling

**Issue**: Specific description of the problem

**Proposed Fix**:
```tsx
// code after the fix
```

**Reference**: `docs/web-frontend/css.md` > Arbitrary Value Rules
```

### Severity Scale

| Severity | Criteria |
|---|---|
| **High** | Accessibility violations, arbitrary values bypassing token system, cross-feature imports, `@apply` usage, missing focus management |
| **Medium** | Missing `cva` modeling, unnecessary `useEffect`, missing `aria-label`, legacy token usage, missing cleanup in effects |
| **Low** | Style organization, animation migration opportunities, component API improvements, responsive prefix consistency |

## Reference Documents

- `docs/web-frontend/css.md` - Tailwind CSS guidelines and animation policy
- `docs/web-frontend/architecture.md` - Container/Presentational architecture
- `docs/web-frontend/accessibility.md` - Accessibility implementation guidelines
- `docs/web-frontend/react-hooks.md` - React hooks best practices
- `docs/design/design-tokens.md` - Design token architecture
- `docs/design/design-review.md` - UI review process and checklist
- `docs/design/design-principles.md` - Design principles (22-item checklist)
- `docs/design/accessibility.md` - Design accessibility guidelines
