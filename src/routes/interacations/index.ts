import { Hono } from "hono";
import discord from "./discord.js";

const interactions = new Hono();

interactions.route("/discord", discord);

export default interactions;
