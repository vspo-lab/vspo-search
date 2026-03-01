---
name: design-review
description: Review UI/UX quality for wireframes, frontend screens, and design specs. Use when users ask for design review, UI polish, visual consistency, or accessibility checks.
metadata:
  short-description: UI design review workflow
allowed-tools: Read, Grep, Glob, Bash(rg:*), Bash(git diff:*), Bash(git status:*), Bash(sed:*), Bash(cat:*)
---

# Design Review

Use this skill to review design quality, consistency, and usability risks.

## When to use

Use when requests include:

- "review this UI"
- "design review"
- "polish this screen"
- "check consistency/accessibility"

## Inputs

1. Target diff, file, or screen implementation
2. Relevant design constraints (brand, tokens, accessibility, responsive rules)

If constraints are missing, infer from repository docs and existing UI patterns.

## Review Procedure

1. Identify scope
- Review `git diff` by default.
- If a file/screen is specified, focus there first.

2. Read design context
- Prefer repository design docs and tokens before judging style.
- Preserve existing design system patterns unless user asked for redesign.

3. Run checks in order
- `Token discipline`: hard-coded values vs tokens, semantic token usage
- `Hierarchy`: information priority, scanability, CTA prominence
- `Spacing and layout`: rhythm, alignment, density, overflow risks
- `Typography`: readable sizing, line-height, visual contrast
- `Color and contrast`: state clarity and WCAG risk areas
- `Interaction states`: hover/focus/active/disabled/loading/empty/error
- `Responsive behavior`: breakpoints, touch ergonomics, text wrapping
- `Responsive state sync`: drawer/overlay state and body scroll lock on resize/orientation changes
- `Accessibility semantics`: labels, roles, keyboard path, focus visibility
- `Consistency`: component reuse, naming, variant behavior

4. Report findings
- Prioritize user-impacting risks.
- Provide concrete fixes, not generic advice.

## Severity

- `High`: usability blockers, accessibility violations, severe visual regressions
- `Medium`: inconsistency, missing states, likely confusion or quality debt
- `Low`: polish opportunities and maintainability improvements

## Output Format

```text
## Design Findings

### [Severity: High|Medium|Low] Short title
File: `path/to/file.ext:line`
Category: Token discipline | Accessibility | Layout | ...
Issue: What is wrong and where
Impact: Why users or maintainability are affected
Proposed fix: Specific change (with snippet if useful)
```

If no issues are found, explicitly say:

- No critical findings
- Residual risks or untested states (if any)

## Optional Reference

For a compact checklist, use:

- `references/checklist.md`
