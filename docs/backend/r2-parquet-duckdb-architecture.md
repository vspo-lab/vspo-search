# R2 Parquet + DuckDB-WASM Architecture

## Overview

Store transcript data as Parquet files on Cloudflare R2 and run full-text search in the browser via DuckDB-WASM. No server-side query processing required.

```
┌─────────────────────────────────────────────────┐
│ Data Ingestion (existing)                       │
│  Cloudflare Worker + yt-dlp → R2 (raw JSON3)   │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ ETL Pipeline (new)                              │
│  R2 raw JSON3 → normalize → Parquet → R2       │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ R2 Public Bucket                                │
│  datasets/v{N}/transcripts.parquet              │
│  datasets/v{N}/transcript_segments.parquet      │
│  datasets/manifest.json                         │
└─────────────────────┬───────────────────────────┘
                      ↓ (HTTP range requests)
┌─────────────────────────────────────────────────┐
│ Browser (DuckDB-WASM)                           │
│  register remote Parquet → SQL full-text search │
└─────────────────────────────────────────────────┘
```

---

## 1. ETL Pipeline: JSON3 → Parquet

### Execution Environment

| Option | Pros | Cons |
|--------|------|------|
| **GitHub Actions (recommended)** | Flexible runtime, cron scheduling, CI integration | Requires R2 API credentials |
| Cloudflare Worker | Direct R2 binding | CPU/memory limits, Parquet library constraints |
| Local script | Easy to develop | Not automatable |

Use GitHub Actions with a scheduled workflow (daily or hourly). Convert JSON3 to Parquet using Node.js (`duckdb-node` or `parquet-wasm`). Write to R2 via S3-compatible API (`@aws-sdk/client-s3`).

### File Layout

```
datasets/
├── manifest.json
└── v{N}/
    ├── transcripts.parquet            # video metadata (~hundreds of KB)
    └── transcript_segments.parquet    # segment text (~several MB to tens of MB)
```

Separate `transcripts` (metadata) from `transcript_segments` (text):

- Metadata-only filtering does not require downloading the segments file.
- DuckDB-WASM can JOIN across both files.

Use a single file per table in Phase 1 (thousands of videos = tens of MB). Consider date/channel partitioning at 10,000+ videos (Phase 3).

### Parquet Schema

**transcripts.parquet**

| Column | Type | Description |
|--------|------|-------------|
| video_id | VARCHAR (not null) | YouTube video ID |
| title | VARCHAR | Video title |
| channel_id | VARCHAR | Channel ID |
| channel_name | VARCHAR | Channel name |
| published_at | TIMESTAMP | Publish datetime (UTC) |
| duration_sec | INTEGER | Video duration in seconds |
| thumbnail_url | VARCHAR | Thumbnail URL |
| video_type | VARCHAR | `stream` or `clip` |

**transcript_segments.parquet**

| Column | Type | Description |
|--------|------|-------------|
| video_id | VARCHAR (not null) | FK to transcripts.video_id |
| start_ms | INTEGER | Segment start time in milliseconds |
| duration_ms | INTEGER | Segment duration in milliseconds |
| text | VARCHAR | Transcript text |

### ETL Flow

1. List all objects under `transcripts/raw/{videoId}/{lang}.json` in R2.
2. Parse each JSON3 file → normalize into `transcripts` + `transcript_segments` records.
3. Generate Parquet files using `duckdb-node` or `parquet-wasm`.
4. Write to `datasets/v{N+1}/` in R2.
5. Update `manifest.json` with the new version number, file sizes, and row counts.

---

## 2. R2 Storage & Access

### Public Access

Use an R2 Custom Domain (e.g., `data.vspo-search.example.com`) with public access enabled. DuckDB-WASM fetches Parquet files directly via HTTP GET with Range request support.

### CORS Configuration

```json
{
  "AllowedOrigins": ["https://vspo-search.example.com"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["Range", "If-None-Match"],
  "ExposeHeaders": ["Content-Length", "Content-Range", "ETag"],
  "MaxAgeSeconds": 86400
}
```

### Cache Strategy

- Parquet files use versioned URLs (`/v{N}/transcripts.parquet`) → strong cache with `Cache-Control: public, max-age=31536000, immutable`.
- `manifest.json` uses a short TTL: `Cache-Control: public, max-age=300`.
- ETag-based conditional requests for revalidation.

### Versioning via manifest.json

```json
{
  "version": 42,
  "generated_at": "2026-02-18T12:00:00Z",
  "files": {
    "transcripts": {
      "path": "v42/transcripts.parquet",
      "size_bytes": 524288,
      "row_count": 2500
    },
    "transcript_segments": {
      "path": "v42/transcript_segments.parquet",
      "size_bytes": 15728640,
      "row_count": 850000
    }
  }
}
```

The browser fetches `manifest.json`, compares with the cached version in `localStorage`, and reloads DuckDB views when a new version is detected.

---

## 3. DuckDB-WASM Client Architecture

### Initialization Flow

```
1. Fetch manifest.json (5-minute cache)
2. Load DuckDB-WASM binary (from CDN)
3. Instantiate database in a Web Worker (off main thread)
4. Register remote Parquet files via httpfs (Range read)
5. Create views for search queries
6. Display "loaded — N videos searchable" in StatusBar
```

### Code Pattern

```typescript
import * as duckdb from '@duckdb/duckdb-wasm';

const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
const worker = new Worker(bundle.mainWorker);
const logger = new duckdb.ConsoleLogger();
const db = new duckdb.AsyncDuckDB(logger, worker);
await db.instantiate(bundle.mainModule);

const conn = await db.connect();

await conn.query(`
  CREATE VIEW transcripts AS
  SELECT * FROM read_parquet('${manifest.files.transcripts.url}');
`);
await conn.query(`
  CREATE VIEW transcript_segments AS
  SELECT * FROM read_parquet('${manifest.files.transcript_segments.url}');
`);
```

### Full-Text Search Implementation

**Phase 1: ILIKE-based (simple, Japanese-compatible)**

```sql
SELECT t.video_id, t.title, t.channel_name, t.published_at,
       t.video_type, t.duration_sec, t.thumbnail_url,
       s.start_ms, s.duration_ms, s.text
FROM transcript_segments s
JOIN transcripts t ON s.video_id = t.video_id
WHERE s.text ILIKE '%keyword%'
  AND t.video_type IN ('stream', 'clip')
  AND t.published_at BETWEEN '2025-01-01' AND '2025-12-31'
ORDER BY t.published_at DESC
LIMIT 50;
```

Multiple keywords:

```sql
WHERE s.text ILIKE '%keyword1%'
  AND s.text ILIKE '%keyword2%'
```

**Japanese search notes:**

- `ILIKE` supports Japanese substring matching without tokenization.
- DuckDB FTS extension uses an English tokenizer — not suitable for Japanese.
- `ILIKE` on compressed Parquet columns is fast enough for thousands of videos (< 500ms).
- Consider n-gram indexing or server-side hybrid search in Phase 3.

### Memory Management

- DuckDB-WASM with `httpfs` reads only the required Row Groups from Parquet, not the entire file.
- Parquet columnar compression (Snappy/ZSTD) reduces transfer size.
- Call `conn.close()` / `db.terminate()` on cleanup.
- Use `beforeunload` event to release resources on page exit.

---

## 4. Considerations & Trade-offs

### Data Size Projections

| Videos | Estimated segment rows | Parquet size (approx.) | Browser load |
|--------|----------------------|----------------------|-------------|
| 1,000 | 300K | ~5 MB | Excellent |
| 5,000 | 1.5M | ~25 MB | Good |
| 10,000 | 3M | ~50 MB | Acceptable |
| 50,000 | 15M | ~250 MB | Needs partitioning |

### Data Freshness

- Daily ETL → up to 24-hour delay.
- Hourly is also possible via GitHub Actions cron.
- Acceptable for transcript data, which is archival in nature.

### R2 Cost

- R2 Class A (write): $4.50 / 1M requests — ETL writes are minimal.
- R2 Class B (read): $0.36 / 1M requests — browser GET/Range requests.
- R2 egress: **free** (Cloudflare R2 advantage).
- Estimated cost for 10K monthly users × 5 queries each = ~$0.02/month.

### Browser Compatibility

- DuckDB-WASM requires: Chrome 80+, Firefox 78+, Safari 14+, Edge 80+.
- SharedArrayBuffer is required → COOP/COEP headers must be set:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

**COOP/COEP impact:** These headers restrict loading cross-origin resources (e.g., YouTube embeds, external images). Mitigations:

- Use `Cross-Origin-Embedder-Policy: credentialless` (Chrome 96+) instead of `require-corp` to allow anonymous cross-origin loads.
- Proxy external images through the same origin if needed.

### Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Parquet file growth (50K+ videos) | Slow initial load | Row Group partitioning, lazy loading by date range |
| DuckDB-WASM memory exhaustion | Browser tab crash | Streaming queries, memory limit configuration |
| COOP/COEP header side effects | External resources blocked | `credentialless` mode, same-origin image proxy |
| R2 public access security | Data exposure | Only place publicly shareable data; no PII or credentials |
| manifest.json cache staleness | Stale search results | ETag + short TTL (5 min) |

---

## 5. Implementation Order

If proceeding to implementation:

1. **ETL pipeline** — JSON3 → Parquet conversion script (GitHub Actions workflow)
2. **R2 bucket setup** — Public access, CORS, Custom Domain
3. **DuckDB-WASM integration** — `@duckdb/duckdb-wasm` package, initialization code, Web Worker
4. **Search query layer** — `features/transcript-search/api/` with DuckDB query functions
5. **UI wiring** — Replace mock data with live DuckDB query results

---

## 6. Open Questions

- [ ] Source of video metadata (title, channel_name, thumbnail_url): YouTube Data API or yt-dlp info_dict?
- [ ] ETL execution frequency: daily vs hourly
- [ ] R2 bucket strategy: share existing `yt-transcripts` bucket or create a separate `vspo-datasets` bucket?
- [ ] COOP/COEP header impact on YouTube embeds and external images

---

## References

- [Transcript search domain requirements](../domain/transcript-search.md)
- [Server architecture](./server-architecture.md)
- [Domain modeling](./domain-modeling.md)
- [DuckDB-WASM documentation](https://duckdb.org/docs/api/wasm/overview)
- [Cloudflare R2 public access](https://developers.cloudflare.com/r2/buckets/public-buckets/)
