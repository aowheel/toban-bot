import type {
	InteractionResponseFlags,
	InteractionResponseType,
	InteractionType,
} from "discord-interactions";

export interface EmbedField {
	name: string;
	value: string;
	inline?: boolean;
}

export interface EmbedAuthor {
	name?: string;
	url?: string;
	icon_url?: string;
}

export interface EmbedFooter {
	text: string;
	icon_url?: string;
}

export interface EmbedImage {
	url: string;
}

export interface EmbedThumbnail {
	url: string;
}

export interface Embed {
	title?: string;
	url?: string;
	description?: string;
	color?: number;
	timestamp?: string;
	author?: EmbedAuthor;
	fields?: EmbedField[];
	footer?: EmbedFooter;
	image?: EmbedImage;
	thumbnail?: EmbedThumbnail;
}

export interface ApplicationCommandInteractionOption {
	name: string;
	type: number;
	value?: string | number | boolean;
	options?: ApplicationCommandInteractionOption[];
	focused?: boolean;
}

export interface InteractionsPayload {
	id: string;
	application_id: string;
	type: InteractionType;
	data: {
		id: string;
		name: string;
		options?: Array<ApplicationCommandInteractionOption>;
	};
	guild_id?: string;
	channel_id?: string;
	member?: {
		user: {
			id: string;
			username: string;
			discriminator: string;
			avatar?: string;
		};
		roles: string[];
		premium_since?: string;
		permissions: string;
		pending?: boolean;
		nick?: string;
		joined_at: string;
		deaf: boolean;
		mute: boolean;
	};
	user?: {
		id: string;
		username: string;
		discriminator: string;
		avatar?: string;
	};
	token: string;
	version: number;
}

export interface InteractionResponsePayload {
	type: InteractionResponseType;
	data?: {
		tts?: boolean;
		content?: string;
		embeds?: Array<Embed>;
		allowed_mentions?: {
			parse?: string[];
			roles?: string[];
			users?: string[];
			replied_user?: boolean;
		};
		flags?: InteractionResponseFlags;
		components?: Array<unknown>;
		attachments?: Array<unknown>;
	};
}
