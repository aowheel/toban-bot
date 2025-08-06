import { PinataSDK } from "pinata";

const pinataJwt = process.env.PINATA_JWT;
const pinataGateway = process.env.PINATA_GATEWAY;
if (!pinataJwt || !pinataGateway) {
	throw new Error(
		"PINATA_JWT or PINATA_GATEWAY is not set in environment variables",
	);
}
const pinata = new PinataSDK({
	pinataJwt,
	pinataGateway,
});

export default pinata;
