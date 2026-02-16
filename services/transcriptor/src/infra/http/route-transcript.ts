import { createTranscriptUseCase } from "../usecase/transcript";
import type { TranscriptorApp } from "./types";

export const registerTranscriptRoute = (app: TranscriptorApp) => {
	app.get("/transcript", async (c) => {
		const videoId = c.req.query("v");
		if (!videoId) {
			return c.json({ error: "query param 'v' is required" }, 400);
		}

		const lang = c.req.query("lang") || "ja";
		const usecase = createTranscriptUseCase({
			containerBinding: c.env.YT_CONTAINER,
			bucket: c.env.TRANSCRIPT_BUCKET,
		});

		const result = await usecase.fetch({ videoId, lang });
		if (result.err) {
			return c.json(
				{
					error: result.err.message,
					code: result.err.code,
					context: result.err.context,
				},
				result.err.status as 500,
			);
		}

		return c.json(JSON.parse(result.val));
	});
};
