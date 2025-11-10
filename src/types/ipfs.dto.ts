export interface HatDetails {
	type: string;
	data: {
		name: string;
		description: string;
		responsabilities: unknown[];
		authorities: unknown[];
	};
}
