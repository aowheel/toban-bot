import { InteractionResponseType, InteractionType } from "discord-interactions";
import { Hono } from "hono";
import { DiscordService } from "../services/discord.service";
import type { InteractionsPayload } from "../types/discord.dto";

const discord = new Hono<{
	Bindings: CloudflareBindings;
	Variables: { service: DiscordService };
}>();

discord.use("*", async (c, next) => {
	const service = new DiscordService({
		db: c.env.toban_bot,
		discordBotToken: c.env.DISCORD_BOT_TOKEN,
	});

	c.set("service", service);

	await next();
});

discord.post("/", async (c) => {
	const payload = await c.req.json<InteractionsPayload>();
	const service = c.get("service");

	if (payload.type === InteractionType.PING) {
		return c.json({ type: InteractionResponseType.PONG });
	}

	if (payload.type === InteractionType.APPLICATION_COMMAND) {
		const waitUntilPromise = async () => {
			const content = await service.handleApplicationCommand(payload);
			await service.updateOriginalInteractionResponse(
				payload.application_id,
				payload.token,
				content,
			);
		};

		c.executionCtx.waitUntil(waitUntilPromise());

		return c.json({
			type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
		});
	}

	return c.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: { content: "Unknown interaction type" },
	});
});

export default discord;
