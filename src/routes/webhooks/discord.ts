import { Hono } from "hono";
import { verifyKeyMiddleware } from "../../utils/discord";

const discord = new Hono();

discord.post("/", verifyKeyMiddleware, async (c) => {
	const { type, data, id, channel_id, token } = await c.req.json();
});

export default discord;
