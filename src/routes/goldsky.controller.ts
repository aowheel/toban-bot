import { Hono } from "hono";
import { GoldskyService } from "../services/goldsky.service";

const goldsky = new Hono<{
	Bindings: CloudflareBindings;
	Variables: { service: GoldskyService };
}>();

goldsky.use("*", async (c, next) => {
	const service = new GoldskyService({
		db: c.env.toban_bot,
		namestoneApiKey: c.env.NAMESTONE_API_KEY,
		pinataGatewayToken: c.env.PINATA_GATEWAY_TOKEN,
		hatsGraphqlEndpoint: c.env.HATS_GRAPHQL_ENDPOINT,
		tobanGraphqlEndpoint: c.env.TOBAN_GRAPHQL_ENDPOINT,
		discordBotToken: c.env.DISCORD_BOT_TOKEN,
	});

	c.set("service", service);

	await next();
});

goldsky.post("/:chainId/fraction-token/*", async (c) => {
	const chainId = c.req.param("chainId");
	const body = await c.req.json();
	const service = c.get("service");

	await service.handleFractionTokenTransfered(chainId, body.data.new);

	return c.json({ status: "success" });
});

goldsky.post("/:chainId/thanks-token/*", async (c) => {
	const chainId = c.req.param("chainId");
	const body = await c.req.json();
	const service = c.get("service");

	await service.handleThanksTokenMinted(chainId, body.data.new);

	return c.json({ status: "success" });
});

export default goldsky;
