import { verifyKey } from "discord-interactions";
import { createMiddleware } from "hono/factory";
import { getDiscordEnv } from "../config";

export async function editOriginalInteractionResponse(
	token: string,
	content: string,
) {
	const { discordApplicationId, discordBotToken, DISCORD_API_BASE_URL } =
		getDiscordEnv();
	await fetch(
		`${DISCORD_API_BASE_URL}/webhooks/${discordApplicationId}/${token}/messages/@original`,
		{
			method: "PATCH",
			headers: {
				Authorization: `Bot ${discordBotToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ content }),
		},
	);
}

export async function createMessage(channelId: string, content: string) {
	const { discordBotToken, DISCORD_API_BASE_URL } = getDiscordEnv();
	await fetch(`${DISCORD_API_BASE_URL}/channels/${channelId}/messages`, {
		method: "POST",
		headers: {
			Authorization: `Bot ${discordBotToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ content }),
	});
}

export const verifyKeyMiddleware = createMiddleware(async (c, next) => {
	const { discordPublicKey } = getDiscordEnv();
	const signature = c.req.header("X-Signature-Ed25519");
	const timestamp = c.req.header("X-Signature-Timestamp");
	if (!signature || !timestamp) {
		return c.text("Missing signature or timestamp", 401);
	}
	const rawBody = await c.req.raw.text();
	const isValid = await verifyKey(
		rawBody,
		signature,
		timestamp,
		discordPublicKey,
	);
	if (!isValid) {
		return c.text("Invalid request signature", 401);
	}
	const body = JSON.parse(rawBody);
	c.set("body", body);
	await next();
});
