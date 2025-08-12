import ns from "../libs/namestone.js";

export async function getName(address: string) {
	const res = await ns.getNames({ domain: "toban.eth", address });
	if (res.length === 0) return null;
	return res[0].name;
}
