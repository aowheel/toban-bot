import { treeIdToTopHatId } from "@hatsprotocol/sdk-v1-core";
import { Hono } from "hono";
import { getTobanEnv } from "../../config.js";
import { createMessage } from "../../utils/discord.js";
import { verifySecretMiddleware } from "../../utils/goldsky.js";
import { getHat } from "../../utils/hatsprotocol.js";
import { getName } from "../../utils/namestone.js";
import { ipfsUrlToJson } from "../../utils/pinata.js";
import { getChannelsByWorkspace } from "../../utils/supabase.js";

const { tobanUrl } = getTobanEnv();

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

	const embeds = [
		{
			title: `✨ ${wearerName || wearer}'s Role Transfer`,
			url: `${tobanUrl}/${treeId}`,
			fields: [
				{ name: "Role", value: role.data?.name || "unknown", inline: true },
				{ name: "From", value: fromName || from, inline: true },
				{ name: "To", value: toName || to, inline: true },
				{ name: "Amount", value: String(amount), inline: true },
			],
			...(workspace.data?.name && {
				footer: {
					text: workspace.data?.name,
					icon_url: `${tobanUrl}/images/toban-logo.svg`,
				},
			}),
			color: 0xf4b520,
		},
	];

	const channels = await getChannelsByWorkspace(8453, treeId);

	await Promise.all(
		channels.map((channel: { channel_id: string }) =>
			createMessage(channel.channel_id, { embeds }),
		),
	);

	return c.text("Success");
});

export default goldsky;
