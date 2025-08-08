import { DISCORD_API_BASE_URL } from "../../src/libs/discord";

async function deleteCommand() {
	const discordApplicationId = process.env.DISCORD_APPLICATION_ID;
	const discordBotToken = process.env.DISCORD_BOT_TOKEN;

	if (!discordApplicationId || !discordBotToken) {
		throw new Error(
			"DISCORD_APPLICATION_ID or DISCORD_BOT_TOKEN is not set in environment variables",
		);
	}

	const commandId = process.argv[2];

	const res = await fetch(
		`${DISCORD_API_BASE_URL}/applications/${discordApplicationId}/commands/${commandId}`,
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
