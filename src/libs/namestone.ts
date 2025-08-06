import NameStone from "@namestone/namestone-sdk";

const namestoneApiKey = process.env.NAMESTONE_API_KEY;
if (!namestoneApiKey) {
	throw new Error("NAMESTONE_API_KEY is not set in environment variables");
}
const ns = new NameStone(namestoneApiKey);

export default ns;
