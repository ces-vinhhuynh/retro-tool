create table "public"."invitations" (
    "id" uuid not null default gen_random_uuid(),
    "token" text not null,
    "workspace_id" uuid,
    "team_id" uuid,
    "health_check_id" uuid
);


CREATE UNIQUE INDEX invitations_pkey ON public.invitations USING btree (id);

alter table "public"."invitations" add constraint "invitations_pkey" PRIMARY KEY using index "invitations_pkey";

alter table "public"."invitations" add constraint "invitations_health_check_id_fkey" FOREIGN KEY (health_check_id) REFERENCES health_checks(id) ON DELETE SET NULL not valid;

alter table "public"."invitations" validate constraint "invitations_health_check_id_fkey";

alter table "public"."invitations" add constraint "invitations_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL not valid;

alter table "public"."invitations" validate constraint "invitations_team_id_fkey";

alter table "public"."invitations" add constraint "invitations_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL not valid;

alter table "public"."invitations" validate constraint "invitations_workspace_id_fkey";

grant delete on table "public"."invitations" to "anon";

grant insert on table "public"."invitations" to "anon";

grant references on table "public"."invitations" to "anon";

grant select on table "public"."invitations" to "anon";

grant trigger on table "public"."invitations" to "anon";

grant truncate on table "public"."invitations" to "anon";

grant update on table "public"."invitations" to "anon";

grant delete on table "public"."invitations" to "authenticated";

grant insert on table "public"."invitations" to "authenticated";

grant references on table "public"."invitations" to "authenticated";

grant select on table "public"."invitations" to "authenticated";

grant trigger on table "public"."invitations" to "authenticated";

grant truncate on table "public"."invitations" to "authenticated";

grant update on table "public"."invitations" to "authenticated";

grant delete on table "public"."invitations" to "service_role";

grant insert on table "public"."invitations" to "service_role";

grant references on table "public"."invitations" to "service_role";

grant select on table "public"."invitations" to "service_role";

grant trigger on table "public"."invitations" to "service_role";

grant truncate on table "public"."invitations" to "service_role";

grant update on table "public"."invitations" to "service_role";


