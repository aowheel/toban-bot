export interface FetchHatIdByTokenResponse {
	data: {
		initializedFractionTokens: Array<{
			hatId: string;
			wearer: string;
		}>;
	};
}

export interface FetchHatByIdResponse {
	data: {
		hats: Array<{
			details: string;
			imageUri: string;
		}>;
	};
}
