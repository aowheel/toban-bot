create table "public"."discord_channels" (
    "id" uuid not null default gen_random_uuid(),
    "channel_id" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."discord_channels" enable row level security;

create table "public"."toban_workspaces" (
    "id" uuid not null default gen_random_uuid(),
    "chain_id" integer not null,
    "tree_id" bigint not null,
    "name" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."toban_workspaces" enable row level security;

create table "public"."workspace_channel_relations" (
    "workspace_id" uuid not null,
    "channel_id" uuid not null
);


alter table "public"."workspace_channel_relations" enable row level security;

CREATE UNIQUE INDEX discord_channels_channel_id_key ON public.discord_channels USING btree (channel_id);

CREATE UNIQUE INDEX discord_channels_pkey ON public.discord_channels USING btree (id);

CREATE UNIQUE INDEX toban_workspaces_pkey ON public.toban_workspaces USING btree (id);

CREATE UNIQUE INDEX workspace_channel_relations_pkey ON public.workspace_channel_relations USING btree (workspace_id, channel_id);

alter table "public"."discord_channels" add constraint "discord_channels_pkey" PRIMARY KEY using index "discord_channels_pkey";

alter table "public"."toban_workspaces" add constraint "toban_workspaces_pkey" PRIMARY KEY using index "toban_workspaces_pkey";

alter table "public"."workspace_channel_relations" add constraint "workspace_channel_relations_pkey" PRIMARY KEY using index "workspace_channel_relations_pkey";

alter table "public"."discord_channels" add constraint "discord_channels_channel_id_key" UNIQUE using index "discord_channels_channel_id_key";

alter table "public"."workspace_channel_relations" add constraint "workspace_channel_relations_channel_id_fkey" FOREIGN KEY (channel_id) REFERENCES discord_channels(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_channel_relations" validate constraint "workspace_channel_relations_channel_id_fkey";

alter table "public"."workspace_channel_relations" add constraint "workspace_channel_relations_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES toban_workspaces(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_channel_relations" validate constraint "workspace_channel_relations_workspace_id_fkey";

grant delete on table "public"."discord_channels" to "anon";

grant insert on table "public"."discord_channels" to "anon";

grant references on table "public"."discord_channels" to "anon";

grant select on table "public"."discord_channels" to "anon";

grant trigger on table "public"."discord_channels" to "anon";

grant truncate on table "public"."discord_channels" to "anon";

grant update on table "public"."discord_channels" to "anon";

grant delete on table "public"."discord_channels" to "authenticated";

grant insert on table "public"."discord_channels" to "authenticated";

grant references on table "public"."discord_channels" to "authenticated";

grant select on table "public"."discord_channels" to "authenticated";

grant trigger on table "public"."discord_channels" to "authenticated";

grant truncate on table "public"."discord_channels" to "authenticated";

grant update on table "public"."discord_channels" to "authenticated";

grant delete on table "public"."discord_channels" to "service_role";

grant insert on table "public"."discord_channels" to "service_role";

grant references on table "public"."discord_channels" to "service_role";

grant select on table "public"."discord_channels" to "service_role";

grant trigger on table "public"."discord_channels" to "service_role";

grant truncate on table "public"."discord_channels" to "service_role";

grant update on table "public"."discord_channels" to "service_role";

grant delete on table "public"."toban_workspaces" to "anon";

grant insert on table "public"."toban_workspaces" to "anon";

grant references on table "public"."toban_workspaces" to "anon";

grant select on table "public"."toban_workspaces" to "anon";

grant trigger on table "public"."toban_workspaces" to "anon";

grant truncate on table "public"."toban_workspaces" to "anon";

grant update on table "public"."toban_workspaces" to "anon";

grant delete on table "public"."toban_workspaces" to "authenticated";

grant insert on table "public"."toban_workspaces" to "authenticated";

grant references on table "public"."toban_workspaces" to "authenticated";

grant select on table "public"."toban_workspaces" to "authenticated";

grant trigger on table "public"."toban_workspaces" to "authenticated";

grant truncate on table "public"."toban_workspaces" to "authenticated";

grant update on table "public"."toban_workspaces" to "authenticated";

grant delete on table "public"."toban_workspaces" to "service_role";

grant insert on table "public"."toban_workspaces" to "service_role";

grant references on table "public"."toban_workspaces" to "service_role";

grant select on table "public"."toban_workspaces" to "service_role";

grant trigger on table "public"."toban_workspaces" to "service_role";

grant truncate on table "public"."toban_workspaces" to "service_role";

grant update on table "public"."toban_workspaces" to "service_role";

grant delete on table "public"."workspace_channel_relations" to "anon";

grant insert on table "public"."workspace_channel_relations" to "anon";

grant references on table "public"."workspace_channel_relations" to "anon";

grant select on table "public"."workspace_channel_relations" to "anon";

grant trigger on table "public"."workspace_channel_relations" to "anon";

grant truncate on table "public"."workspace_channel_relations" to "anon";

grant update on table "public"."workspace_channel_relations" to "anon";

grant delete on table "public"."workspace_channel_relations" to "authenticated";

grant insert on table "public"."workspace_channel_relations" to "authenticated";

grant references on table "public"."workspace_channel_relations" to "authenticated";

grant select on table "public"."workspace_channel_relations" to "authenticated";

grant trigger on table "public"."workspace_channel_relations" to "authenticated";

grant truncate on table "public"."workspace_channel_relations" to "authenticated";

grant update on table "public"."workspace_channel_relations" to "authenticated";

grant delete on table "public"."workspace_channel_relations" to "service_role";

grant insert on table "public"."workspace_channel_relations" to "service_role";

grant references on table "public"."workspace_channel_relations" to "service_role";

grant select on table "public"."workspace_channel_relations" to "service_role";

grant trigger on table "public"."workspace_channel_relations" to "service_role";

grant truncate on table "public"."workspace_channel_relations" to "service_role";

grant update on table "public"."workspace_channel_relations" to "service_role";


