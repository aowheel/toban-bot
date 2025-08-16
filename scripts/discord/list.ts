import { getDiscordEnv } from "../../src/config.js";
import { axiosInstance } from "../../src/utils/discord.js";

const { discordApplicationId } = getDiscordEnv();

async function listCommand() {
	const res = await axiosInstance.get(
		`/applications/${discordApplicationId}/commands`,
	);

	const commands = res.data;
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
