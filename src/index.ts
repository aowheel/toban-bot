import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import interactions from "./routes/interacations/index.js";
import webhooks from "./routes/webhooks/index.js";
import "./types/hono.js";
import "./types/supabase.js";

const app = new Hono();

app.use("*", logger());
app.use("*", prettyJSON());

app.route("/webhooks", webhooks);
app.route("/interactions", interactions);

app.onError((error, c) => {
	console.error(error);
	return c.text("Internal Server Error", 500);
});

export default app;
