import { getDiscordEnv } from "../../src/config";

async function listCommand() {
	const { discordApplicationId, discordBotToken, discordApiBaseUrl } =
		getDiscordEnv();

	if (!discordApplicationId || !discordBotToken) {
		throw new Error(
			"DISCORD_APPLICATION_ID or DISCORD_BOT_TOKEN is not set in environment variables",
		);
	}

	const res = await fetch(
		`${discordApiBaseUrl}/applications/${discordApplicationId}/commands`,
		{
			method: "GET",
			headers: {
				Authorization: `Bot ${discordBotToken}`,
				"Content-Type": "application/json",
			},
		},
	);

	if (!res.ok) {
		throw new Error(`Failed to list commands: ${res.statusText}`);
	}

	const commands = await res.json();
	const commandIds = commands.map(({ id }: { id: string }) => id);

	return commandIds;
}

listCommand()
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.error(error);
	});
