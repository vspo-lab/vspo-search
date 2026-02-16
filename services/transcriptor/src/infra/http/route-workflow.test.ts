import { Hono } from "hono/quick";
import { describe, expect, it, vi } from "vitest";
import { registerWorkflowRoutes } from "./route-workflow";

type WorkflowBinding = {
	create: ReturnType<typeof vi.fn>;
	get: ReturnType<typeof vi.fn>;
};

const createEnv = (binding: WorkflowBinding) =>
	({
		TRANSCRIPT_WORKFLOW: binding,
	} as unknown as Env);

const createApp = () => {
	const app = new Hono<{ Bindings: Env }>();
	registerWorkflowRoutes(app);
	return app;
};

describe("registerWorkflowRoutes", () => {
	it("creates workflow instances with default lang", async () => {
		const create = vi
			.fn()
			.mockImplementation(async ({ params }: { params: { videoId: string } }) => ({
				id: `wf-${params.videoId}`,
			}));
		const get = vi.fn();
		const app = createApp();

		const response = await app.request(
			"/run",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ videoIds: ["a", "b"] }),
			},
			createEnv({ create, get }),
		);

		expect(response.status).toBe(200);
		expect(create).toHaveBeenNthCalledWith(1, {
			params: { videoId: "a", lang: "ja" },
		});
		expect(create).toHaveBeenNthCalledWith(2, {
			params: { videoId: "b", lang: "ja" },
		});
		await expect(response.json()).resolves.toEqual({
			workflows: [
				{ videoId: "a", instanceId: "wf-a" },
				{ videoId: "b", instanceId: "wf-b" },
			],
		});
	});

	it.each([
		{
			name: "invalid json body",
			init: {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: "{broken-json",
			},
		},
		{
			name: "schema validation error",
			init: {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ videoIds: [] }),
			},
		},
	])("returns 400 for $name", async ({ init }) => {
		const create = vi.fn();
		const get = vi.fn();
		const app = createApp();

		const response = await app.request("/run", init, createEnv({ create, get }));

		expect(response.status).toBe(400);
		expect(create).not.toHaveBeenCalled();
	});

	it("returns workflow status by instance id", async () => {
		const status = { state: "running" };
		const create = vi.fn();
		const get = vi.fn().mockResolvedValue({
			status: vi.fn().mockResolvedValue(status),
		});
		const app = createApp();

		const response = await app.request(
			"/run/instance-1",
			{ method: "GET" },
			createEnv({ create, get }),
		);

		expect(response.status).toBe(200);
		expect(get).toHaveBeenCalledWith("instance-1");
		await expect(response.json()).resolves.toEqual({
			instanceId: "instance-1",
			status,
		});
	});
});
