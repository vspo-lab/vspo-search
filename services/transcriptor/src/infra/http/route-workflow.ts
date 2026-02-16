import { AppError, wrap } from "@vspo/errors";
import { runRequestSchema } from "./schema";
import type { TranscriptorApp } from "./types";

export const registerWorkflowRoutes = (app: TranscriptorApp) => {
	app.post("/run", async (c) => {
		const bodyResult = await wrap(
			c.req.json(),
			(err) =>
				new AppError({
					code: "BAD_REQUEST",
					message: "invalid json body",
					cause: err,
				}),
		);
		if (bodyResult.err) {
			return c.json({ error: bodyResult.err.message }, 400);
		}

		const parsed = runRequestSchema.safeParse(bodyResult.val);
		if (!parsed.success) {
			return c.json({ error: parsed.error.flatten() }, 400);
		}

		const { videoIds, lang } = parsed.data;
		const workflows = await Promise.all(
			videoIds.map(async (videoId) => {
				const instance = await c.env.TRANSCRIPT_WORKFLOW.create({
					params: { videoId, lang },
				});
				return { videoId, instanceId: instance.id };
			}),
		);

		return c.json({ workflows });
	});

	app.get("/run/:instanceId", async (c) => {
		const instanceId = c.req.param("instanceId");
		const instance = await c.env.TRANSCRIPT_WORKFLOW.get(instanceId);
		return c.json({ instanceId, status: await instance.status() });
	});
};
