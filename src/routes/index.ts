import { Hono } from "hono";
import {
	verifyDiscordRequest,
	verifyGoldskyRequest,
} from "../middlewares/validation";
import discord from "./discord.controller";
import goldsky from "./goldsky.controller";

const routes = new Hono();

routes.use("/api/webhooks/goldsky/*", verifyGoldskyRequest);
routes.route("/api/webhooks/goldsky", goldsky);

routes.use("/api/webhooks/discord/*", verifyDiscordRequest);
routes.route("/api/webhooks/discord", discord);

export default routes;
