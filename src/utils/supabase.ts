import supabase from "../libs/supabase.js";

export async function subscribeWorkspace(
	channelId: string,
	chainId: number,
	treeId: number,
	workspaceName: string,
) {
	const { data: workspace, error: workspaceUpsertError } = await supabase
		.from("toban_workspaces")
		.upsert(
			{ chain_id: chainId, tree_id: treeId, name: workspaceName },
			{ onConflict: "chain_id, tree_id" },
		)
		.select()
		.single();

	if (workspaceUpsertError) throw workspaceUpsertError;

	const { data: channel, error: channelUpsertError } = await supabase
		.from("discord_channels")
		.upsert({ channel_id: channelId }, { onConflict: "channel_id" })
		.select()
		.single();

	if (channelUpsertError) throw channelUpsertError;

	const { error: relationUpsertError } = await supabase
		.from("workspace_channel_relations")
		.upsert({ workspace_id: workspace.id, channel_id: channel.id });

	if (relationUpsertError) throw relationUpsertError;

	return workspace;
}

export async function getWorkspacesByChannel(channelId: string) {
	const { data: workspaces, error } = await supabase
		.from("toban_workspaces")
		.select("*, discord_channels!inner(*)")
		.eq("discord_channels.channel_id", channelId);

	if (error) throw error;

	return workspaces;
}

export async function getChannelsByWorkspace(chainId: number, treeId: number) {
	const { data: channels, error } = await supabase
		.from("discord_channels")
		.select("*, toban_workspaces!inner(*)")
		.eq("toban_workspaces.chain_id", chainId)
		.eq("toban_workspaces.tree_id", treeId);

	if (error) throw error;

	return channels;
}

export async function unsubscribeWorkspace(
	channelId: string,
	chainId: number,
	treeId: number,
) {
	const { data: workspace, error: workspaceFetchError } = await supabase
		.from("toban_workspaces")
		.select()
		.eq("chain_id", chainId)
		.eq("tree_id", treeId)
		.single();

	if (workspaceFetchError) throw workspaceFetchError;

	const { data: channel, error: channelFetchError } = await supabase
		.from("discord_channels")
		.select()
		.eq("channel_id", channelId)
		.single();

	if (channelFetchError) throw channelFetchError;

	const { error: deleteError } = await supabase
		.from("workspace_channel_relations")
		.delete()
		.eq("workspace_id", workspace.id)
		.eq("channel_id", channel.id);

	if (deleteError) throw deleteError;

	return workspace;
}
