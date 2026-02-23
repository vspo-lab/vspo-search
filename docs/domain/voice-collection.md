# Voice Collection System Requirements

## Overview

`ぶいすぽコレクション（音声）` is a voice clip collection app for Vspo fans.
It lets users browse curated voice clips, build personal collections, and contribute new clips from streams.

The product provides three integrated capabilities:

1. **Discover**: browse curated voice clips by member, category, and popularity
2. **Collect**: like clips, create playlists, merge and download audio
3. **Contribute**: submit new voice clips from YouTube streams (UGC)

## Product Goals

1. Let fans discover and replay memorable voice moments from Vspo members
2. Enable personal collections through likes and playlists (no account required)
3. Support community contribution of new clips via UGC pipeline
4. Allow audio merging and download for personal enjoyment

## Non-Goals (Current Scope)

1. User authentication or account system (MVP uses localStorage)
2. Real-time streaming or live audio capture
3. Commercial redistribution of audio content
4. Full social features (commenting, sharing, following)
5. Automated content moderation (manual review in MVP)

## High-Level Architecture

```
┌──────────────────────────────────────────────────┐
│ Audio Ingestion                                   │
│  - Admin: yt-dlp audio extraction (existing infra)│
│  - UGC: submission form → pending queue           │
└─────────────────────┬────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│ Audio Storage (R2)                                │
│  clips/{clipId}.mp3          (audio files)        │
│  catalog/v{N}/clips.json     (clip metadata)      │
│  manifest.json               (version tracking)   │
└─────────────────────┬────────────────────────────┘
                      ↓ (HTTP fetch)
┌──────────────────────────────────────────────────┐
│ Web App (TanStack Start)                          │
│  Browse/filter → Play → Like/Playlist → Merge/DL │
│  Client state: localStorage (likes, playlists)    │
└──────────────────────────────────────────────────┘
```

## Domain Capabilities

### 1. Curated Voice Display

Input:

- Member filter (optional)
- Category filter (optional)
- Sort order (`popular` / `new`)

Output:

- Paginated clip list with metadata

Rules:

1. Clips are pre-curated (admin-approved) before appearing in the catalog
2. Each clip displays: avatar initial, title, member name, duration, like count
3. Only clips with `status: approved` are shown to users

### 2. Sorting

Input:

- Sort mode (`popular` / `new`)

Output:

- Re-ordered clip list

Rules:

1. Popular = descending `likeCount`
2. New = descending `createdAt`
3. Sort is combinable with member and category filters

### 3. Like Functionality

Input:

- Clip ID toggle action

Output:

- Updated like state (local)

Rules:

1. localStorage-based persistence (key: `vspo-voice-likes`)
2. Stored as JSON array of clip IDs, validated via Zod
3. Cross-tab synchronization via `StorageEvent` listener
4. Server-side `likeCount` on clips is a read-only aggregate (not affected by local likes in MVP)
5. No rate limiting in MVP (local-only operation)

### 4. Playlist Creation

Input:

- Playlist title, clip additions/removals, reorder

Output:

- Persistent playlist collection (local)

Rules:

1. localStorage-based persistence (key: `vspo-voice-playlists`)
2. Favorites playlist is a built-in special playlist (ID: `pl-fav`)
3. Custom playlist IDs: `pl-{Date.now()}`
4. Operations: create, delete, addClip, removeClip, reorderClips
5. No playlist sharing in MVP

### 5. Voice Merging and Download

Input:

- Ordered list of clip IDs
- Output format (`mp3` / `wav`)

Output:

- Single merged audio file for download

Rules:

1. Client-side merging via Web Audio API (AudioContext + AudioBuffer concatenation)
2. MP3 encoding via lamejs; WAV via native ArrayBuffer construction
3. Maximum: 20 clips or 5 minutes total duration
4. Progress indicator shown during encoding
5. Estimated file size displayed before download

Audio processing pipeline:

1. Fetch individual audio buffers (from `audioUrl`)
2. Decode to AudioBuffer via `AudioContext.decodeAudioData()`
3. Concatenate buffers in user-specified order
4. Encode to target format
5. Create Blob URL and trigger download

### 6. Category Organization

Input:

- Category selection

Output:

- Filtered clip list

Predefined categories:

| ID | Name | Slug | Icon |
|----|------|------|------|
| cat-greetings | 挨拶 | greetings | `hand` |
| cat-reactions | リアクション | reactions | `sparkles` |
| cat-catchphrases | 決め台詞 | catchphrases | `quote` |
| cat-screams | 叫び | screams | `volume-2` |
| cat-laughter | 笑い | laughter | `smile` |
| cat-singing | 歌 | singing | `music` |
| cat-gaming | ゲーム | gaming | `gamepad-2` |
| cat-daily | 日常 | daily | `coffee` |

Rules:

1. Each clip has exactly one `categoryId`
2. Categories are static reference data (not user-created)
3. Category filter combines with member filter and sort (AND composition)
4. Home screen shows category chips (horizontal scroll on mobile)
5. Desktop sidebar includes a Categories section

### 7. UGC (User Generated Content)

Input:

- YouTube URL
- Time range (start / end, format `H:MM:SS`, max 30 seconds)
- Member selection
- Category selection
- Title (max 50 characters)

Output:

- Submitted clip (pending moderation)

Submission workflow:

1. User enters YouTube URL
2. System validates URL format
3. User sets time range (max 30 seconds per clip)
4. User selects member and category from dropdowns
5. User provides title (max 50 chars)
6. Preview card shows estimated clip metadata
7. Submit enters `pending` status

Moderation workflow:

1. New submissions go to `pending` status
2. Admin reviews in moderation queue (admin UI is out of MVP scope; data model supports it)
3. Admin can: approve, reject (with reason)
4. Approved clips become visible in the public catalog
5. Rejected clips: submitter sees status with reason (tracked via localStorage submission IDs)

Submission statuses: `draft` → `pending` → `approved` | `rejected`

## Data Model

### Clip (Aggregate Root)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique clip ID |
| title | string | Display title (max 50 chars) |
| memberId | MemberColorKey | FK to member reference data |
| categoryId | string | FK to category |
| duration | number | Duration in seconds |
| likeCount | number | Server-side aggregate like count |
| createdAt | string (date) | Creation date (ISO 8601) |
| audioUrl | string (URL) | Audio file URL on R2 |
| sourceVideoId | string? | Original YouTube video ID |
| sourceStartMs | number? | Start timestamp in source video |
| status | ClipStatus | `approved` / `pending` / `rejected` |

### Category (Reference Data)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Category ID (e.g., `cat-greetings`) |
| name | string | Display name (Japanese) |
| slug | string | URL-safe identifier |
| icon | string | Lucide icon name |
| displayOrder | number | Sort position |

### Playlist (Client-side Entity)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Playlist ID (`pl-fav` or `pl-{timestamp}`) |
| title | string | Display name |
| clipIds | string[] | Ordered list of clip IDs |
| createdAt | string (date) | Creation date |

### Like (Client-side State)

- Stored as `Set<string>` of clip IDs in localStorage
- Key: `vspo-voice-likes`
- Schema: `z.array(z.string())`

### ClipSubmission (UGC Entity)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Submission ID |
| youtubeUrl | string | Source YouTube URL |
| startMs | number | Start time in milliseconds |
| endMs | number | End time in milliseconds |
| memberId | MemberColorKey | Selected member |
| categoryId | string | Selected category |
| title | string | Proposed title (max 50 chars) |
| status | SubmissionStatus | `draft` / `pending` / `approved` / `rejected` |
| rejectionReason | string? | Reason if rejected |
| submittedAt | string (datetime) | Submission timestamp |

## API Design / Data Flow

### Phase 1 (MVP — Static Data)

- Clip catalog served as static JSON from R2 (`catalog/v{N}/clips.json`)
- No API server needed for read operations
- Browser fetches clip manifest + audio files directly from R2
- Category data embedded in clips.json or a separate `categories.json`

### Phase 2 (UGC + Dynamic)

REST API endpoints following existing conventions:

```
GET  /clips                          # List clips (filters: member, category, sort)
GET  /clips/{id}                     # Get single clip
GET  /categories                     # List categories

POST /clip-submissions               # Submit new UGC clip
GET  /clip-submissions/{id}          # Check submission status

# Admin (future)
GET  /admin/clip-submissions         # Moderation queue
PUT  /admin/clip-submissions/{id}    # Approve / reject
```

### Data Flow

```
Read path:  Browser → R2 (manifest.json → clips.json → clip audio)
Like/PL:    Browser ↔ localStorage
UGC write:  Browser → API → R2 (submission storage)
Admin:      Admin → API → R2 (approved clip processing)
```

## Audio Processing Requirements

### Playback

- HTML5 Audio element for standard playback
- Format: MP3 (128kbps, mono)
- Progressive download from R2 (no HLS needed for short clips < 30s)

### Merging

- Client-side AudioContext-based concatenation
- Input: array of audio URLs in user-specified order
- Output: single AudioBuffer → encoded to target format
- Max constraints: 20 clips, 5 minutes total
- Libraries: native Web Audio API for decode/concat, lamejs for MP3 encoding

### Audio File Storage

- R2 bucket: `vspo-voice-clips/`
- Path: `clips/{clipId}.mp3`
- Max file size: 5 MB per clip
- CORS: same configuration pattern as transcript Parquet files

## Performance Targets

| Metric | Target |
|--------|--------|
| Clip list load (initial) | < 2 sec |
| Audio playback start | < 300 ms |
| Like toggle | < 50 ms (local) |
| Category filter switch | < 100 ms |
| Sort toggle | < 100 ms |
| Merge 5 clips | < 3 sec |
| Merge 20 clips | < 10 sec |

## Error Handling

Follow Result-style error semantics per project conventions (`event + cause + recovery`).

Error classes:

1. Audio fetch failure (network error, 404)
2. Audio decode failure (corrupt or unsupported file)
3. Merge processing failure (memory exhaustion, format error)
4. UGC submission validation failure (invalid URL, time range)
5. localStorage quota exceeded

Recovery behavior:

- Retry audio fetch where safe (network errors)
- Preserve playlist and like state on errors
- Show inline error messages with specific guidance
- Graceful degradation: if merge fails, allow individual clip download

## Roadmap

### Phase 1 (Current MVP)

1. Curated clip display with static data from R2
2. Popular / New sorting
3. Like functionality (localStorage)
4. Playlist creation (localStorage)
5. Category organization (static categories)
6. Basic audio playback (HTML5 Audio)

### Phase 2

1. Voice merging and download (client-side Web Audio API)
2. UGC submission form (frontend + API for submission storage)
3. Member detail pages with hero gradient
4. Category detail pages

### Phase 3

1. Server-side UGC pipeline (automated audio extraction via yt-dlp)
2. Moderation admin UI
3. Server-synced likes (anonymous fingerprint-based)
4. Text search within clip titles
5. Social sharing (OGP cards for playlists)

## References

- [UI specification](../design/ui-specification.md)
- [Backend data architecture](../backend/voice-collection-data.md)
- [Server architecture](../backend/server-architecture.md)
- [Domain modeling patterns](../backend/domain-modeling.md)
- [API design principles](../backend/api-design.md)
- [Frontend architecture](../web-frontend/architecture.md)
- [R2 Parquet architecture](../backend/r2-parquet-duckdb-architecture.md)
