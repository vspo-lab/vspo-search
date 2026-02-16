# Transcript Search System Requirements

## Overview

`vspo-search` is a transcript-driven discovery system for YouTube streams and clips.
The product scope now includes three integrated capabilities in one conversation flow:

1. **Search**: find relevant videos and timestamped transcript segments
2. **Follow-up Answer**: generate evidence-grounded answers from retrieved segments
3. **Analysis**: summarize trends and comparisons across candidate videos

The system must make every generated answer and analysis traceable to transcript evidence.

## Product Goals

1. Let users find specific moments from long streams quickly
2. Let users ask follow-up questions without starting over
3. Let users compare members/topics/time windows directly in the same interface
4. Keep operating costs low using browser execution for core retrieval

## Non-Goals (Current Scope)

1. User account system
2. Personalized long-term history sync
3. Fully autonomous insight generation without explicit user prompts

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│ Data Ingestion (Cloudflare Workflow + yt-dlp container)         │
│  - fetch transcript json3                                        │
│  - save raw transcript to R2                                     │
└──────────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│ Data Preparation (ETL)                                           │
│  - normalize metadata and segments                               │
│  - export Parquet datasets for browser query                     │
└──────────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│ Web App (TanStack Start + DuckDB-WASM)                          │
│  Search      -> candidate videos + hit segments                  │
│  Answer      -> grounded response with citations                 │
│  Analysis    -> aggregate metrics from candidate set             │
│  Conversation UI renders all three in one response              │
└──────────────────────────────────────────────────────────────────┘
```

## Domain Capabilities

### 1. Search

Input:

- Query text
- Member filters
- Video type filters
- Date range filters

Output:

- Candidate videos (`top N`)
- Matched transcript segments per video
- Timestamp links for verification

### 2. Follow-up Answer Generation

Input:

- User follow-up question
- Candidate video set from current/previous search turn
- Matched transcript segments

Output:

- Concise answer text
- Confidence hint (optional)
- Citation list (video, timestamp, snippet)

Rules:

1. Do not assert facts without citation candidates
2. If evidence is insufficient, return explicit uncertainty
3. Prefer short grounded synthesis over long speculative text

### 3. Analysis

Input:

- Candidate set and matched segments
- Active analysis lens (topic trend/member share/sentiment/comparison)

Output:

- Aggregated counters and rates
- Ranked entities (member/topic/video)
- Time-window insight (for trend lens)

Rules:

1. Analysis must be reproducible from candidate data
2. Every aggregate metric should map to a clear denominator/window
3. Preserve filter context unless user requests reset

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

### Derived Views

#### `transcript_fulltext`

Full-text concatenation per video for coarse retrieval.

| Column | Type | Description |
|--------|------|-------------|
| video_id | VARCHAR | Video ID |
| full_text | VARCHAR | Concatenated segment text |

#### `search_hit_segments` (runtime temporary view)

Used by Answer and Analysis layers.

| Column | Type | Description |
|--------|------|-------------|
| query_id | VARCHAR | Query execution identifier |
| video_id | VARCHAR | Video ID |
| start_ms | INTEGER | Matched start time |
| text | VARCHAR | Matched transcript snippet |
| score | DOUBLE | Optional relevance score |
| keyword_hits | INTEGER | Matched keyword count |

## Query Flow

### Search SQL (Phase 1 baseline)

```sql
SELECT t.video_id,
       t.title,
       t.channel_name,
       t.thumbnail_url,
       t.published_at,
       t.video_type
FROM transcripts t
JOIN transcript_fulltext ft ON t.video_id = ft.video_id
WHERE ft.full_text ILIKE '%keyword%'
ORDER BY t.published_at DESC
LIMIT 20;
```

### Segment Extraction

```sql
SELECT s.video_id,
       s.start_ms,
       s.duration_ms,
       s.text
FROM transcript_segments s
WHERE s.video_id IN (...candidate_video_ids...)
  AND s.text ILIKE '%keyword%'
ORDER BY s.video_id, s.start_ms;
```

### Answer Pipeline (conceptual)

1. Select high-signal hit segments from candidates
2. Build grounded context bundle
3. Generate concise answer with citation anchors
4. Return answer + citation list

### Analysis Pipeline (conceptual)

1. Group hit segments by selected lens
2. Compute aggregates (count/rate/peak window)
3. Return compact cards and distributions

## UI Requirements Impact

The UI must support section-level rendering in one system response:

1. Search results section
2. Follow-up answer section
3. Analysis section

If one section fails, others should still render with partial success state.

## Error Handling

Follow Result-style error semantics (`event + cause + recovery`).

Error classes:

1. Search execution failure
2. Evidence extraction failure
3. Answer generation timeout/failure
4. Analysis computation failure

Recovery behavior:

- Retry where safe
- Preserve user query in input
- Display fallback text with retry action

## Performance Targets

| Metric | Target |
|--------|--------|
| DuckDB-WASM init | < 3 sec |
| Search query | < 500 ms |
| Follow-up answer generation | < 2 sec |
| Analysis generation | < 1.5 sec |
| End-to-end response (all enabled) | < 3 sec |

## Cost and Scalability

- Keep retrieval in browser for low cost operation
- Keep R2 as source-of-truth store
- For >10k video scale, evaluate partitioning or hybrid server search

## Roadmap

### Phase 1 (Current Target)

1. Transcript search with timestamp results
2. Follow-up grounded answer generation
3. Analysis summary blocks and comparison lens

### Phase 2

1. Better ranking and relevance scoring
2. Saved query presets and sharable analysis links
3. Incremental ETL and freshness metadata automation

### Phase 3

1. Semantic retrieval (hybrid lexical + vector)
2. Cross-session conversation memory
3. Exportable structured reports

## References

- [UI specification](./transcript-search-ui.md)
- [Server architecture](../backend/server-architecture.md)
- [Domain modeling](../backend/domain-modeling.md)
- [Datetime handling](../backend/datetime-handling.md)
- [Frontend error handling](../web-frontend/error-handling.md)
