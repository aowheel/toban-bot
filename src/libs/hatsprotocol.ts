import { HatsSubgraphClient } from "@hatsprotocol/sdk-v1-subgraph";

const hatsSubgraphClient = new HatsSubgraphClient({
	config: {
		8453: {
			endpoint:
				"https://api.studio.thegraph.com/query/55784/hats-v1-base/version/latest",
		},
	},
});

export default hatsSubgraphClient;
