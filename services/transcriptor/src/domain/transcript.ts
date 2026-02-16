import { z } from "zod";

// --- Schema ---

export const transcriptParamsSchema = z.object({
	videoId: z.string().min(1),
	lang: z.string().default("ja"),
});

export type TranscriptParams = z.infer<typeof transcriptParamsSchema>;

// --- Stage ---

const transcriptStageSchema = z.enum(["raw", "chunked", "proofread"]);

export type TranscriptStage = z.infer<typeof transcriptStageSchema>;

// --- Companion Object ---

/**
 * R2 key layout:
 *   transcripts/raw/{videoId}/{lang}.json        - yt-dlp json3 raw output
 *   transcripts/chunked/{videoId}/{lang}.json    - chunked in 30-second segments
 *   transcripts/proofread/{videoId}/{lang}.json  - proofread / corrected
 */
export const TranscriptKey = {
	raw: (params: TranscriptParams): string =>
		`transcripts/raw/${params.videoId}/${params.lang}.json`,

	chunked: (params: TranscriptParams): string =>
		`transcripts/chunked/${params.videoId}/${params.lang}.json`,

	proofread: (params: TranscriptParams): string =>
		`transcripts/proofread/${params.videoId}/${params.lang}.json`,

	fromStage: (stage: TranscriptStage, params: TranscriptParams): string =>
		`transcripts/${stage}/${params.videoId}/${params.lang}.json`,
} as const;
