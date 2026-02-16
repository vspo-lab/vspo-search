import { AppError, Err, Ok } from "@vspo/errors";
import { describe, expect, it, vi } from "vitest";

const {
	createFunctionMock,
	jobRepositoryFromMock,
	createTranscriptUseCaseMock,
} = vi.hoisted(() => ({
	createFunctionMock: vi.fn((_opts, _trigger, handler) => handler),
	jobRepositoryFromMock: vi.fn(),
	createTranscriptUseCaseMock: vi.fn(),
}));

vi.mock("../client", () => ({
	inngest: {
		createFunction: createFunctionMock,
	},
}));

vi.mock("../../repository/job", () => ({
	JobRepository: {
		from: jobRepositoryFromMock,
	},
}));

vi.mock("../../usecase/transcript", () => ({
	createTranscriptUseCase: createTranscriptUseCaseMock,
}));

import { processTranscript } from "./process-transcript";

type StepRun = <T>(
	name: string,
	fn: () => Promise<T>,
) => Promise<T>;

const createStep = () => ({
	run: vi.fn(async (_name: string, fn: () => Promise<unknown>) => fn()),
});

type ProcessTranscriptHandler = (args: {
	event: { id: string; data: Record<string, unknown> };
	step: { run: StepRun };
	env: Record<string, unknown>;
	attempt: number;
}) => Promise<{ jobId: string; status: "completed" | "failed" }>;

describe("processTranscript", () => {
	it("marks completed when fetch and save succeed", async () => {
		const repo = {
			create: vi.fn().mockResolvedValue(Ok({ id: "job-1" })),
			updateStatus: vi.fn().mockResolvedValue(Ok(undefined)),
		};
		jobRepositoryFromMock.mockReturnValue(repo);

		const usecase = {
			fetch: vi.fn().mockResolvedValue(Ok("raw-json")),
			saveRaw: vi
				.fn()
				.mockResolvedValue(Ok({ key: "transcripts/raw/video-1/ja.json" })),
		};
		createTranscriptUseCaseMock.mockReturnValue(usecase);
		const handler = processTranscript as unknown as ProcessTranscriptHandler;

		const step = createStep();
		const result = await handler({
			event: { id: "evt-1", data: { video_id: "video-1" } },
			step: step as { run: StepRun },
			env: {
				TRANSCRIPT_DB: {},
				YT_CONTAINER: {},
				TRANSCRIPT_BUCKET: {},
			},
			attempt: 2,
		});

		expect(result).toEqual({ jobId: "job-1", status: "completed" });
		expect(repo.updateStatus).toHaveBeenNthCalledWith(1, "job-1", "processing", {
			error: null,
			retryCount: 2,
		});
		expect(repo.updateStatus).toHaveBeenNthCalledWith(2, "job-1", "completed", {
			r2Key: "transcripts/raw/video-1/ja.json",
			error: null,
			retryCount: 2,
		});
		expect(usecase.saveRaw).toHaveBeenCalledWith(
			{ videoId: "video-1", lang: "ja" },
			"raw-json",
		);
	});

	it("marks failed when fetch fails", async () => {
		const repo = {
			create: vi.fn().mockResolvedValue(Ok({ id: "job-1" })),
			updateStatus: vi.fn().mockResolvedValue(Ok(undefined)),
		};
		jobRepositoryFromMock.mockReturnValue(repo);

		const usecase = {
			fetch: vi
				.fn()
				.mockResolvedValue(
					Err(
						new AppError({
							code: "INTERNAL_SERVER_ERROR",
							message: "fetch failed",
						}),
					),
				),
			saveRaw: vi.fn(),
		};
		createTranscriptUseCaseMock.mockReturnValue(usecase);
		const handler = processTranscript as unknown as ProcessTranscriptHandler;

		const step = createStep();
		const result = await handler({
			event: { id: "evt-1", data: { video_id: "video-1", lang: "en" } },
			step: step as { run: StepRun },
			env: {
				TRANSCRIPT_DB: {},
				YT_CONTAINER: {},
				TRANSCRIPT_BUCKET: {},
			},
			attempt: 1,
		});

		expect(result).toEqual({ jobId: "job-1", status: "failed" });
		expect(repo.updateStatus).toHaveBeenNthCalledWith(1, "job-1", "processing", {
			error: null,
			retryCount: 1,
		});
		expect(repo.updateStatus).toHaveBeenNthCalledWith(2, "job-1", "failed", {
			error: "fetch failed",
			retryCount: 1,
		});
		expect(usecase.saveRaw).not.toHaveBeenCalled();
	});
});
