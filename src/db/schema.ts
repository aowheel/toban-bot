import {
	foreignKey,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const tobanWorkspaces = sqliteTable(
	"toban_workspaces",
	{
		chainId: text("chain_id").notNull(),
		treeId: text("tree_id").notNull(),
		name: text("name").notNull(),
	},
	(t) => [primaryKey({ columns: [t.chainId, t.treeId] })],
);

export const discordChannels = sqliteTable("discord_channels", {
	id: text("id").notNull().primaryKey(),
});

export const tobanToDiscord = sqliteTable(
	"toban_to_discord",
	{
		chainId: text("chain_id").notNull(),
		treeId: text("tree_id").notNull(),
		channelId: text("channel_id").notNull(),
	},
	(t) => [
		primaryKey({ columns: [t.chainId, t.treeId, t.channelId] }),
		foreignKey({
			columns: [t.chainId, t.treeId],
			foreignColumns: [tobanWorkspaces.chainId, tobanWorkspaces.treeId],
		}),
		foreignKey({
			columns: [t.channelId],
			foreignColumns: [discordChannels.id],
		}),
	],
);
