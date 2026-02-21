import { z } from "zod";

/** Schema for transcripts.parquet rows */
export const TranscriptRowSchema = z.object({
	video_id: z.string(),
	title: z.string(),
	channel_id: z.string(),
	channel_name: z.string(),
	published_at: z.string(),
	duration_sec: z.number().int(),
	thumbnail_url: z.string(),
	video_type: z.enum(["stream", "clip"]),
});
export type TranscriptRow = z.infer<typeof TranscriptRowSchema>;

/** Schema for transcript_segments.parquet rows */
export const TranscriptSegmentRowSchema = z.object({
	video_id: z.string(),
	start_ms: z.number().int(),
	duration_ms: z.number().int(),
	text: z.string(),
});
export type TranscriptSegmentRow = z.infer<typeof TranscriptSegmentRowSchema>;

/** Schema for a single file entry in manifest.json */
export const ManifestFileEntrySchema = z.object({
	path: z.string().regex(/^[a-zA-Z0-9_/.-]+$/),
	size_bytes: z.number().int(),
	row_count: z.number().int(),
});

/** Schema for manifest.json */
export const ManifestSchema = z.object({
	version: z.number().int(),
	generated_at: z.string(),
	files: z.object({
		transcripts: ManifestFileEntrySchema,
		transcript_segments: ManifestFileEntrySchema,
	}),
});
export type Manifest = z.infer<typeof ManifestSchema>;
