import { type AppError, type Result } from "@vspo/errors";
import type { TranscriptParams } from "../domain/transcript";

type Dependencies = Readonly<{
	source: Readonly<{
		fetch: (params: TranscriptParams) => Promise<Result<string, AppError>>;
	}>;
	store: Readonly<{
		saveRaw: (
			params: TranscriptParams,
			data: string,
		) => Promise<Result<{ key: string }, AppError>>;
	}>;
}>;

export type TranscriptUseCaseType = Readonly<{
	fetch: (params: TranscriptParams) => Promise<Result<string, AppError>>;
	saveRaw: (
		params: TranscriptParams,
		data: string,
	) => Promise<Result<{ key: string }, AppError>>;
}>;

export const TranscriptUseCase = {
	from: ({ source, store }: Dependencies): TranscriptUseCaseType => {
		return {
			fetch: (params) => source.fetch(params),

			saveRaw: (params, data) => store.saveRaw(params, data),
		};
	},
} as const;
