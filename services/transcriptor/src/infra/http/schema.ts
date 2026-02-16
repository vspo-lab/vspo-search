import { z } from "zod";

export const runRequestSchema = z.object({
	videoIds: z.array(z.string().min(1)).min(1),
	lang: z.string().optional().default("ja"),
});
