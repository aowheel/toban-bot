import "dotenv/config";
import { DISCORD_API_BASE_URL } from "../../src/libs/discord";

async function createCommand() {
	const discordApplicationId = process.env.DISCORD_APPLICATION_ID;
	const discordBotToken = process.env.DISCORD_BOT_TOKEN;

	if (!discordApplicationId || !discordBotToken) {
		throw new Error(
			"DISCORD_APPLICATION_ID or DISCORD_BOT_TOKEN is not set in environment variables",
		);
	}

	const body = {
		name: "workspace",
		description: "Manage your workspace subscriptions",
		options: [
			{
				type: 1,
				name: "add",
				description: "Add a new workspace subscription",
				options: [
					{
						type: 4,
						name: "id",
						description: "The workspace ID to add",
						required: true,
					},
				],
			},
			{
				type: 1,
				name: "list",
				description: "List all your workspace subscriptions",
			},
			{
				type: 1,
				name: "remove",
				description: "Remove a workspace subscription",
				options: [
					{
						type: 4,
						name: "id",
						description: "The workspace ID to remove",
						required: true,
					},
				],
			},
		],
	};

	const res = await fetch(
		`${DISCORD_API_BASE_URL}/applications/${discordApplicationId}/commands`,
		{
			method: "POST",
			headers: {
				Authorization: `Bot ${discordBotToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		},
	);

	return res.json();
}

createCommand()
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.error(error);
	});
