import { createMiddleware } from "hono/factory";
import { getGoldskyEnv } from "../config.js";

const { goldskyWebhookSecret } = getGoldskyEnv();

export const verifySecretMiddleware = createMiddleware(async (c, next) => {
	const secret = c.req.header("goldsky-webhook-secret");
	if (secret !== goldskyWebhookSecret) {
		return c.text("Invalid webhook secret", 401);
	}
	await next();
});
