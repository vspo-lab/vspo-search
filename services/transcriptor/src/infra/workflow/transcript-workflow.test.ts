import { AppError, Err, Ok } from "@vspo/errors";
import { describe, expect, it, vi } from "vitest";

const { createTranscriptUseCaseMock } = vi.hoisted(() => ({
	createTranscriptUseCaseMock: vi.fn(),
}));

vi.mock("../usecase/transcript", () => ({
	createTranscriptUseCase: createTranscriptUseCaseMock,
}));

vi.mock("cloudflare:workers", () => {
	class WorkflowEntrypoint<TEnv> {
		protected readonly env: TEnv;

		constructor(_ctx: unknown, env: TEnv) {
			this.env = env;
		}
	}

	return { WorkflowEntrypoint };
});

import { TranscriptWorkflow } from "./transcript-workflow";

const createEnv = () =>
	({
		YT_CONTAINER: {},
		TRANSCRIPT_BUCKET: {},
	} as unknown as Env);

const createExecutionContext = () =>
	({
		waitUntil: vi.fn(),
		passThroughOnException: vi.fn(),
		props: {},
	} as never);

describe("TranscriptWorkflow", () => {
	it("runs fetch-and-save step and returns key", async () => {
		const fetch = vi.fn().mockResolvedValue(Ok("raw-json"));
		const saveRaw = vi
			.fn()
			.mockResolvedValue(Ok({ key: "transcripts/raw/abc/ja.json" }));
		createTranscriptUseCaseMock.mockReturnValue({ fetch, saveRaw });

		const workflow = new TranscriptWorkflow(createExecutionContext(), createEnv());
		const step = {
			do: vi.fn(async (_name, _opts, fn: () => Promise<unknown>) => fn()),
		};

		await workflow.run({ payload: { videoId: "abc", lang: "ja" } } as never, step as never);

		expect(step.do).toHaveBeenCalledWith(
			"fetch-and-save:abc",
			{
				retries: {
					limit: 3,
					delay: "10 second",
					backoff: "exponential",
				},
				timeout: "5 minutes",
			},
			expect.any(Function),
		);
		expect(fetch).toHaveBeenCalledWith({ videoId: "abc", lang: "ja" });
		expect(saveRaw).toHaveBeenCalledWith(
			{ videoId: "abc", lang: "ja" },
			"raw-json",
		);
	});

	it("throws when fetch fails", async () => {
		const fetch = vi
			.fn()
			.mockResolvedValue(
				Err(new AppError({ code: "INTERNAL_SERVER_ERROR", message: "fetch failed" })),
			);
		const saveRaw = vi.fn();
		createTranscriptUseCaseMock.mockReturnValue({ fetch, saveRaw });

		const workflow = new TranscriptWorkflow(createExecutionContext(), createEnv());
		const step = {
			do: vi.fn(async (_name, _opts, fn: () => Promise<unknown>) => fn()),
		};

		await expect(
			workflow.run({ payload: { videoId: "abc", lang: "ja" } } as never, step as never),
		).rejects.toThrow("fetch failed");
		expect(saveRaw).not.toHaveBeenCalled();
	});

	it("throws when saveRaw fails", async () => {
		const fetch = vi.fn().mockResolvedValue(Ok("raw-json"));
		const saveRaw = vi
			.fn()
			.mockResolvedValue(
				Err(new AppError({ code: "INTERNAL_SERVER_ERROR", message: "save failed" })),
			);
		createTranscriptUseCaseMock.mockReturnValue({ fetch, saveRaw });

		const workflow = new TranscriptWorkflow(createExecutionContext(), createEnv());
		const step = {
			do: vi.fn(async (_name, _opts, fn: () => Promise<unknown>) => fn()),
		};

		await expect(
			workflow.run({ payload: { videoId: "abc", lang: "ja" } } as never, step as never),
		).rejects.toThrow("save failed");
	});
});
