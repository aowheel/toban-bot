import namestoneClient from "../libs/namestone";

export async function getName(address: string) {
	const res = await namestoneClient.getNames({ domain: "toban.eth", address });
	if (res.length === 0) return null;
	return res[0].name;
}
