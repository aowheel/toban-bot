import { InteractionResponseType, InteractionType } from "discord-interactions";
import { Hono } from "hono";
import { verifyKeyMiddleware } from "../../utils/discord";

const discord = new Hono();

discord.post("/", verifyKeyMiddleware, async (c) => {
	const { type } = c.get("body");
	if (type === InteractionType.PING) {
		return c.json({ type: InteractionResponseType.PONG });
	}
});

export default discord;
