import { getDiscordEnv } from "../../src/config";

async function deleteCommand() {
	const { discordApplicationId, discordBotToken, discordApiBaseUrl } =
		getDiscordEnv();

	if (!discordApplicationId || !discordBotToken) {
		throw new Error(
			"DISCORD_APPLICATION_ID or DISCORD_BOT_TOKEN is not set in environment variables",
		);
	}

	const commandId = process.argv[2];

	const res = await fetch(
		`${discordApiBaseUrl}/applications/${discordApplicationId}/commands/${commandId}`,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bot ${discordBotToken}`,
				"Content-Type": "application/json",
			},
		},
	);

	return res.json();
}

deleteCommand()
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.error(error);
	});
