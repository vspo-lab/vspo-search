import { Hono } from "hono/quick";
import { registerInngestRoute } from "./route-inngest";
import { registerTranscriptRoute } from "./route-transcript";
import { registerWorkflowRoutes } from "./route-workflow";

export const createApp = () => {
	const app = new Hono<{ Bindings: Env }>();

	registerInngestRoute(app);
	registerTranscriptRoute(app);
	registerWorkflowRoutes(app);

	return app;
};
