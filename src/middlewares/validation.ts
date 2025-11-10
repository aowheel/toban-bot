import { verifyKey } from "discord-interactions";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { cloneRawRequest } from "hono/request";

export const verifyGoldskyRequest = createMiddleware<{
	Bindings: CloudflareBindings;
}>(async (c, next) => {
	const secret = c.req.header("goldsky-webhook-secret");
	if (secret !== c.env.GOLDSKY_WEBHOOK_SECRET) {
		throw new HTTPException(401, { message: "Invalid request secret" });
	}
	await next();
});

export const verifyDiscordRequest = createMiddleware<{
	Bindings: CloudflareBindings;
}>(async (c, next) => {
	const signature = c.req.header("X-Signature-Ed25519");
	const timestamp = c.req.header("X-Signature-Timestamp");
	if (!signature || !timestamp) {
		throw new HTTPException(401, { message: "Missing signature headers" });
	}
	const clonedReq = await cloneRawRequest(c.req);
	const isValid = await verifyKey(
		await clonedReq.arrayBuffer(),
		signature,
		timestamp,
		c.env.DISCORD_PUBLIC_KEY,
	);
	if (!isValid) {
		throw new HTTPException(401, { message: "Invalid request signature" });
	}
	await next();
});
