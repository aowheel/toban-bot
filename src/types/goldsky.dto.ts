export interface TransferFractionTokenPayload {
	amount: string;
	block_number: string;
	block_timestamp: string;
	from: string;
	id: string;
	to: string;
	token_id: string;
	workspace_id: string;
}

export interface MintThanksTokenPayload {
	amount: string;
	block_number: string;
	block_timestamp: string;
	data: string;
	from: string;
	id: string;
	to: string;
	workspace_id: string;
}
