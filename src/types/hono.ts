import type { InteractionType } from "discord-interactions";

declare module "hono" {
	interface ContextVariableMap {
		body: {
			type: InteractionType;
		};
	}
}
