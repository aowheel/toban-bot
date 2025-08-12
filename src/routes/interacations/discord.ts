import { treeIdToTopHatId } from "@hatsprotocol/sdk-v1-core";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import { Hono } from "hono";
import {
	editOriginalInteractionResponse,
	verifyKeyMiddleware,
} from "../../utils/discord";
import { getHat } from "../../utils/hatsprotocol";
import { ipfsUrlToJson } from "../../utils/pinata";
import {
	getWorkspacesByChannel,
	subscribeWorkspace,
	unsubscribeWorkspace,
} from "../../utils/supabase";

const discord = new Hono();

discord.post("/", verifyKeyMiddleware, async (c) => {
	const { type, data, channel_id, token } = c.get("body");

	if (type === InteractionType.PING) {
		return c.json({ type: InteractionResponseType.PONG });
	}

	if (type === InteractionType.APPLICATION_COMMAND) {
		if (data?.name === "workspace") {
			const subcommand = data.options?.[0];
			if (subcommand?.name === "add") {
				(async () => {
					try {
						const workspaceId = subcommand.options?.find(
							(option) => option.name === "id",
						)?.value;

						if (!workspaceId) {
							return editOriginalInteractionResponse(
								token,
								`❌ Workspace ID is required`,
							);
						}

						const topHatId = treeIdToTopHatId(Number(workspaceId));
						const topHat = await getHat(topHatId);

						if (!topHat.details) {
							return editOriginalInteractionResponse(
								token,
								`❌ No details found for workspace ID ${workspaceId}`,
							);
						}

						const json = (await ipfsUrlToJson(topHat.details)) as unknown as {
							data?: { name?: string };
						};

						if (!json.data?.name) {
							return editOriginalInteractionResponse(
								token,
								`❌ Invalid data found for workspace ID ${workspaceId}`,
							);
						}

						const workspace = await subscribeWorkspace(
							channel_id,
							8453,
							workspaceId,
							json.data.name,
						);

						await editOriginalInteractionResponse(
							token,
							`✅ Workspace **${workspace.name}** subscribed successfully!`,
						);
					} catch (error) {
						console.error(error);

						try {
							await editOriginalInteractionResponse(
								token,
								`❌ An error occurred while subscribing to the workspace.`,
							);
						} catch (error) {
							console.error(error);
						}
					}
				})();

				return c.json({
					type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
				});
			}

			if (subcommand?.name === "list") {
				(async () => {
					try {
						const workspaces = await getWorkspacesByChannel(channel_id);

						const content = `📋 Your workspace subscriptions:\n${workspaces
							.map(
								(workspace) =>
									`- **${workspace.name}** ( **ID** \`${workspace.tree_id}\` )`,
							)
							.join("\n")}`;

						await editOriginalInteractionResponse(token, content);
					} catch (error) {
						console.error(error);

						try {
							await editOriginalInteractionResponse(
								token,
								`❌ An error occurred while fetching workspace subscriptions.`,
							);
						} catch (error) {
							console.error(error);
						}
					}
				})();

				return c.json({
					type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
				});
			}

			if (subcommand?.name === "remove") {
				(async () => {
					try {
						const workspaceId = subcommand.options?.find(
							(option) => option.name === "id",
						)?.value;

						if (!workspaceId) {
							return editOriginalInteractionResponse(
								token,
								`❌ Workspace ID is required`,
							);
						}

						const workspace = await unsubscribeWorkspace(
							channel_id,
							8453,
							workspaceId,
						);

						await editOriginalInteractionResponse(
							token,
							`✅ Workspace **${workspace.name}** unsubscribed successfully!`,
						);
					} catch (error) {
						console.error(error);

						try {
							await editOriginalInteractionResponse(
								token,
								`❌ An error occurred while unsubscribing from the workspace.`,
							);
						} catch (error) {
							console.error(error);
						}
					}
				})();

				return c.json({
					type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
				});
			}
		}
	}

	// Default response for unknown commands
	return c.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: { content: "❌ Unknown command" },
	});
});

export default discord;
