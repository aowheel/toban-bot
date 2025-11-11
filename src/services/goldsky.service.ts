import { and, eq } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { tobanToDiscord } from "../db/schema";
import type { Embed } from "../types/discord.dto";
import type {
	MintThanksTokenPayload,
	TransferFractionTokenPayload,
} from "../types/goldsky.dto";
import type {
	FetchHatByIdResponse,
	FetchHatIdByTokenResponse,
} from "../types/graphql.dto";
import type { HatDetails } from "../types/ipfs.dto";

export class GoldskyService {
	private readonly db: DrizzleD1Database;
	private readonly namestoneApiKey: string;
	private readonly pinataGatewayToken: string;
	private readonly hatsGraphqlEndpoint: string;
	private readonly tobanGraphqlEndpoint: string;
	private readonly discordBotToken: string;

	constructor(args: {
		db: D1Database;
		namestoneApiKey: string;
		pinataGatewayToken: string;
		hatsGraphqlEndpoint: string;
		tobanGraphqlEndpoint: string;
		discordBotToken: string;
	}) {
		this.db = drizzle(args.db);
		this.namestoneApiKey = args.namestoneApiKey;
		this.pinataGatewayToken = args.pinataGatewayToken;
		this.hatsGraphqlEndpoint = args.hatsGraphqlEndpoint;
		this.tobanGraphqlEndpoint = args.tobanGraphqlEndpoint;
		this.discordBotToken = args.discordBotToken;
	}

	private async fetchName(address: string): Promise<string | null> {
		const response = await fetch(
			`https://namestone.com/api/public_v1/get-names?domain=toban.eth&address=${address}`,
			{
				method: "GET",
				headers: {
					Authorization: this.namestoneApiKey,
				},
			},
		);

		const results = await response.json<Array<{ name: string }>>();
		if (results.length === 0) return null;
		return results[0].name;
	}

	private async fetchJsonFromIpfs<T>(ipfsUrl: string): Promise<T> {
		const ipfsGatewayUrl = this.convertIpfsToHttp(ipfsUrl);
		const response = await fetch(ipfsGatewayUrl);
		return response.json();
	}

	private convertIpfsToHttp(ipfsUrl: string): string {
		const httpUrl = ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
		return `${httpUrl}?pinataGatewayToken=${this.pinataGatewayToken}`;
	}

	private async fetchFractionTokenById(
		tokenId: string,
	): Promise<{ hatId: string; wearer: string } | null> {
		const query = `
			query ($tokenId: BigInt!) {
				initializedFractionTokens(where: {tokenId: $tokenId}) {
					hatId
					wearer
				}
			}
		`;

		const variables = { tokenId };

		const response = await fetch(this.tobanGraphqlEndpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query, variables }),
		});

		const json = await response.json<FetchHatIdByTokenResponse>();

		const initializedFractionTokens = json.data.initializedFractionTokens;

		if (initializedFractionTokens.length === 0) return null;

		return initializedFractionTokens[0];
	}

	private async fetchHatById(
		hatId: string,
	): Promise<{ details: string; imageUri: string } | null> {
		const query = `
			query ($hatId: ID!) {
				hats(where: {id: $hatId}) {
					details
					imageUri
				}
			}
		`;

		const variables = { hatId };

		const response = await fetch(this.hatsGraphqlEndpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query, variables }),
		});

		const json = await response.json<FetchHatByIdResponse>();

		const hats = json.data.hats;

		if (hats.length === 0) return null;

		return hats[0];
	}

	private convertToHatId(n: number): string {
		const hex = n.toString(16);
		const padded = hex.padStart(64, "0");
		return `0x${padded}`;
	}

	private convertToTopHatId(n: number): string {
		const hex = n.toString(16);
		const padded = hex.padStart(8, "0").padEnd(64, "0");
		return `0x${padded}`;
	}

	private async sendMessageToDiscordChannel(
		channelId: string,
		embeds: Array<Embed>,
	): Promise<void> {
		await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${this.discordBotToken}`,
			},
			body: JSON.stringify({ embeds }),
		});
	}

	async handleFractionTokenTransferred(
		chainId: string,
		payload: TransferFractionTokenPayload,
	): Promise<void> {
		let wearer: string | null = null;
		let hatDetails: HatDetails | null = null;
		let hatImageUrl: string | null = null;
		const fractionToken = await this.fetchFractionTokenById(payload.token_id);
		if (fractionToken) {
			const hatIdHex = this.convertToHatId(Number(fractionToken.hatId));
			const hat = await this.fetchHatById(hatIdHex);
			wearer = fractionToken.wearer;
			if (hat) {
				hatDetails = await this.fetchJsonFromIpfs<HatDetails>(hat.details);
				hatImageUrl = this.convertIpfsToHttp(hat.imageUri);
			}
		}

		let topHatDetails: HatDetails | null = null;
		let topHatImageUrl: string | null = null;
		const topHatIdHex = this.convertToTopHatId(Number(payload.workspace_id));
		const topHat = await this.fetchHatById(topHatIdHex);
		if (topHat) {
			topHatDetails = await this.fetchJsonFromIpfs<HatDetails>(topHat.details);
			topHatImageUrl = this.convertIpfsToHttp(topHat.imageUri);
		}

		const [fromName, toName, wearerName] = await Promise.all(
			[payload.from, payload.to, wearer].map(async (address) => {
				if (!address) return null;
				return this.fetchName(address);
			}),
		);

		const channels = await this.db
			.select()
			.from(tobanToDiscord)
			.where(
				and(
					eq(tobanToDiscord.chainId, chainId),
					eq(tobanToDiscord.treeId, payload.workspace_id),
				),
			);

		await Promise.all(
			channels.map((c) =>
				this.sendMessageToDiscordChannel(c.channelId, [
					{
						title: wearerName
							? `${wearerName}'s Role Transferred`
							: "Role Share Transferred",
						url: `https://v2.toban.xyz/${payload.workspace_id}`,
						color: 0xf4b420,
						fields: [
							{
								name: "Role",
								value: hatDetails ? hatDetails.data.name : "*Unknown*",
								inline: false,
							},
							{
								name: "From",
								value: fromName ?? `\`${payload.from}\``,
								inline: true,
							},
							{
								name: "To",
								value: toName ?? `\`${payload.to}\``,
								inline: true,
							},
							{
								name: "Amount",
								value: payload.amount,
								inline: false,
							},
						],
						...(topHatDetails && {
							footer: {
								text: topHatDetails.data.name,
								...(topHatImageUrl && { icon_url: topHatImageUrl }),
							},
						}),
						...(hatImageUrl && {
							thumbnail: {
								url: hatImageUrl,
							},
						}),
					},
				]),
			),
		);
	}

	async handleThanksTokenMinted(
		chainId: string,
		payload: MintThanksTokenPayload,
	): Promise<void> {
		let topHatDetails: HatDetails | null = null;
		let topHatImageUrl: string | null = null;
		const topHatIdHex = this.convertToTopHatId(Number(payload.workspace_id));
		const topHat = await this.fetchHatById(topHatIdHex);
		if (topHat) {
			topHatDetails = await this.fetchJsonFromIpfs<HatDetails>(topHat.details);
			topHatImageUrl = this.convertIpfsToHttp(topHat.imageUri);
		}

		const [fromName, toName] = await Promise.all(
			[payload.from, payload.to].map(async (address) => {
				if (!address) return null;
				return this.fetchName(address);
			}),
		);

		const amount = Number(payload.amount) / 1e18;

		const channels = await this.db
			.select()
			.from(tobanToDiscord)
			.where(
				and(
					eq(tobanToDiscord.chainId, chainId),
					eq(tobanToDiscord.treeId, payload.workspace_id),
				),
			);

		await Promise.all(
			channels.map((c) =>
				this.sendMessageToDiscordChannel(c.channelId, [
					{
						title: "Thanks Token Transferred",
						url: `https://v2.toban.xyz/${payload.workspace_id}`,
						color: 0x2096b4,
						fields: [
							{
								name: "From",
								value: fromName ?? `\`${payload.from}\``,
								inline: true,
							},
							{
								name: "To",
								value: toName ?? `\`${payload.to}\``,
								inline: true,
							},
							{
								name: "Amount",
								value: `${amount}`,
								inline: false,
							},
						],
						...(topHatDetails && {
							footer: {
								text: topHatDetails.data.name,
								...(topHatImageUrl && { icon_url: topHatImageUrl }),
							},
						}),
					},
				]),
			),
		);
	}
}
