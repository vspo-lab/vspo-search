import { AppError, Err, Ok } from "@vspo/errors";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createTranscriptUseCaseMock, fetchMock, serveMock } = vi.hoisted(() => ({
	createTranscriptUseCaseMock: vi.fn(),
	fetchMock: vi.fn(),
	serveMock: vi.fn(),
}));

vi.mock("../usecase/transcript", () => ({
	createTranscriptUseCase: createTranscriptUseCaseMock,
}));

vi.mock("inngest/hono", () => ({
	serve: serveMock,
}));

import { createApp } from "./app";

type WorkflowBinding = {
	create: ReturnType<typeof vi.fn>;
	get: ReturnType<typeof vi.fn>;
};

const createEnv = (workflow: WorkflowBinding) =>
	({
		YT_CONTAINER: {},
		TRANSCRIPT_BUCKET: {},
		TRANSCRIPT_WORKFLOW: workflow,
	} as unknown as Env);

describe("createApp integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		createTranscriptUseCaseMock.mockReturnValue({
			fetch: fetchMock,
		});
		serveMock.mockReturnValue((c: { body: (body: unknown, status?: number) => Response }) =>
			c.body(null, 204),
		);
	});

	it("handles transcript and workflow endpoints", async () => {
		fetchMock.mockResolvedValue(
			Ok(JSON.stringify({ events: [{ tStartMs: 0, segs: [{ utf8: "hello" }] }] })),
		);
		const create = vi
			.fn()
			.mockImplementation(async ({ params }: { params: { videoId: string } }) => ({
				id: `wf-${params.videoId}`,
			}));
		const get = vi.fn().mockResolvedValue({
			status: vi.fn().mockResolvedValue({ state: "running" }),
		});
		const app = createApp();
		const env = createEnv({ create, get });

		const transcriptRes = await app.request("/transcript?v=video-1", {}, env);
		expect(transcriptRes.status).toBe(200);
		await expect(transcriptRes.json()).resolves.toEqual({
			events: [{ tStartMs: 0, segs: [{ utf8: "hello" }] }],
		});

		const runRes = await app.request(
			"/run",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ videoIds: ["video-1", "video-2"] }),
			},
			env,
		);
		expect(runRes.status).toBe(200);
		expect(create).toHaveBeenNthCalledWith(1, {
			params: { videoId: "video-1", lang: "ja" },
		});
		expect(create).toHaveBeenNthCalledWith(2, {
			params: { videoId: "video-2", lang: "ja" },
		});

		const statusRes = await app.request("/run/wf-video-1", {}, env);
		expect(statusRes.status).toBe(200);
		await expect(statusRes.json()).resolves.toEqual({
			instanceId: "wf-video-1",
			status: { state: "running" },
		});
	});

	it("returns 400 for invalid json on /run", async () => {
		const app = createApp();
		const env = createEnv({
			create: vi.fn(),
			get: vi.fn(),
		});

		const response = await app.request(
			"/run",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: "{broken-json",
			},
			env,
		);

		expect(response.status).toBe(400);
	});

	it("returns app error from transcript usecase", async () => {
		fetchMock.mockResolvedValue(
			Err(
				new AppError({
					code: "BAD_REQUEST",
					message: "invalid video id",
					context: { videoId: "video-1" },
				}),
			),
		);
		const app = createApp();
		const env = createEnv({
			create: vi.fn(),
			get: vi.fn(),
		});

		const response = await app.request("/transcript?v=video-1", {}, env);

		expect(response.status).toBe(400);
		await expect(response.json()).resolves.toEqual({
			error: "invalid video id",
			code: "BAD_REQUEST",
			context: { videoId: "video-1" },
		});
	});

	it.each(["GET", "POST", "PUT"] as const)(
		"handles /api/inngest with %s",
		async (method) => {
			const app = createApp();
			const env = createEnv({
				create: vi.fn(),
				get: vi.fn(),
			});

			const response = await app.request("/api/inngest", { method }, env);

			expect(response.status).toBe(204);
		},
	);
});
