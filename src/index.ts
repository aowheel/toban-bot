import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import hatsSubgraphClient from "./libs/hatsprotocol";
import pinata from "./libs/pinata";
import interactions from "./routes/interacations";
import webhooks from "./routes/webhooks";

const app = new Hono();

app.route("/webhooks", webhooks);
app.route("/interactions", interactions);

app.post("/webhook", async (c) => {
	const {
		data: { new: transferData },
	} = await c.req.json();

	const from = String(transferData.from);
	const to = String(transferData.to);
	const wearer = String(transferData.wearer);
	const hatId = BigInt(transferData.hat_id);
	const workspaceId = Number(transferData.workspace_id);
	const amount = Number(transferData.amount);

	return c.text("Hello Hono!");
});

app.get("/", async () => {
	const hat = await hatsSubgraphClient.getHat({
		chainId: 8453,
		hatId:
			3127354224771890648218270969600408586902742665114775171647448660574208n,
		props: {
			details: true,
		},
	});
	const { data } = await pinata.gateways.private.get(
		hat.details?.replace("ipfs://", "") || "",
	);
	console.log(data);
});

app.onError((error, c) => {
	console.error(error);
	return c.text("Internal Server Error", 500);
});

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
