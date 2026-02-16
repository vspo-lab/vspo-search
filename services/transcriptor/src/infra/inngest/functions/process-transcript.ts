import { JobRepository } from "../../repository/job";
import { createTranscriptUseCase } from "../../usecase/transcript";
import { inngest } from "../client";
import { z } from "zod";

const eventDataSchema = z.object({
	video_id: z.string().min(1),
	lang: z.string().optional().default("ja"),
});

export const processTranscript = inngest.createFunction(
	{ id: "process-transcript", retries: 3 },
	{ event: "db/videos.inserted" },
	async ({ event, step, env, attempt }) => {
		const cfEnv = env as unknown as Env;
		const { video_id, lang } = eventDataSchema.parse(event.data);

		const jobRepo = JobRepository.from(cfEnv.TRANSCRIPT_DB);

		// Step 1: Create job record
		const job = await step.run("create-job", async () => {
			const result = await jobRepo.create({
				videoId: video_id,
				lang,
				eventId: event.id,
			});
			if (result.err) {
				throw new Error(result.err.message);
			}
			return result.val;
		});

		// Step 2: Update status to processing
		await step.run("mark-processing", async () => {
			const result = await jobRepo.updateStatus(job.id, "processing", {
				error: null,
				retryCount: attempt,
			});
			if (result.err) {
				throw new Error(result.err.message);
			}
		});

		// Step 3: Fetch transcript via yt-dlp and save to R2
		const saveResult = await step.run("fetch-and-save", async () => {
			const usecase = createTranscriptUseCase({
				containerBinding: cfEnv.YT_CONTAINER,
				bucket: cfEnv.TRANSCRIPT_BUCKET,
			});

			const fetchResult = await usecase.fetch({
				videoId: video_id,
				lang,
			});
			if (fetchResult.err) {
				return { ok: false as const, error: fetchResult.err.message };
			}

			const storeResult = await usecase.saveRaw(
				{ videoId: video_id, lang },
				fetchResult.val,
			);
			if (storeResult.err) {
				return { ok: false as const, error: storeResult.err.message };
			}

			return { ok: true as const, key: storeResult.val.key };
		});

		// Step 4: Update job status based on result
		await step.run("update-status", async () => {
			if (!saveResult.ok) {
				const result = await jobRepo.updateStatus(job.id, "failed", {
					error: saveResult.error,
					retryCount: attempt,
				});
				if (result.err) {
					throw new Error(result.err.message);
				}
				return;
			}

			const result = await jobRepo.updateStatus(job.id, "completed", {
				r2Key: saveResult.key,
				error: null,
				retryCount: attempt,
			});
			if (result.err) {
				throw new Error(result.err.message);
			}
		});

		return {
			jobId: job.id,
			status: saveResult.ok ? "completed" : "failed",
		};
	},
);
