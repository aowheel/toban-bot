import "dotenv/config";

export const getDiscordEnv = () => {
	const discordApplicationId = process.env.DISCORD_APPLICATION_ID;
	const discordBotToken = process.env.DISCORD_BOT_TOKEN;
	const discordPublicKey = process.env.DISCORD_PUBLIC_KEY;
	if (!discordApplicationId)
		throw new Error("DISCORD_APPLICATION_ID is not set");
	if (!discordBotToken) throw new Error("DISCORD_BOT_TOKEN is not set");
	if (!discordPublicKey) throw new Error("DISCORD_PUBLIC_KEY is not set");
	const discordApiBaseUrl = "https://discord.com/api/v10";
	return {
		discordApplicationId,
		discordBotToken,
		discordPublicKey,
		discordApiBaseUrl,
	};
};

export const getSupabaseEnv = () => {
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
	if (!supabaseUrl) throw new Error("SUPABASE_URL is not set");
	if (!supabaseSecretKey) throw new Error("SUPABASE_SECRET_KEY is not set");
	return { supabaseUrl, supabaseSecretKey };
};

export const getNamestoneEnv = () => {
	const namestoneApiKey = process.env.NAMESTONE_API_KEY;
	if (!namestoneApiKey) throw new Error("NAMESTONE_API_KEY is not set");
	return { namestoneApiKey };
};

export const getPinataEnv = () => {
	const pinataJwt = process.env.PINATA_JWT;
	const pinataGateway = process.env.PINATA_GATEWAY;
	const pinataGatewayKey = process.env.PINATA_GATEWAY_KEY;
	if (!pinataJwt) throw new Error("PINATA_JWT is not set");
	if (!pinataGateway) throw new Error("PINATA_GATEWAY is not set");
	if (!pinataGatewayKey) throw new Error("PINATA_GATEWAY_KEY is not set");
	return { pinataJwt, pinataGateway, pinataGatewayKey };
};

export const getGoldskyEnv = () => {
	const goldskyWebhookSecret = process.env.GOLDSKY_WEBHOOK_SECRET;
	if (!goldskyWebhookSecret)
		throw new Error("GOLDSKY_WEBHOOK_SECRET is not set");
	return { goldskyWebhookSecret };
};

export const getTobanEnv = () => {
	const tobanUrl = "https://toban.xyz";
	return { tobanUrl };
};
