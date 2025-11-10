import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorHandler = (err: Error, c: Context) => {
	const error = err.message;
	console.error(error);
	if (err instanceof HTTPException) {
		return c.json({ error }, err.status);
	}
	return c.json({ error }, 500);
};
