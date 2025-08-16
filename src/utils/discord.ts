import axios from "axios";
import { verifyKey } from "discord-interactions";
import { createMiddleware } from "hono/factory";
import { getDiscordEnv } from "../config.js";

const {
	discordApplicationId,
	discordBotToken,
	discordPublicKey,
	discordApiBaseUrl,
} = getDiscordEnv();

const axiosInstance = axios.create({
	baseURL: discordApiBaseUrl,
	headers: { Authorization: `Bot ${discordBotToken}` },
});

export async function editOriginalInteractionResponse(
	token: string,
	message: Record<string, unknown>,
) {
	await axiosInstance.patch(
		`/webhooks/${discordApplicationId}/${token}/messages/@original`,
		message,
	);
}

export async function createMessage(
	channelId: string,
	message: Record<string, unknown>,
) {
	await axiosInstance.post(`/channels/${channelId}/messages`, message);
}

export const verifyKeyMiddleware = createMiddleware(async (c, next) => {
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
