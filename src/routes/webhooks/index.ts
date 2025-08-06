import { Hono } from "hono";
import discord from "./discord";
import goldsky from "./goldsky";

const webhooks = new Hono();

webhooks.route("/goldsky", goldsky);
webhooks.route("/discord", discord);

export default webhooks;
