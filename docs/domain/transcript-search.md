# Transcript Search System Requirements

## Overview

`vspo-search` is a multi-source discovery system for VTuber-related content.
It combines YouTube transcripts and X posts in one conversational workflow.

The product provides three integrated capabilities:

1. **Search**: retrieve relevant YouTube moments and X posts
2. **Follow-up Answer**: generate grounded answers from retrieved evidence
3. **Analysis**: summarize cross-source trends and comparisons

Every answer and analysis result must be traceable to source evidence.

## Product Goals

1. Let users find specific stream moments quickly
2. Add social context from X without leaving the same flow
3. Support follow-up questions with preserved context
4. Keep operation cost low with browser-first retrieval

## Non-Goals (Current Scope)

1. User account system
2. Personalized long-term history sync
3. Autonomous posting or action execution on X

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│ Data Ingestion                                                   │
│  - YouTube transcript fetch (Cloudflare Workflow + yt-dlp)      │
│  - X post collector (scheduled/API-based ingestion)             │
│  - save raw data to R2                                           │
└──────────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│ Data Preparation (ETL)                                           │
│  - normalize video metadata and transcript segments              │
│  - normalize X post metadata and text                            │
│  - export Parquet datasets for browser query                     │
└──────────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│ Web App (TanStack Start + DuckDB-WASM)                          │
│  Search      -> candidate evidence across YouTube and X          │
│  Answer      -> grounded response with mixed-source citations    │
│  Analysis    -> aggregate trends by source/member/topic/time     │
└──────────────────────────────────────────────────────────────────┘
```

## Domain Capabilities

### 1. Search

Input:

- Query text
- Source filter (`youtube` / `x` / `all`)
- Member filters
- YouTube type filter (`stream` / `clip`)
- Date range

Output:

- Candidate video results with timestamps
- Candidate X posts with post links and metrics
- Unified ranked evidence list for downstream use

### 2. Follow-up Answer Generation

Input:

- Follow-up question
- Candidate evidence from current/previous turn
- Active source filters

Output:

- Concise answer
- Confidence hint (optional)
- Citation list with source labels (`YouTube` / `X`)

Rules:

1. Do not assert facts without citation candidates
2. If evidence is weak or source-biased, state uncertainty
3. Prefer short grounded synthesis over speculative text

### 3. Analysis

Input:

- Candidate evidence set
- Active lens (topic trend/member share/sentiment/comparison)

Output:

- Aggregate counts and rates
- Cross-source distribution (YouTube vs X)
- Ranked entities (member/topic/post/video)
- Time-window insights

Rules:

1. Analysis must be reproducible from candidate data
2. Every metric must show denominator/window context
3. Preserve search filters unless user requests reset

## Data Model

### Base Tables

#### `transcripts`

| Column | Type | Description |
|--------|------|-------------|
| video_id | VARCHAR | YouTube video ID |
| title | VARCHAR | Video title |
| channel_id | VARCHAR | Channel ID |
| channel_name | VARCHAR | Channel name |
| published_at | TIMESTAMP | Publish datetime (UTC) |
| duration_sec | INTEGER | Video duration |
| thumbnail_url | VARCHAR | Thumbnail URL |
| video_type | VARCHAR | `stream` / `clip` |

#### `transcript_segments`

| Column | Type | Description |
|--------|------|-------------|
| video_id | VARCHAR | FK to `transcripts.video_id` |
| start_ms | INTEGER | Segment start time |
| duration_ms | INTEGER | Segment duration |
| text | VARCHAR | Transcript text |

#### `x_posts`

| Column | Type | Description |
|--------|------|-------------|
| post_id | VARCHAR | X post ID |
| author_id | VARCHAR | Author account ID |
| author_handle | VARCHAR | Author handle |
| display_name | VARCHAR | Display name |
| posted_at | TIMESTAMP | Post datetime (UTC) |
| lang | VARCHAR | Language code |
| text | VARCHAR | Post body text |
| like_count | INTEGER | Likes |
| repost_count | INTEGER | Reposts |
| reply_count | INTEGER | Replies |
| quote_count | INTEGER | Quotes |
| permalink | VARCHAR | X post URL |

### Derived Views

#### `transcript_fulltext`

Full-text concatenation per video for coarse retrieval.

| Column | Type | Description |
|--------|------|-------------|
| video_id | VARCHAR | Video ID |
| full_text | VARCHAR | Concatenated segment text |

#### `x_posts_fulltext`

Normalized post text for retrieval.

| Column | Type | Description |
|--------|------|-------------|
| post_id | VARCHAR | X post ID |
| full_text | VARCHAR | Normalized post text |

#### `search_hits` (runtime temporary view)

Unified evidence for answer and analysis.

| Column | Type | Description |
|--------|------|-------------|
| query_id | VARCHAR | Query execution ID |
| source_type | VARCHAR | `youtube` / `x` |
| source_id | VARCHAR | `video_id` or `post_id` |
| occurred_at | TIMESTAMP | Published/posted datetime |
| excerpt | VARCHAR | Evidence snippet |
| score | DOUBLE | Ranking score |
| keyword_hits | INTEGER | Keyword hit count |

## Query Flow

### YouTube Search SQL (baseline)

```sql
SELECT t.video_id AS source_id,
       'youtube' AS source_type,
       t.title,
       t.channel_name,
       t.published_at AS occurred_at,
       ft.full_text
FROM transcripts t
JOIN transcript_fulltext ft ON t.video_id = ft.video_id
WHERE ft.full_text ILIKE '%keyword%';
```

### X Search SQL (baseline)

```sql
SELECT p.post_id AS source_id,
       'x' AS source_type,
       p.author_handle,
       p.posted_at AS occurred_at,
       p.text AS full_text,
       p.like_count,
       p.repost_count
FROM x_posts p
WHERE p.text ILIKE '%keyword%';
```

### Unified Ranking (conceptual)

1. Execute source-specific retrieval
2. Normalize to `search_hits`
3. Rank by recency + relevance + engagement
4. Return grouped results by source type

### Answer Pipeline (conceptual)

1. Select high-signal evidence from `search_hits`
2. Build grounded context bundle with source labels
3. Generate concise answer with citation anchors
4. Return answer + mixed-source citations

### Analysis Pipeline (conceptual)

1. Aggregate `search_hits` by lens and source
2. Compute source share, trend windows, and entity ranks
3. Return compact cards and distributions

## UI Requirements Impact

The UI response supports section-level rendering:

1. Search results (YouTube cards + X post cards)
2. Follow-up answer (mixed-source citations)
3. Analysis (includes source-share metrics)

If one source fails, render partial success with source-level error notices.

## Error Handling

Follow Result-style error semantics (`event + cause + recovery`).

Error classes:

1. YouTube search execution failure
2. X search execution failure
3. Evidence extraction failure
4. Answer generation timeout/failure
5. Analysis computation failure

Recovery behavior:

- Retry source fetch where safe
- Preserve user query and filters
- Render partial results from healthy source(s)

## Performance Targets

| Metric | Target |
|--------|--------|
| DuckDB-WASM init | < 3 sec |
| YouTube-only search | < 500 ms |
| X-only search | < 350 ms |
| Combined search | < 800 ms |
| Follow-up answer generation | < 2 sec |
| Analysis generation | < 1.5 sec |

## Cost and Scalability

- Keep retrieval browser-first for low baseline cost
- Store normalized datasets in R2 as Parquet
- For larger scale (>10k videos, >1M posts), evaluate hybrid server retrieval

## Roadmap

### Phase 1 (Current Target)

1. YouTube transcript search with timestamp links
2. Follow-up grounded answer generation
3. Analysis summary blocks and comparison lens

### Phase 2

1. X data ingestion and normalized post search
2. Mixed-source citations in answer generation
3. Cross-source analysis metrics and filters

### Phase 3

1. Hybrid lexical + semantic retrieval
2. Cross-session memory and personalized ranking
3. Exportable structured reports

## References

- [UI specification](./transcript-search-ui.md)
- [Server architecture](../backend/server-architecture.md)
- [Domain modeling](../backend/domain-modeling.md)
- [Datetime handling](../backend/datetime-handling.md)
- [Frontend error handling](../web-frontend/error-handling.md)
