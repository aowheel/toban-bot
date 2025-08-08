CREATE UNIQUE INDEX chain_tree_unique ON public.toban_workspaces USING btree (chain_id, tree_id);

alter table "public"."toban_workspaces" add constraint "chain_tree_unique" UNIQUE using index "chain_tree_unique";


