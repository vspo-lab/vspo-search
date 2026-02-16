import { AppError, Err, Ok } from "@vspo/errors";
import { Hono } from "hono/quick";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchMock, createTranscriptUseCaseMock } = vi.hoisted(() => ({
	fetchMock: vi.fn(),
	createTranscriptUseCaseMock: vi.fn(),
}));

vi.mock("../usecase/transcript", () => ({
	createTranscriptUseCase: createTranscriptUseCaseMock,
}));

import { registerTranscriptRoute } from "./route-transcript";

const createApp = () => {
	const app = new Hono<{ Bindings: Env }>();
	registerTranscriptRoute(app);
	return app;
};

const createEnv = () =>
	({
		YT_CONTAINER: {},
		TRANSCRIPT_BUCKET: {},
	} as unknown as Env);

describe("registerTranscriptRoute", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		createTranscriptUseCaseMock.mockReturnValue({
			fetch: fetchMock,
		});
	});

	it("returns 400 when required query param is missing", async () => {
		const app = createApp();

		const response = await app.request("/transcript", {}, createEnv());

		expect(response.status).toBe(400);
		expect(createTranscriptUseCaseMock).not.toHaveBeenCalled();
	});

	it("returns transcript JSON from usecase result", async () => {
		fetchMock.mockResolvedValue(
			Ok(
				JSON.stringify({
					events: [{ tStartMs: 0, segs: [{ utf8: "hello" }] }],
				}),
			),
		);
		const app = createApp();

		const response = await app.request(
			"/transcript?v=abc&lang=en",
			{},
			createEnv(),
		);

		expect(response.status).toBe(200);
		expect(fetchMock).toHaveBeenCalledWith({ videoId: "abc", lang: "en" });
		await expect(response.json()).resolves.toEqual({
			events: [{ tStartMs: 0, segs: [{ utf8: "hello" }] }],
		});
	});

	it("returns app error status and payload", async () => {
		fetchMock.mockResolvedValue(
			Err(
				new AppError({
					code: "BAD_REQUEST",
					message: "invalid video id",
					context: { videoId: "abc" },
				}),
			),
		);
		const app = createApp();

		const response = await app.request("/transcript?v=abc", {}, createEnv());

		expect(response.status).toBe(400);
		await expect(response.json()).resolves.toEqual({
			error: "invalid video id",
			code: "BAD_REQUEST",
			context: { videoId: "abc" },
		});
	});
});
