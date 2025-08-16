import { getDiscordEnv } from "../../src/config.js";
import { axiosInstance } from "../../src/utils/discord.js";

const { discordApplicationId } = getDiscordEnv();

async function createCommand() {
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

	const res = await axiosInstance.post(
		`/applications/${discordApplicationId}/commands`,
		body,
	);

	return res.data;
}

createCommand()
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.error(error);
	});
