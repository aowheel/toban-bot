import type { InteractionType } from "discord-interactions";

interface ApplicationCommandInteractionDataOption {
	name: string;
	type: number;
	value?: number;
	options?: Array<ApplicationCommandInteractionDataOption>;
}

interface ApplicationCommandData {
	id: string;
	name: string;
	type: number;
	options?: Array<ApplicationCommandInteractionDataOption>;
}

interface DiscordInteractionRequestBody {
	id: string;
	type: InteractionType;
	data?: ApplicationCommandData;
	channel_id: string;
	token: string;
}

declare module "hono" {
	interface ContextVariableMap {
		body: DiscordInteractionRequestBody;
	}
}
