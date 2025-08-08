import { Hono } from "hono";
import goldsky from "./goldsky";

const webhooks = new Hono();

webhooks.route("/goldsky", goldsky);

export default webhooks;
