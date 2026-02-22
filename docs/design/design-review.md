# Design Review

## Overview

Design review is a critical process for ensuring product quality. This guideline defines two types of review: Information Design Review and UI Review.

## Information Design Review

A review that examines whether the product's information structure is sound.

### Scope

| Scope | Description |
|-------|-------------|
| New applications | Newly developed applications |
| Large-scale feature development | Major feature additions to existing products |

### Timing

Conduct the review once the high-level design is finalized and ready to share with the development team.

### Required Materials

| Material | Description |
|----------|-------------|
| Information design artifacts | IA diagrams, sitemaps, flow diagrams, etc. |
| Screen layouts | Design files or screen captures |

### Participant Roles

| Role | Assigned To | Responsibility |
|------|-------------|----------------|
| Reviewee | Lead designer | Accountable for explaining design decisions |
| Support | Development team (optional) | Supports the reviewee |
| Facilitator | Moderator | Manages proceedings and organizes discussion |
| Reviewer | Other participants | Provides feedback |

### Evaluation Criteria

Evaluation uses a 4-level scale.

| Rating | Description | Next Action |
|--------|-------------|-------------|
| Good | No issues | Proceed as-is |
| Minor issues | Small improvements needed | Fix without re-review |
| Clear issues | Definite problems exist | Redesign and re-review |
| Fundamental issues | Design rethink required | Restart from design phase |

### Expected Feedback

| Perspective | Examples |
|-------------|----------|
| Any concerns with the information design artifacts? | Object definitions, screen transitions, navigation structure |
| Any misalignment between screens and the information design? | Consistency between design intent and screen presentation |

**Note**: Details such as spacing and component selection are handled in the UI Review.

### Review Process

1. **Preparation**: Reviewee shares materials (at least 2 business days before review)
2. **Presentation**: Reviewee explains the information design rationale (15 min)
3. **Q&A**: Reviewers ask questions (20 min)
4. **Feedback**: Reviewers provide feedback (15 min)
5. **Wrap-up**: Determine rating and confirm next actions (10 min)

## UI Review

A review focused on the concrete visual layer of product design.

### Scope

| Scope | Description |
|-------|-------------|
| New applications | Newly developed applications |
| Medium to large-scale feature development | Feature additions to existing products |

### Timing

| Development Type | Timing |
|------------------|--------|
| New development | After information design review is complete |
| Medium-scale development | At the lead designer's preferred timing |

### Participants

| Role | Count |
|------|-------|
| Lead designer (reviewee) | 1 |
| Reviewer | 1 (randomly assigned) |

### Review Format

**Asynchronous review** is the default format.

1. Reviewee shares the design file
2. Reviewer provides feedback via comments
3. Reviewee responds and makes corrections

### Expected Feedback

Feedback should follow this format:

| Element | Description |
|---------|-------------|
| Checklist number | The checklist item number from [Design Principles](./design-principles.md) |
| Target | Specific screen or element |
| Issue details | Problem description and improvement suggestion |

#### Feedback Example

```
【#7 Visual Grouping】
Settings screen - "Notification Settings" section

Problem: The spacing between "Email notifications" and "Push notifications"
         is too narrow, making them appear as the same group.

Suggestion: Increase the section spacing from 24px to 40px to clearly
            delineate group boundaries.
```

### Review Goal

Ideally, the review completes in **a single round-trip**: the reviewee receives feedback and responds to any decisions outside the checklist scope.

### Checklist Usage

The UI Review uses the 22-item checklist from [Design Principles](./design-principles.md).

Key items to focus on:

| # | Item |
|---|------|
| 6 | Visual flow |
| 7 | Visual grouping |
| 8 | Page layout |
| 9 | Spacing |
| 10 | Mobile layout |
| 11 | Feedback |
| 17 | Avoiding custom components |
| 21 | Error messages |

## Review Process Flow

```
┌─────────────────────────────────────────────────────────┐
│                    New Development                       │
├─────────────────────────────────────────────────────────┤
│  Start design                                           │
│      ↓                                                  │
│  Create information design artifacts                    │
│      ↓                                                  │
│  【Information Design Review】 ← Re-review if rated     │
│      │                          "Clear issues" or worse │
│      ↓                                                  │
│  Create UI design                                       │
│      ↓                                                  │
│  【UI Review】 ←──────────── Revise and re-check        │
│      ↓                       as needed                  │
│  Start development                                      │
└─────────────────────────────────────────────────────────┘
```

## Review Request Templates

### Information Design Review Request

```markdown
## Information Design Review Request

### Project Name
[Project name]

### Summary
[Brief project description]

### Material Links
- Information design: [link]
- Screen layouts: [link]

### Preferred Date
[List candidate dates]

### Areas to Focus On
- [Focus area 1]
- [Focus area 2]
```

### UI Review Request

```markdown
## UI Review Request

### Target Screens
[List of screens to review]

### Design File
[Figma or other design tool link]

### Background & Context
[Design background and constraints]

### Areas to Focus On
- [Focus area 1]
- [Focus area 2]
```

## Responsive Design Checklist

When reviewing responsive design, verify the following:

- [ ] Layouts are mobile-aware with appropriate breakpoints
- [ ] Sticky/fixed elements do not obscure focused content (e.g., `scroll-padding-top` is set)
- [ ] Layouts work correctly at 200% zoom (no fixed pixel widths that break)
- [ ] Touch-friendly spacing is used on mobile (tap targets meet minimum size)
- [ ] Responsive prefixes (`sm:`, `md:`, `max-md:`) are used consistently

## References

- [Design Principles](./design-principles.md)
- [Design Patterns](./design-patterns.md)
- [Accessibility Checklist](./accessibility.md)
