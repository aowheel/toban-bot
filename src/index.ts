import { Hono } from "hono";
import { logger } from "hono/logger";
import { errorHandler } from "./middlewares/error";
import routes from "./routes";

const app = new Hono();

app.use("*", logger());
app.route("/", routes);
app.onError(errorHandler);

export default app;
