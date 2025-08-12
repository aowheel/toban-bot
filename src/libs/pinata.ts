import { PinataSDK } from "pinata";
import { getPinataEnv } from "../config.js";

const { pinataJwt, pinataGateway, pinataGatewayKey } = getPinataEnv();
const pinata = new PinataSDK({
	pinataJwt,
	pinataGateway,
	pinataGatewayKey,
});

export default pinata;
