import { config } from "dotenv";

config({ path: ".dev.vars" });

async function listCommand() {
	const discordApplicationId = process.env.DISCORD_APPLICATION_ID;
	const discordBotToken = process.env.DISCORD_BOT_TOKEN;

	if (!discordApplicationId || !discordBotToken) {
		throw new Error("Missing required environment variables");
	}

	const response = await fetch(
		`https://discord.com/api/v10/applications/${discordApplicationId}/commands`,
		{
			headers: {
				Authorization: `Bot ${discordBotToken}`,
			},
		},
	);

	const commands = await response.json<Array<{ id: string }>>();

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
