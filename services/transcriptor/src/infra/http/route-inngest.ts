import { serve } from "inngest/hono";
import { inngest } from "../inngest/client";
import { processTranscript } from "../inngest/functions/process-transcript";
import type { TranscriptorApp } from "./types";

export const registerInngestRoute = (app: TranscriptorApp) => {
	app.on(
		["GET", "PUT", "POST"],
		"/api/inngest",
		serve({
			client: inngest,
			functions: [processTranscript],
		}),
	);
};
