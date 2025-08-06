import { treeIdToTopHatId } from "@hatsprotocol/sdk-v1-core";
import { Hono } from "hono";
import { getHat } from "../../utils/hatsprotocol";
import { getName } from "../../utils/namestone";
import { ipfsUrlToRecord } from "../../utils/pinata";

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

	const [role, workspace] = await Promise.all([
		hat.details ? ipfsUrlToRecord(hat.details) : null,
		topHat.details ? ipfsUrlToRecord(topHat.details) : null,
	]);
});

export default goldsky;
