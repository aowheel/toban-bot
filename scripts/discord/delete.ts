import { config } from "dotenv";

config({ path: ".dev.vars" });

async function deleteCommand() {
	const discordApplicationId = process.env.DISCORD_APPLICATION_ID;
	const discordBotToken = process.env.DISCORD_BOT_TOKEN;
	const commandId = process.argv[2];

	if (!discordApplicationId || !discordBotToken || !commandId) {
		throw new Error("Missing required environment variables or command ID");
	}

	const response = await fetch(
		`https://discord.com/api/v10/applications/${discordApplicationId}/commands/${commandId}`,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bot ${discordBotToken}`,
			},
		},
	);

	return response.json();
}

deleteCommand()
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.error(error);
	});
