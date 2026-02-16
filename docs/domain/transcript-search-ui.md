# Transcript Search UI Specification

## Overview

Frontend UI specification for "Where was that video? Vspo Search!".
Defines the screen design for a chat-style search interface that helps users discover videos from transcript data.

**Wireframe**: `services/transcriptor/wireframe/transcript-search.html`

---

## 1. Screen Layout

### Overall Layout

```
┌─────────────────────────────────────────────────┐
│  Header (sticky)                                │
│  [Brand]                [Filter (mobile)]       │
├─────────────────────────────────────────────────┤
│  Hero (shown only initially, compact after search)│
│  "Where was that video?"                          │
├──────────┬──────────────────────────────────────┤
│ Sidebar  │  Status Bar                          │
│ Filters  │  Chat Messages                       │
│          │  ┌─ User ──────────────────────────┐ │
│          │  │ Search keyword                   │ │
│          │  └──────────────────────────────────┘ │
│          │  ┌─ System ─────────────────────────┐│
│          │  │ N results found                   ││
│          │  │ [Video card]                      ││
│          │  │ [Video card]                      ││
│          │  └──────────────────────────────────┘ │
│          │                                      │
│          │  ┌─ Input Area (sticky bottom) ─────┐│
│          │  │ [Enter keyword...]        [Send]  ││
│          │  └──────────────────────────────────┘ │
└──────────┴──────────────────────────────────────┘
```

### Responsive Behavior

| Element | Desktop (>768px) | Mobile (<=768px) |
|---------|-------------------|------------------|
| Sidebar | Always visible in left column | Overlay with open/close toggle |
| Hero | Full display | Compact (reduced font size) |
| Video card | Thumbnail left + info right (horizontal) | Thumbnail top + info bottom (vertical) |
| Input hints | Show Enter/AND/OR hints | Hidden |
| Status bar | Visible | Visible |

---

## 2. Element Details

### 2.1 Header

| Element | Description |
|---------|-------------|
| Brand icon | Search icon + lime-yellow background |
| Brand name | "Vspo Search" (Shippori Mincho B1) |
| Tagline | "Where was that video?" (muted) |
| Filter button | Mobile only, toggles sidebar |

- `position: sticky; top: 0` for fixed positioning
- `backdrop-filter: blur(16px)` for background blur

### 2.2 Hero

**Initial display:**
- Heading: "Where was that video?" (h1, Shippori Mincho B1)
- Lime-yellow underline highlight on the key phrase
- Description: "Find videos by topic from VTuber stream and clip transcripts"
- Feature badges: "Browser-only", "DuckDB-WASM", "No server required"

**After search (future consideration):**
- Collapse the hero to show only the brand name
- Maximize the chat area display space

### 2.3 Sidebar (Filters)

#### Channel Filter
- "All" chip (active by default)
- Display each channel name as a chip
- Exclusive selection: selecting "All" deselects others; selecting an individual channel deselects "All"
- Automatically reverts to "All" when nothing is selected

#### Video Type Filter
- "Stream" toggle: mint-colored active style
- "Clip" toggle: blue-colored active style
- Supports toggling both ON / one ON / both OFF (= show all)

#### Date Range Filter
- Start date / end date inputs
- Default: last 1 month

### 2.4 Status Bar

- Position: top of the chat area
- Content: "Parquet data loaded - 1,234 videos available for search"
- Green dot (mint color) + pulse animation for a live indicator
- Show data last-updated timestamp (future)

### 2.5 Chat Messages

#### User Message
- Right-aligned
- Dark bubble (ink background, white text)
- Avatar: lime-yellow background with "U"

#### System Message
- Left-aligned
- White bubble + border + card shadow
- Avatar: ink background with search icon
- Result count display: "N results found"

### 2.6 Video Card

| Element | Specification |
|---------|---------------|
| Thumbnail | 16:9 aspect ratio, 160x90px (desktop) / 100% width (mobile) |
| Thumbnail color | Stream: beige-to-mint gradient / Clip: beige-to-blue gradient |
| Play icon | Show white circle + play triangle on hover |
| Video duration | Black background badge in bottom-right (e.g., 3:45:20) |
| Title | Bold, max 2 lines (line-clamp) |
| Channel name | ink-soft color |
| Publish date | YYYY/MM/DD format |
| Type badge | Stream: mint / Clip: blue, pill shape |
| Timestamp | Lime-yellow time badge + matched text |

#### Timestamp Behavior
- Click navigates to the corresponding YouTube timecode
- URL format: `https://www.youtube.com/watch?v={videoId}&t={seconds}s`
- On hover: time badge fills with lime-yellow
- Matched keywords highlighted with `<mark>`

### 2.7 Input Area

- `position: sticky; bottom: 0` for fixed positioning at the bottom
- Background gradient (from bg to transparent) for a fade-out effect
- Input field: pill shape (border-radius: 2xl)
- Send button: lime-yellow circular button
- Hints: "Press Enter to send", "Use AND / OR for multi-keyword search"

---

## 3. Additional Features and States

### 3.1 Empty State (Initial)

Introductory content displayed in the chat area before any search.

```
┌──────────────────────────────────────────┐
│  Welcome!                                │
│                                          │
│  Enter a search keyword to explore       │
│  the contents of streams and clips.      │
│                                          │
│  💡 Search tips:                          │
│  ┌─────────────────────────────────────┐ │
│  │ "tournament practice"  Search by topic│ │
│  │ "Kaga Sumire"    Filter by streamer   │ │
│  │ "VALORANT highlight" Game x topic    │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  Sample searches:                         │
│  [Tournament practice] [Collab stream] [Chat] │
└──────────────────────────────────────────┘
```

**Requirements:**
- Display 3 search hint examples (clicking one executes the search)
- Sample search chips: clicking a chip immediately searches with that keyword
- Hidden after the first search is executed

### 3.2 Loading States

#### DuckDB-WASM Initialization

```
┌─────────────────────────────────────┐
│  Preparing search engine...           │
│  ████████░░░░░░░░  50%              │
│                                     │
│  Step 1/3: Loading DuckDB-WASM      │
│  Step 2/3: Fetching data            │
│  Step 3/3: Building search index    │
└─────────────────────────────────────┘
```

**Requirements:**
- 3-step progress display:
  1. Loading DuckDB-WASM binary
  2. Fetching Parquet files from R2
  3. Table registration and readiness
- Show checkmark (complete) or spinner (in progress) for each step
- Disable the input field during initialization with placeholder "Preparing..."

#### Search In Progress
- Show spinner on the send button
- Display 3-dot animation (typing indicator) in the system message
- Do NOT disable the input field (allow preparing the next search)

### 3.3 Error States

#### WASM-Incompatible Browser

```
┌────────────────────────────────────────┐
│  ⚠ Search is not available in your      │
│    browser                              │
│                                        │
│  This search feature requires a         │
│  WebAssembly-compatible browser.        │
│                                        │
│  Recommended browsers:                  │
│  • Chrome 57+                          │
│  • Firefox 52+                         │
│  • Safari 11+                          │
│  • Edge 16+                            │
└────────────────────────────────────────┘
```

#### Parquet Load Failure

```
┌────────────────────────────────────────┐
│  ⚠ Failed to load data                  │
│                                        │
│  Please check your network connection.  │
│  [Reload]                               │
└────────────────────────────────────────┘
```

**Requirements:**
- Error messages follow the `Result` type pattern (event + cause + resolution)
- Provide a retry button (show manual retry after 3 automatic retries)
- Orange (--orange) warning style

#### Search Error
- On SQL execution failure: "An error occurred during search. Please try a different keyword."
- Displayed inline within the chat bubble

### 3.4 Zero Results

```
┌──────────────────────────────────────────┐
│  No videos matching "{keyword}" were      │
│  found                                   │
│                                          │
│  Tips:                                    │
│  • Try a different keyword                │
│  • Broaden your filters                   │
│  • Try a shorter keyword                  │
│                                          │
│  Related searches:                        │
│  [{partial keyword}] [{similar term}]     │
└──────────────────────────────────────────┘
```

**Requirements:**
- Echo back the input keyword
- Display 3 specific improvement suggestions
- Show a "Reset filters" button when filters are active

### 3.5 Pagination / Load More

- Initial display: up to 10 results
- "Show more" button loads +10 results at a time
- Total count shown in the result summary: "23 results found (showing 10)"

### 3.6 Sorting

Toggle the result order.

| Sort | SQL | Default |
|------|-----|---------|
| Newest first | `ORDER BY published_at DESC` | Yes |
| Oldest first | `ORDER BY published_at ASC` | |
| Most matches | Matched segment count DESC | |

**UI:**
- Dropdown next to the result count in the system message
- Re-query results on toggle

### 3.7 URL Sharing / Deep Links

Reflect search state in the URL for sharing.

```
/search?q=tournament+practice&channel=Kaga+Sumire&type=stream&from=2025-01-01&to=2025-01-31
```

| Parameter | Description |
|-----------|-------------|
| `q` | Search keyword |
| `channel` | Channel name filter (multiple: comma-separated) |
| `type` | `stream` / `clip` / `all` |
| `from` | Start date (YYYY-MM-DD) |
| `to` | End date (YYYY-MM-DD) |
| `sort` | `newest` / `oldest` / `relevance` |

**Requirements:**
- Update URL via `history.replaceState` on each search execution
- Restore initial state from URL parameters
- Share button: copy URL to clipboard + toast notification

### 3.8 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Execute search |
| `/` | Focus the search input |
| `Escape` | Close filter sidebar / clear input |

### 3.9 Data Freshness Display

Show last-updated timestamp in the status bar or footer.

- Format: "Last updated: 2025-01-25 12:00 JST"
- Retrieved from Parquet file metadata
- Warning style if data is more than 24 hours old

---

## 4. Accessibility

### ARIA Roles

| Element | Role / Attribute |
|---------|------------------|
| Chat area | `role="log"` `aria-live="polite"` |
| Search input | `aria-label="Enter search keyword"` |
| Send button | `aria-label="Search"` |
| Filter button | `aria-label="Open filters"` `aria-expanded` |
| Sidebar | `role="complementary"` `aria-label="Search filters"` |
| Video card | `role="article"` |
| Result count | `aria-live="polite"` for screen reader announcement |
| Status bar | `role="status"` |

### Focus Management

- All interactive elements have a `:focus-visible` style (2px solid ink, offset 2px)
- After search execution, move focus to the first result
- Focus trap when modal sidebar is open/closed
- Return focus to the trigger button when sidebar is closed via `Escape`

### Screen Reader Support

- On search results display: announce "{N} videos found" via aria-live
- Video card: title + channel name + date must be readable
- Timestamp link: read as "Jump to {time}: {text}"

---

## 5. Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| DuckDB-WASM initialization | < 3 sec | gzip transfer, Web Worker |
| Parquet load (10 MB) | < 2 sec | HTTP Range Request + cache |
| Search response | < 500 ms | For ~1,000 videos |
| FCP (First Contentful Paint) | < 1.5 sec | Hero + input field render immediately |
| TTI (Time to Interactive) | < 5 sec | Until WASM load completes |

### Caching Strategy

| Target | Method | TTL |
|--------|--------|-----|
| DuckDB-WASM binary | Service Worker / Cache API | 7 days |
| Parquet files | Cache API + ETag | 1 day (Stale-While-Revalidate) |
| Search results | In-memory (Map) | Session duration |

---

## 6. Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 57+ | SharedArrayBuffer recommended |
| Firefox | 52+ | |
| Safari | 11+ | Including iOS Safari |
| Edge | 16+ | Chromium-based recommended |

**When WASM is not supported:**
- Display a fallback screen (with recommended browser information)
- Search functionality is disabled

---

## 7. Phase Mapping

| Feature | Phase 1 (MVP) | Phase 2 | Phase 3 |
|---------|:---:|:---:|:---:|
| Keyword search (ILIKE) | Yes | Yes | Yes |
| Channel filter | Yes | Yes | Yes |
| Video type filter | Yes | Yes | Yes |
| Date range filter | Yes | Yes | Yes |
| Timestamp links | Yes | Yes | Yes |
| Keyword highlighting | Yes | Yes | Yes |
| Video card display | Yes | Yes | Yes |
| Responsive layout | Yes | Yes | Yes |
| Loading states | Yes | Yes | Yes |
| Error states | Yes | Yes | Yes |
| Zero results display | Yes | Yes | Yes |
| Empty state (initial) | Yes | Yes | Yes |
| Keyboard shortcuts | Yes | Yes | Yes |
| Pagination | Yes | Yes | Yes |
| Sort toggle | | Yes | Yes |
| URL sharing / deep links | | Yes | Yes |
| Data freshness display | | Yes | Yes |
| Hero collapse | | Yes | Yes |
| Search suggestions | | Yes | Yes |
| Search history (local) | | Yes | Yes |
| Semantic search | | | Yes |
| Natural language query (LLM) | | | Yes |
| Similar video recommendations | | | Yes |

---

## 8. Member Colors

Used for channel filter color indicators, thumbnail backgrounds, and avatars.

### JPメンバー

| メンバー名 | HEX | RGB |
|------------|-----|-----|
| 花芽すみれ | `#B0C4DE` | 176, 196, 222 |
| 花芽なずな | `#FABEDC` | 250, 190, 220 |
| 小雀とと | `#F5EB4A` | 255, 243, 63 |
| 一ノ瀬うるは | `#4182FA` | 65, 130, 250 |
| 胡桃のあ | `#FFDBFE` | 255, 219, 254 |
| 兎咲ミミ | `#C7B2D6` | 199, 178, 214 |
| 空澄セナ | `#FFFFFF` | 255, 255, 255 |
| 橘ひなの | `#FA96C8` | 250, 150, 200 |
| 英リサ | `#D1DE79` | 209, 222, 121 |
| 如月れん | `#BE2152` | 190, 33, 82 |
| 神成きゅぴ | `#FFD23C` | 255, 210, 60 |
| 八雲べに | `#85CAB3` | 133, 202, 179 |
| 藍沢エマ | `#B4F1F9` | 180, 241, 249 |
| 紫宮るな | `#D6ADFF` | 241, 173, 255 |
| 猫汰つな | `#FF3652` | 255, 54, 82 |
| 白波らむね | `#8ECED9` | 142, 206, 217 |
| 小森めと | `#FBA03F` | 251, 160, 63 |
| 夢野あかり | `#FF998D` | 255, 153, 141 |
| 夜乃くろむ | `#909EC8` | 144, 158, 200 |
| 紡木こかげ | `#5195E1` | 81, 149, 225 |
| 千燈ゆうひ | `#ED784A` | 237, 120, 74 |
| 蝶屋はなび | `#EA5506` | 234, 85, 6 |
| 甘結もか | `#ECA0AA` | 236, 160, 170 |
| 銀城サイネ | `#58535E` | 88, 83, 94 |
| 龍巻ちせ | `#BEFF77` | 190, 255, 119 |

### EN Members

| Member Name | HEX | RGB |
|-------------|-----|-----|
| Remia Aotsuki | `#398FB2` | 57, 143, 178 |
| Arya Kuroha | `#000000` | 0, 0, 0 |
| Jira Jisaki | `#606D3D` | 96, 109, 61 |
| Narin Mikure | `#F3A6EF` | 243, 166, 239 |
| Riko Solari | `#9373D7` | 147, 115, 215 |
| Eris Suzukami | `#90B2F8` | 144, 178, 248 |

### Usage in UI

- **Filter chips**: Display a colored dot (8px) to the left of the member name
- **Thumbnail backgrounds**: Gradient from member color to beige
- **Channel name**: Underline or dot in member color

---

## 9. References

- [Requirements (System & Data)](./transcript-search.md)
- [Wireframe](../../services/transcriptor/wireframe/transcript-search.html)
- [Color Guidelines](../design/colors.md)
- [Typography](../design/typography.md)
- [Design Tokens](../design/design-tokens.md)
- [Design Patterns](../design/design-patterns.md)
- [Accessibility](../design/accessibility.md)
