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

Key checks: no `@apply`, no custom `@layer utilities` classes, no arbitrary values in design-critical areas, use `cva` for variants, use `cn()` for conditional classes, new colors in `oklch()` format.

### 2. Design Token Compliance

**Reference**: `docs/design/design-tokens.md`, `docs/web-frontend/css.md`

Key checks: colors follow token pipeline (palette -> semantic -> component), no Tailwind built-in colors, no legacy alias tokens in new code, shadows/motion/radius use token variables.

### 3. Container/Presentational Architecture

**Reference**: `docs/web-frontend/architecture.md`

Key checks: Presenters receive data/callbacks via props only, Containers handle state and data fetching, no cross-feature imports, correct dependency direction (shared -> features -> app), no barrel file imports.

### 4. Accessibility (WCAG 2.2 AA)

**Reference**: `docs/web-frontend/accessibility.md`, `docs/design/accessibility.md`

Key checks: semantic HTML before custom roles, labels associated via `htmlFor`/`id`, icon-only buttons have `aria-label`, touch targets >= 44x44px, `focus-visible` styles on interactive elements, modals with proper ARIA attributes and focus trap.

### 5. React Hooks & Patterns

**Reference**: `docs/web-frontend/react-hooks.md`

Key checks: derived values computed during render (no `useEffect`), `useMemo` for expensive computations, no chained effects, data fetching uses React Query, effects with subscriptions include cleanup.

### 6. Animation Policy

**Reference**: `docs/web-frontend/css.md` (Animation Policy section)

Key checks: JS-driven animation libraries for complex animations, no new `@keyframes` in CSS, existing CSS animations treated as legacy.

### 7. Responsive Design & Layout

**Reference**: `docs/design/design-review.md` (Responsive Design Checklist)

Key checks: mobile-aware layouts, sticky/fixed elements avoid obscuring focused content, layouts work at 200% zoom, touch-friendly spacing, consistent responsive prefixes.

### 8. Component API Design

**Reference**: `docs/web-frontend/css.md` (Checklist), `docs/web-frontend/architecture.md`

Key checks: components include behavior (not just style), existing shared primitives reused, explicit variant types over booleans for >2 states, `VariantProps<typeof variants>` used with `cva`.

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
- `docs/design/design-review.md` - UI review process and responsive design checklist
- `docs/design/design-principles.md` - Design principles (22-item checklist)
- `docs/design/accessibility.md` - Design accessibility guidelines
