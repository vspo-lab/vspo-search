# Transcript Search UI Specification

## Overview

This document defines the upgraded `vspo-search` UI.
The experience supports unified conversation-based retrieval from both YouTube transcripts and X posts.

The main workflow combines:

1. Search across sources
2. Follow-up answer generation with citations
3. Cross-source analysis

**Wireframe**: `services/web/wireframe/transcript-search.html`

## UX Goals

### Primary Goal

Move users from "finding content" to "understanding context" with verifiable evidence from both YouTube and X.

### Product Differentiation

1. One query can return video moments and social reactions
2. Follow-up answers cite mixed evidence with source labels
3. Analysis explicitly shows source distribution and trend shifts
4. Users can keep iterating without changing screens

## Visual Direction

### Color Policy

Use a neutral, consistent palette for shell, cards, and controls.

Allowed colorful usage:

1. Member color dots and member-related accents
2. Thumbnail gradients and source logos/icons

Avoid overusing saturated colors for each feature mode.

### Typography

- Display: `Shippori Mincho B1`
- Body/UI: `M PLUS Rounded 1c`

## Layout

### Desktop (>= 769px)

```
┌───────────────────────────────────────────────────────────────┐
│ Header (sticky): Brand + context                              │
├───────────────────────────────────────────────────────────────┤
│ Hero: Value proposition + KPI cards                           │
├──────────────┬────────────────────────────────────────────────┤
│ Sidebar      │ Status bar                                     │
│ - Source     │ Conversation timeline                          │
│ - Scope      │  User message                                  │
│ - OutputMode │  System response                               │
│ - Lens       │   - YouTube results                            │
│ - Members    │   - X results                                  │
│ - Date       │   - Follow-up answer                           │
│ - Value card │   - Analysis                                   │
│              │ Input toolbar + prompt (sticky bottom)         │
└──────────────┴────────────────────────────────────────────────┘
```

### Mobile (<= 768px)

- Sidebar opens as overlay drawer
- Source chips remain visible in input toolbar
- Video and X cards stack vertically

## Component Specification

### 1. Header

- Sticky neutral header with brand and metadata
- Mobile filter toggle for sidebar drawer

### 2. Hero

- Clear statement that search covers YouTube + X
- Feature badges include cross-source retrieval capability
- KPI cards show video and post coverage

### 3. Sidebar

Sections:

1. **Data Source**: `YouTube`, `X`, `All`
2. **Search Scope**: stream/clip toggle
3. **Output Mode**: `Video Search`, `Follow-up Answer`, `Analysis`
4. **Analysis Lens**: topic trend/member share/sentiment/comparison
5. **Members**: member chips with color dots
6. **Date Range**: from/to
7. **Differentiator Callout**: explain mixed-source value

Behavior:

- `All` is the default source mode
- Source filters apply to search, answer context, and analysis
- Analysis lens changes analytics blocks only

### 4. Status Bar

Displays:

- Data readiness
- Indexed video count and indexed X post count
- Last update timestamp
- Runtime capability flags

### 5. System Response Structure

A system response can include these sections:

1. YouTube search cards
2. X search cards
3. Follow-up answer
4. Analysis blocks
5. Next actions

### 6. YouTube Result Card

Includes:

- Thumbnail
- Title
- Channel/member context
- Publish date
- Video type
- Timestamp snippets with keyword highlights

Timestamp links use:

`https://www.youtube.com/watch?v={videoId}&t={seconds}s`

### 7. X Result Card

Includes:

- Author display name and handle
- Post datetime
- Post text snippet with highlights
- Engagement metrics (likes/reposts/replies)
- Link to original post

Post links use source permalink from dataset.

### 8. Follow-up Answer Card

Required:

1. Direct answer statement
2. Short rationale
3. Citation list with source labels (`YouTube`, `X`)

Rules:

- Only cite retrieved evidence
- For mixed-source claims, include both source types when available
- Show uncertainty when source evidence conflicts

### 9. Analysis Section

Required:

1. Summary metrics
2. Source distribution (YouTube vs X)
3. Lens-dependent ranking/trend visual blocks

### 10. Input Area

Contains:

1. Quick mode chips (`Search`, `Answer`, `Analysis`, `Compare`)
2. Source chips (`All`, `YouTube`, `X`)
3. Main input and send action
4. Query syntax hints

## Interaction and State

### Query Submitted

1. Execute retrieval on active source(s)
2. Render grouped results by source
3. If enabled, run answer generation from grouped evidence
4. If enabled, run analysis with source-share metrics
5. Render suggested next actions

### Follow-up Query

- Preserve source filter and member/date context
- Reuse prior candidate set unless user broadens scope

### Failure Handling

- Source-level failures are isolated
- If X retrieval fails, YouTube results still render (and vice versa)
- Error copy follows `event + cause + recovery`

## Accessibility

- Conversation container: `role="log"`, `aria-live="polite"`
- Status bar: `role="status"`
- Source/mode controls must be keyboard accessible
- Card links have clear labels for screen readers
- Mobile sidebar overlay uses focus trap

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial UI shell render | < 1.5 s |
| YouTube-only search | < 500 ms |
| X-only search | < 350 ms |
| Combined search | < 800 ms |
| Follow-up answer generation | < 2.0 s |
| Analysis rendering | < 1.5 s |

## Phase Mapping

| Feature | MVP | Next |
|---------|:---:|:---:|
| YouTube transcript search | Yes | Yes |
| Follow-up grounded answer | Yes | Yes |
| Analysis summary blocks | Yes | Yes |
| X data ingestion and search |  | Yes |
| Mixed-source citations |  | Yes |
| Cross-source share visualization |  | Yes |
| Exportable comparison report |  | Yes |

## References

- [System requirements](./transcript-search.md)
- [Wireframe](../../services/web/wireframe/transcript-search.html)
- [Color Guidelines](../design/colors.md)
- [Typography](../design/typography.md)
- [Design Tokens](../design/design-tokens.md)
- [Accessibility](../design/accessibility.md)
