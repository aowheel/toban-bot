import { config } from "dotenv";

config({ path: ".dev.vars" });

async function createCommand() {
	const discordApplicationId = process.env.DISCORD_APPLICATION_ID;
	const discordBotToken = process.env.DISCORD_BOT_TOKEN;

	if (!discordApplicationId || !discordBotToken) {
		throw new Error("Missing required environment variables");
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

	const response = await fetch(
		`https://discord.com/api/v10/applications/${discordApplicationId}/commands`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${discordBotToken}`,
			},
			body: JSON.stringify(body),
		},
	);

	return response.json();
}

createCommand()
	.then((data) => {
		console.log(data);
	})
	.catch((err) => {
		console.error(err);
	});
