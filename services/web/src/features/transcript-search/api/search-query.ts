import type { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import type {
	TranscriptRow,
	TranscriptSegmentRow,
} from "../types/parquet-schema";

/** Raw search result row — derived from Parquet schemas. */
export type SearchResultRow = Omit<TranscriptRow, "published_at"> &
	TranscriptSegmentRow & { published_at: string };

export type SearchParams = {
	keyword: string;
	limit?: number;
};

const MAX_LIMIT = 200;

/**
 * Execute an ILIKE-based transcript search.
 * Returns raw SQL result rows. Mapping to domain VideoCard types
 * is handled by the container/hook layer.
 */
export async function searchTranscripts(
	db: AsyncDuckDB,
	params: SearchParams,
): Promise<SearchResultRow[]> {
	if (!params.keyword.trim()) {
		return [];
	}

	const conn = await db.connect();
	try {
		const limit = Math.min(Math.max(1, params.limit ?? 50), MAX_LIMIT);
		const stmt = await conn.prepare(`
      SELECT t.video_id, t.title, t.channel_id, t.channel_name,
             CAST(t.published_at AS VARCHAR) AS published_at,
             t.video_type, t.duration_sec, t.thumbnail_url,
             s.start_ms, s.duration_ms, s.text
      FROM transcript_segments s
      JOIN transcripts t ON s.video_id = t.video_id
      WHERE s.text ILIKE '%' || ? || '%'
      ORDER BY t.published_at DESC
      LIMIT ?;
    `);
		const result = await stmt.query(params.keyword, limit);

		return result.toArray().map((row) => ({
			video_id: String(row.video_id),
			title: String(row.title),
			channel_id: String(row.channel_id),
			channel_name: String(row.channel_name),
			published_at: String(row.published_at),
			video_type: String(row.video_type) as "stream" | "clip",
			duration_sec: Number(row.duration_sec),
			thumbnail_url: String(row.thumbnail_url),
			start_ms: Number(row.start_ms),
			duration_ms: Number(row.duration_ms),
			text: String(row.text),
		}));
	} finally {
		await conn.close();
	}
}
