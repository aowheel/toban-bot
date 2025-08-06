import pinata from "../libs/pinata";

export async function ipfsUrlToRecord(
	ipfsUrl: string,
): Promise<Record<string, unknown>> {
	const cid = ipfsUrl.replace("ipfs://", "");
	const res = await pinata.gateways.private.get(cid);
	const record = JSON.parse(res.data?.toString() || "{}");
	return record;
}
