import { serve } from "@hono/node-server";
import app from "./index.js";

serve(app, (info) =>
	console.log(`Server is running on http://localhost:${info.port}`),
);
