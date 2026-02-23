# Voice Collection Data Architecture

## Overview

Store voice clip audio files and catalog metadata on Cloudflare R2. Serve clips directly to the browser for playback, with client-side audio processing for merging and download.

```
┌──────────────────────────────────────────────────┐
│ Audio Ingestion                                   │
│  Admin: yt-dlp extraction → MP3 → R2 upload      │
│  UGC:   submission → review → yt-dlp → R2        │
└─────────────────────┬────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│ R2 Bucket (vspo-voice-clips)                      │
│  clips/{clipId}.mp3              (audio files)    │
│  catalog/v{N}/clips.json         (metadata)       │
│  catalog/v{N}/categories.json    (reference data) │
│  manifest.json                   (versioning)     │
└─────────────────────┬────────────────────────────┘
                      ↓ (HTTP fetch)
┌──────────────────────────────────────────────────┐
│ Browser                                           │
│  Catalog fetch → HTML5 Audio playback             │
│  Web Audio API merge → Blob download              │
└──────────────────────────────────────────────────┘
```

---

## 1. R2 Bucket Layout

```
vspo-voice-clips/
├── manifest.json
├── clips/
│   ├── {clipId}.mp3
│   └── ...
├── catalog/
│   └── v{N}/
│       ├── clips.json
│       └── categories.json
└── submissions/          (Phase 2)
    └── {submissionId}.json
```

### Audio Files

- Format: MP3, 128kbps, mono
- Max duration: 30 seconds per clip
- Max file size: ~500 KB per clip (128kbps × 30s ≈ 480KB)
- Path: `clips/{clipId}.mp3`
- Naming: UUID-based clip IDs

### Catalog Files

- `clips.json`: array of all approved Clip objects (see domain model)
- `categories.json`: array of Category reference data
- Versioned under `catalog/v{N}/` for cache-busting

---

## 2. Clip Catalog Format

### Phase 1: Static JSON

Single `clips.json` containing all clip metadata:

```json
{
  "clips": [
    {
      "id": "clip-001",
      "title": "おはよう！",
      "memberId": "hinano",
      "categoryId": "cat-greetings",
      "duration": 5,
      "likeCount": 42,
      "createdAt": "2026-01-15",
      "audioUrl": "https://voice.vspo-search.example.com/clips/clip-001.mp3",
      "sourceVideoId": "dQw4w9WgXcQ",
      "sourceStartMs": 120000,
      "status": "approved"
    }
  ]
}
```

Browser loads the full catalog on init and filters/sorts in memory. Suitable for < 1,000 clips.

### Phase 2+: Parquet Migration

For catalogs exceeding 1,000 clips, migrate to Parquet format and reuse the DuckDB-WASM infrastructure from transcript search. This enables SQL-based filtering and sorting in the browser without loading the entire dataset.

---

## 3. Manifest Versioning

Same pattern as transcript datasets:

```json
{
  "version": 1,
  "generated_at": "2026-02-23T12:00:00Z",
  "files": {
    "clips": {
      "path": "catalog/v1/clips.json",
      "size_bytes": 51200,
      "clip_count": 100
    },
    "categories": {
      "path": "catalog/v1/categories.json",
      "size_bytes": 1024,
      "category_count": 8
    }
  }
}
```

Browser fetches `manifest.json` on load, compares with cached version in localStorage, and reloads catalog when a new version is detected.

---

## 4. CORS Configuration

Same pattern as transcript Parquet files:

```json
{
  "AllowedOrigins": ["https://vspo-search.example.com"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["Range", "If-None-Match"],
  "ExposeHeaders": ["Content-Length", "Content-Range", "ETag"],
  "MaxAgeSeconds": 86400
}
```

---

## 5. Cache Strategy

| Resource | Cache-Control | Rationale |
|----------|--------------|-----------|
| `clips/{id}.mp3` | `public, max-age=31536000, immutable` | Audio files never change |
| `catalog/v{N}/clips.json` | `public, max-age=31536000, immutable` | Versioned URL |
| `manifest.json` | `public, max-age=300` | Short TTL for freshness |

ETag-based conditional requests for `manifest.json` revalidation.

---

## 6. UGC Submission Pipeline

### Phase 1: Manual Processing

1. Frontend submits `ClipSubmission` JSON to R2 `submissions/` prefix
2. Admin reviews submissions manually
3. Admin extracts audio via yt-dlp on local machine
4. Admin uploads approved clip MP3 to `clips/`
5. Admin updates `clips.json` catalog and bumps manifest version

### Phase 2: Automated Pipeline

1. Cloudflare Worker receives `POST /clip-submissions`
2. Validates YouTube URL format and accessibility
3. Stores submission metadata in R2 `submissions/`
4. On admin approval, queues audio extraction job
5. yt-dlp container (existing transcriptor infra) extracts audio segment:
   ```
   yt-dlp -x --audio-format mp3 \
     --postprocessor-args "-ss {startMs/1000} -to {endMs/1000}" \
     {youtubeUrl}
   ```
6. Converts to MP3 (128kbps, mono), stores in R2 `clips/`
7. Updates catalog and manifest

### Audio Extraction Parameters

- Tool: yt-dlp + ffmpeg (reuses existing Cloudflare Container setup from transcriptor)
- Output: MP3, 128kbps, mono channel
- Max clip duration: 30 seconds
- Timeout: 60 seconds per extraction

---

## 7. Client-Side Audio Processing

### Merging Architecture

```
1. Fetch clip audio files (parallel HTTP requests)
2. Decode each to AudioBuffer via AudioContext.decodeAudioData()
3. Create output buffer (sum of all durations × sample rate)
4. Copy each buffer's channel data into output at correct offset
5. Encode output to target format
6. Create Blob URL → trigger download
```

### Encoding

| Format | Library | Size Estimate (1 min) | Browser Support |
|--------|---------|----------------------|-----------------|
| WAV | Native ArrayBuffer | ~5.3 MB (44.1kHz, 16-bit, mono) | All |
| MP3 | lamejs (~150KB) | ~960 KB (128kbps) | All (JS library) |

### Memory Considerations

- Each second of decoded audio ≈ 88 KB (44.1kHz, 16-bit, mono)
- 5 minutes max = ~26 MB AudioBuffer
- Release source buffers after copying into output
- Use `URL.revokeObjectURL()` after download completes

---

## 8. Cost Estimates

### R2 Storage

| Item | Size | Cost |
|------|------|------|
| 1,000 clips × 500KB | 500 MB | Free (first 10 GB free) |
| Catalog JSON | < 1 MB | Negligible |

### R2 Requests

| Scenario | Monthly Requests | Cost |
|----------|-----------------|------|
| 10K users × 20 clips/session | 200K Class B reads | ~$0.07 |
| 10K catalog fetches | 10K Class B reads | < $0.01 |

R2 egress is free (Cloudflare advantage).

---

## References

- [Voice collection domain requirements](../domain/voice-collection.md)
- [R2 Parquet architecture](./r2-parquet-duckdb-architecture.md)
- [Server architecture](./server-architecture.md)
