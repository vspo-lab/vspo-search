import type { YtdlpContainer } from "../container/ytdlp";
import { TranscriptFetcher } from "../container/ytdlp";
import { TranscriptRepository } from "../repository/transcript";
import { TranscriptUseCase } from "../../usecase/transcript";

type Dependencies = Readonly<{
	containerBinding: DurableObjectNamespace<YtdlpContainer>;
	bucket: R2Bucket;
}>;

export const createTranscriptUseCase = ({
	containerBinding,
	bucket,
}: Dependencies) => {
	const repository = TranscriptRepository.from(bucket);

	return TranscriptUseCase.from({
		source: {
			fetch: (params) =>
				TranscriptFetcher.fetch(
					containerBinding,
					params.videoId,
					params.lang,
				),
		},
		store: {
			saveRaw: (params, data) => repository.save("raw", params, data),
		},
	});
};
