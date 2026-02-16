import type { Context } from "hono";
import { Inngest, InngestMiddleware } from "inngest";

const bindings = new InngestMiddleware({
	name: "Hono bindings",
	init() {
		return {
			onFunctionRun({ reqArgs }) {
				return {
					transformInput() {
						const [honoCtx] = reqArgs as [
							Context<{ Bindings: Env }>,
						];
						return {
							ctx: {
								env: honoCtx.env,
							},
						};
					},
				};
			},
		};
	},
});

export const inngest = new Inngest({
	id: "vspo-transcriptor",
	middleware: [bindings],
});
