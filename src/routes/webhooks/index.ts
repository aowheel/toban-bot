import { Hono } from "hono";
import goldsky from "./goldsky.js";

const webhooks = new Hono();

webhooks.route("/goldsky", goldsky);

export default webhooks;
