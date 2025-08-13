import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import interactions from "./routes/interacations/index.js";
import webhooks from "./routes/webhooks/index.js";

const app = new Hono();

app.use("*", logger());
app.use("*", prettyJSON());

app.get("/healthz", (c) => c.text("OK"));

app.route("/webhooks", webhooks);
app.route("/interactions", interactions);

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
