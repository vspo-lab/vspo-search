import { describe, expect, it, vi } from "vitest";

const { serveMock, inngestClient, processTranscriptFn } = vi.hoisted(() => ({
	serveMock: vi.fn(),
	inngestClient: { id: "inngest-client" },
	processTranscriptFn: { id: "process-transcript-fn" },
}));

vi.mock("inngest/hono", () => ({
	serve: serveMock,
}));

vi.mock("../inngest/client", () => ({
	inngest: inngestClient,
}));

vi.mock("../inngest/functions/process-transcript", () => ({
	processTranscript: processTranscriptFn,
}));

import { registerInngestRoute } from "./route-inngest";

describe("registerInngestRoute", () => {
	it("registers inngest endpoint with expected handler", () => {
		const handler = vi.fn();
		serveMock.mockReturnValue(handler);
		const on = vi.fn();
		const app = { on } as unknown as Parameters<typeof registerInngestRoute>[0];

		registerInngestRoute(app);

		expect(serveMock).toHaveBeenCalledWith({
			client: inngestClient,
			functions: [processTranscriptFn],
		});
		expect(on).toHaveBeenCalledWith(
			["GET", "PUT", "POST"],
			"/api/inngest",
			handler,
		);
	});
});
