import hatsSubgraphClient from "../libs/hatsprotocol";

export async function getHat(hatId: bigint) {
	return hatsSubgraphClient.getHat({
		chainId: 8453,
		hatId,
		props: { details: true },
	});
}
