import pinata from "../libs/pinata.js";

export async function ipfsUrlToJson(ipfsUrl: string) {
	const cid = ipfsUrl.replace("ipfs://", "");
	const res = await pinata.gateways.private.get(cid);
	return res.data;
}
