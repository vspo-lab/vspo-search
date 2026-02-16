import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";
import type { TranscriptParams } from "../../domain/transcript";
import { createTranscriptUseCase } from "../usecase/transcript";

export class TranscriptWorkflow extends WorkflowEntrypoint<
	Env,
	TranscriptParams
> {
	async run(event: WorkflowEvent<TranscriptParams>, step: WorkflowStep) {
		const { videoId, lang } = event.payload;

		await step.do(
			`fetch-and-save:${videoId}`,
			{
				retries: {
					limit: 3,
					delay: "10 second",
					backoff: "exponential",
				},
				timeout: "5 minutes",
			},
			async () => {
				const usecase = createTranscriptUseCase({
					containerBinding: this.env.YT_CONTAINER,
					bucket: this.env.TRANSCRIPT_BUCKET,
				});

				const fetchResult = await usecase.fetch({ videoId, lang });
				if (fetchResult.err) {
					throw new Error(fetchResult.err.message);
				}

				const saveResult = await usecase.saveRaw(
					{ videoId, lang },
					fetchResult.val,
				);
				if (saveResult.err) {
					throw new Error(saveResult.err.message);
				}

				return { key: saveResult.val.key };
			},
		);
	}
}
