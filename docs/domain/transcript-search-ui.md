# Transcript Search UI Specification

## Overview

This document defines the UI specification for the upgraded `vspo-search` experience.
The screen is no longer a video-search-only interface.
It now provides a single conversational workflow for:

1. Video search from transcript data
2. Follow-up answer generation grounded in transcript evidence
3. Multi-video analysis for trends and comparisons

**Wireframe**: `services/web/wireframe/transcript-search.html`

## UX Goals

### Primary Goal

Help users move from "find a relevant video" to "get a verifiable answer" and then to "understand broader patterns" without leaving one screen.

### Differentiation from generic video search

The UI must make the following value visible:

1. Evidence-grounded follow-up answers with timestamp citations
2. Analysis view generated from the same candidate set (no context switch)
3. Continuous conversational memory for iterative questions
4. Suggested next actions (compare, share, drill deeper)

## Visual Direction

### Color Policy

Use a mostly neutral and consistent palette for shell, cards, controls, and system states.

Allowed colorful usage:

1. Member color dots and member-identifying accents
2. Thumbnail mock gradients that include member color

Not allowed:

1. Multiple vivid accent colors for unrelated UI controls
2. Different saturated colors for each feature mode (Search/Answer/Analysis)

### Typography

- Display: `Shippori Mincho B1`
- Body/UI: `M PLUS Rounded 1c`
- Keep body text legible with compact but readable spacing

## Layout

### Desktop (>= 769px)

```
┌───────────────────────────────────────────────────────────────┐
│ Header (sticky): Brand + prototype/meta                      │
├───────────────────────────────────────────────────────────────┤
│ Hero: Product promise + feature badges + KPI cards           │
├──────────────┬────────────────────────────────────────────────┤
│ Sidebar      │ Status Bar                                     │
│ - Scope      │ Conversation timeline                          │
│ - OutputMode │  User question                                 │
│ - Lens       │  System response                               │
│ - Members    │   - Search results                             │
│ - Date       │   - Follow-up answer                           │
│ - Value card │   - Analysis blocks                            │
│              │ Input toolbar + input field (sticky bottom)    │
└──────────────┴────────────────────────────────────────────────┘
```

### Mobile (<= 768px)

- Sidebar opens as overlay drawer
- Main conversation remains primary surface
- KPI cards collapse into stacked layout
- Video cards switch from horizontal to vertical

## Component Specification

### 1. Header

- Sticky with blurred neutral background
- Contains brand and compact environment label
- Mobile filter button toggles sidebar overlay

### 2. Hero

- Communicates upgraded value proposition
- Shows three feature badges: Search, Follow-up Answer, Analysis
- Shows KPI mini-cards:
  - Indexed Videos
  - Answer Mode state
  - Current Analysis Lens

### 3. Sidebar

Sections:

1. **Search Scope**: stream/clip toggle chips
2. **Output Mode**: selectable cards for `Video Search`, `Follow-up Answer`, `Analysis`
3. **Analysis Lens**: topic trend, member share, sentiment tone, comparison
4. **Members**: member chips with member color dot
5. **Date Range**: `from` and `to`
6. **Differentiator Callout**: short bullets explaining product value

Behavior:

- Member chip interaction keeps `All` fallback behavior
- Output mode chips can be independently enabled/disabled
- Analysis lens affects only analysis cards and not search SQL filters

### 4. Status Bar

Shows:

- Data readiness
- Indexed video count
- Last update timestamp
- Runtime capability flags (answer grounding, analysis cache)

### 5. Conversation Message (System)

A system message can contain up to three result sections:

1. **Search Results**
2. **Follow-up Answer**
3. **Analysis**

The message header includes a mode switch display so users understand what was generated.

### 6. Search Result Cards

Each card includes:

- Thumbnail
- Title
- Channel (member color dot)
- Publish date
- Video type tag (neutral style)
- Transcript timestamp snippets with highlighted terms

Timestamp links must use:

`https://www.youtube.com/watch?v={videoId}&t={seconds}s`

### 7. Follow-up Answer Card

Required elements:

1. Direct answer sentence
2. Brief rationale paragraph
3. Citation list (timestamp + quote snippet source)

Rules:

- Answer must be grounded only in retrieved transcript segments
- Citation count should be >= 2 for non-trivial answers
- If evidence is weak, explicitly show low-confidence message

### 8. Analysis Section

Required blocks:

1. Summary metrics (count, top member, peak window)
2. Distribution bars or equivalent compact visualization
3. Lens-dependent details (topic trend/member share/sentiment/comparison)

Analysis is generated from the same candidate set returned by search, unless user requests wider scope.

### 9. Next Actions

Show contextual action chips under system response:

- Continue comparison
- Share answer
- Show more evidence

### 10. Input Area

Contains:

1. Quick mode chips (`Search`, `Answer`, `Analysis`, `Comparison report`)
2. Main input
3. Send button
4. Hint text for keyboard shortcuts and query syntax

## Interaction and State

### Initial State

- Hero visible in expanded form
- Empty conversation area contains prompt examples (future implementation)

### Query Submitted

1. Run transcript search with active filters
2. Render Search section
3. If enabled, run Answer generation over result snippets
4. If enabled, run Analysis aggregation over same result set
5. Render Next Actions

### Follow-up Query

- Keep previous context (selected members, filters, candidate result set)
- Show explicit context inheritance indicator (future enhancement)

### Errors

Error messages must follow `event + cause + recovery` structure:

- Search query failure
- Answer generation timeout
- Analysis computation failure

Each failed section may show partial fallback while keeping other successful sections visible.

## Accessibility

- Conversation container: `role="log"`, `aria-live="polite"`
- Status bar: `role="status"`
- Mode switch and mode chips: keyboard operable and focus visible
- Timestamps: meaningful link text for screen readers
- Sidebar overlay: focus trap on mobile

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial UI render (hero + shell) | < 1.5 s |
| Search response | < 500 ms (1k videos scale) |
| Follow-up answer generation | < 2.0 s |
| Analysis block generation | < 1.5 s |
| Combined response (all modes) | < 3.0 s |

## Phase Mapping

| Feature | MVP | Next |
|---------|:---:|:---:|
| Transcript keyword search | Yes | Yes |
| Timestamp citation links | Yes | Yes |
| Follow-up grounded answer | Yes | Yes |
| Analysis summary blocks | Yes | Yes |
| Next action shortcuts | Yes | Yes |
| Comparison report export |  | Yes |
| Long-term memory across sessions |  | Yes |

## References

- [System requirements](./transcript-search.md)
- [Wireframe](../../services/web/wireframe/transcript-search.html)
- [Color Guidelines](../design/colors.md)
- [Typography](../design/typography.md)
- [Design Tokens](../design/design-tokens.md)
- [Accessibility](../design/accessibility.md)
