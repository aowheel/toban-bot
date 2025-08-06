import { verifyKey } from "discord-interactions";
import { createMiddleware } from "hono/factory";

const API_BASE_URL = "https://discord.com/api/v10";

export async function createMessage(content: string) {
	const token = process.env.DISCORD_BOT_TOKEN;
	if (!token) {
		throw new Error("DISCORD_BOT_TOKEN is not set in environment variables");
	}

	// Fetch from supabase
	const channelId = 0;

	await fetch(`${API_BASE_URL}/channels/${channelId}/messages`, {
		method: "POST",
		headers: {
			Authorization: `Bot ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ content }),
	});
}

export const verifyKeyMiddleware = createMiddleware(async (c, next) => {
	const discordPublicKey = process.env.DISCORD_PUBLIC_KEY;
	if (!discordPublicKey) {
		throw new Error("DISCORD_PUBLIC_KEY is not set in environment variables");
	}

	const signature = c.req.header("X-Signature-Ed25519");
	const timestamp = c.req.header("X-Signature-Timestamp");
	if (!signature || !timestamp) {
		throw Error("Missing signature or timestamp headers");
	}

	const rawBody = await c.req.raw.text();
	const isValidReq = await verifyKey(
		rawBody,
		signature,
		timestamp,
		discordPublicKey,
	);
	if (!isValidReq) {
		return c.text("Invalid request signature", 401);
	}
	const body = JSON.parse(rawBody);

	c.set("body", body);

	await next();
});
