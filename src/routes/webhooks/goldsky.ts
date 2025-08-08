import { treeIdToTopHatId } from "@hatsprotocol/sdk-v1-core";
import { Hono } from "hono";
import { getHat } from "../../utils/hatsprotocol";
import { getName } from "../../utils/namestone";
import { ipfsUrlToJson } from "../../utils/pinata";

const goldsky = new Hono();

goldsky.post("/", async (c) => {
	const {
		data: { new: transferData },
	} = await c.req.json();

	const from = String(transferData.from);
	const to = String(transferData.to);
	const wearer = String(transferData.wearer);
	const hatId = BigInt(transferData.hat_id);
	const treeId = Number(transferData.workspace_id);
	const topHatId = treeIdToTopHatId(treeId);
	const amount = Number(transferData.amount);

	const [fromName, toName, wearerName, hat, topHat] = await Promise.all([
		getName(from),
		getName(to),
		getName(wearer),
		getHat(hatId),
		getHat(topHatId),
	]);

	if (!hat.details) {
		throw new Error("Hat details not found");
	}

	if (!topHat.details) {
		throw new Error("Top hat details not found");
	}

	const [role, workspace] = await Promise.all([
		ipfsUrlToJson(hat.details),
		ipfsUrlToJson(topHat.details),
	]);
});

export default goldsky;
