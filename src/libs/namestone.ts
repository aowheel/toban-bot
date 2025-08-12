import NameStone from "@namestone/namestone-sdk";
import { getNamestoneEnv } from "../config.js";

const { namestoneApiKey } = getNamestoneEnv();
const ns = new NameStone(namestoneApiKey);

export default ns;
