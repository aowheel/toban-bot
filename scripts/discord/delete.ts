import { getDiscordEnv } from "../../src/config.js";
import { axiosInstance } from "../../src/utils/discord.js";

const { discordApplicationId } = getDiscordEnv();

async function deleteCommand() {
	const commandId = process.argv[2];

	const res = await axiosInstance.delete(
		`/applications/${discordApplicationId}/commands/${commandId}`,
	);

	return res.data;
}

deleteCommand()
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.error(error);
	});
