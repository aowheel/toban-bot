import { and, eq } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { discordChannels, tobanToDiscord, tobanWorkspaces } from "../db/schema";
import type { InteractionsPayload } from "../types/discord.dto";

export class DiscordService {
	private db: DrizzleD1Database;
	private discordBotToken: string;

	constructor(args: {
		db: D1Database;
		discordBotToken: string;
	}) {
		this.db = drizzle(args.db);
		this.discordBotToken = args.discordBotToken;
	}

	private async ensureWorkspaceExists(
		chainId: string,
		treeId: string,
	): Promise<void> {
		await this.db
			.insert(tobanWorkspaces)
			.values({ chainId, treeId })
			.onConflictDoNothing();
	}

	private async ensureChannelExists(channelId: string): Promise<void> {
		await this.db
			.insert(discordChannels)
			.values({ id: channelId })
			.onConflictDoNothing();
	}

	private async subscribeWorkspace(
		chainId: string,
		treeId: string,
		channelId: string,
	): Promise<Array<{ chainId: string; treeId: string }>> {
		await Promise.all([
			this.ensureWorkspaceExists(chainId, treeId),
			this.ensureChannelExists(channelId),
		]);

		await this.db
			.insert(tobanToDiscord)
			.values({
				chainId,
				treeId,
				channelId,
			})
			.onConflictDoNothing();

		return this.db
			.select()
			.from(tobanToDiscord)
			.where(eq(tobanToDiscord.channelId, channelId));
	}

	private async fetchSubscribedWorkspaces(
		channelId: string,
	): Promise<Array<{ chainId: string; treeId: string }>> {
		return this.db
			.select()
			.from(tobanToDiscord)
			.where(eq(tobanToDiscord.channelId, channelId));
	}

	private async unsubscribeWorkspace(
		chainId: string,
		treeId: string,
		channelId: string,
	): Promise<Array<{ chainId: string; treeId: string }>> {
		await this.db
			.delete(tobanToDiscord)
			.where(
				and(
					eq(tobanToDiscord.chainId, chainId),
					eq(tobanToDiscord.treeId, treeId),
					eq(tobanToDiscord.channelId, channelId),
				),
			);

		return this.db
			.select()
			.from(tobanToDiscord)
			.where(eq(tobanToDiscord.channelId, channelId));
	}

	private async handleWorkspaceCommand(
		payload: InteractionsPayload,
		channelId: string,
	): Promise<string> {
		const subcommand = payload.data.options?.[0];
		if (!subcommand) {
			return "Unknown subcommand";
		}

		switch (subcommand.name) {
			case "add": {
				const workspaceId = subcommand.options?.find(
					(o) => o.name === "id",
				)?.value;
				if (typeof workspaceId === "number") {
					await this.subscribeWorkspace("8453", `${workspaceId}`, channelId);
					return `Subscribed to workspace \`${workspaceId}\``;
				}
				return "Invalid workspace ID";
			}

			case "list": {
				const subscriptions = await this.fetchSubscribedWorkspaces(channelId);
				if (subscriptions.length === 0) {
					return "No subscriptions found";
				}

				return [
					"Subscribed workspaces:",
					...subscriptions.map(
						({ chainId, treeId }) =>
							`- Chain \`${chainId}\`, Workspace \`${treeId}\``,
					),
				].join("\n");
			}

			case "remove": {
				const workspaceId = subcommand.options?.find(
					(o) => o.name === "id",
				)?.value;
				if (typeof workspaceId === "number") {
					await this.unsubscribeWorkspace("8453", `${workspaceId}`, channelId);
					return `Unsubscribed from workspace \`${workspaceId}\``;
				}
				return "Invalid workspace ID";
			}

			default: {
				return "Unknown subcommand";
			}
		}
	}

	async handleApplicationCommand(
		payload: InteractionsPayload,
	): Promise<string> {
		if (!payload.channel_id) {
			return "Channel ID is required";
		}

		const channelId = payload.channel_id;

		switch (payload.data.name) {
			case "workspace": {
				return this.handleWorkspaceCommand(payload, channelId);
			}
			default: {
				return "Unknown command";
			}
		}
	}

	async updateOriginalInteractionResponse(
		applicationId: string,
		interactionToken: string,
		content: string,
	): Promise<void> {
		await fetch(
			`https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bot ${this.discordBotToken}`,
				},
				body: JSON.stringify({ content }),
			},
		);
	}
}
