CREATE TABLE `discord_channels` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `toban_to_discord` (
	`chain_id` text NOT NULL,
	`tree_id` text NOT NULL,
	`channel_id` text NOT NULL,
	PRIMARY KEY(`chain_id`, `tree_id`, `channel_id`),
	FOREIGN KEY (`chain_id`,`tree_id`) REFERENCES `toban_workspaces`(`chain_id`,`tree_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`channel_id`) REFERENCES `discord_channels`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `toban_workspaces` (
	`chain_id` text NOT NULL,
	`tree_id` text NOT NULL,
	PRIMARY KEY(`chain_id`, `tree_id`)
);
