import { treeIdToTopHatId } from "@hatsprotocol/sdk-v1-core";
import { Hono } from "hono";
import { createMessage } from "../../utils/discord";
import { verifySecretMiddleware } from "../../utils/goldsky";
import { getHat } from "../../utils/hatsprotocol";
import { getName } from "../../utils/namestone";
import { ipfsUrlToJson } from "../../utils/pinata";
import { getChannelsByWorkspace } from "../../utils/supabase";

const goldsky = new Hono();

goldsky.post("*", verifySecretMiddleware, async (c) => {
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

	const [role, workspace] = (await Promise.all([
		hat.details ? ipfsUrlToJson(hat.details) : {},
		topHat.details ? ipfsUrlToJson(topHat.details) : {},
	])) as [unknown, unknown] as [
		{ data?: { name?: string } },
		{ data?: { name?: string } },
	];

	const content = `✨ \`${wearerName || wearer}\`'s \`${role.data?.name || "unknown"}\` role transferred in workspace **${workspace.data?.name || "unknown"}**\n- **From** \`${fromName || from}\`\n- **To** \`${toName || to}\`\n- **Amount** \`${amount}\``;

	const channels = await getChannelsByWorkspace(8453, treeId);

	await Promise.all(
		channels.map((channel) => createMessage(channel.channel_id, content)),
	);

	return c.text("Success");
});

export default goldsky;
