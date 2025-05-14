create type "public"."team_role" as enum ('admin', 'member');

drop trigger if exists "handle_updated_at" on "public"."project_users";

drop trigger if exists "handle_updated_at" on "public"."projects";

drop trigger if exists "on_project_created" on "public"."projects";

drop policy "Project admin can add project users" on "public"."project_users";

drop policy "Project admin can delete project users" on "public"."project_users";

drop policy "Project admin can update project users" on "public"."project_users";

drop policy "Project members can view project users" on "public"."project_users";

drop policy "Owner/Admin can create projects" on "public"."projects";

drop policy "Owner/Admin can delete projects" on "public"."projects";

drop policy "Owner/Admin can update projects" on "public"."projects";

drop policy "Workspace members can view projects" on "public"."projects";

drop policy "Workspace members can view workspace users" on "public"."workspace_users";

revoke delete on table "public"."project_users" from "anon";

revoke insert on table "public"."project_users" from "anon";

revoke references on table "public"."project_users" from "anon";

revoke select on table "public"."project_users" from "anon";

revoke trigger on table "public"."project_users" from "anon";

revoke truncate on table "public"."project_users" from "anon";

revoke update on table "public"."project_users" from "anon";

revoke delete on table "public"."project_users" from "authenticated";

revoke insert on table "public"."project_users" from "authenticated";

revoke references on table "public"."project_users" from "authenticated";

revoke select on table "public"."project_users" from "authenticated";

revoke trigger on table "public"."project_users" from "authenticated";

revoke truncate on table "public"."project_users" from "authenticated";

revoke update on table "public"."project_users" from "authenticated";

revoke delete on table "public"."project_users" from "service_role";

revoke insert on table "public"."project_users" from "service_role";

revoke references on table "public"."project_users" from "service_role";

revoke select on table "public"."project_users" from "service_role";

revoke trigger on table "public"."project_users" from "service_role";

revoke truncate on table "public"."project_users" from "service_role";

revoke update on table "public"."project_users" from "service_role";

revoke delete on table "public"."projects" from "anon";

revoke insert on table "public"."projects" from "anon";

revoke references on table "public"."projects" from "anon";

revoke select on table "public"."projects" from "anon";

revoke trigger on table "public"."projects" from "anon";

revoke truncate on table "public"."projects" from "anon";

revoke update on table "public"."projects" from "anon";

revoke delete on table "public"."projects" from "authenticated";

revoke insert on table "public"."projects" from "authenticated";

revoke references on table "public"."projects" from "authenticated";

revoke select on table "public"."projects" from "authenticated";

revoke trigger on table "public"."projects" from "authenticated";

revoke truncate on table "public"."projects" from "authenticated";

revoke update on table "public"."projects" from "authenticated";

revoke delete on table "public"."projects" from "service_role";

revoke insert on table "public"."projects" from "service_role";

revoke references on table "public"."projects" from "service_role";

revoke select on table "public"."projects" from "service_role";

revoke trigger on table "public"."projects" from "service_role";

revoke truncate on table "public"."projects" from "service_role";

revoke update on table "public"."projects" from "service_role";

alter table "public"."health_checks" drop constraint "health_checks_project_id_fkey";

alter table "public"."project_users" drop constraint "project_users_project_id_fkey";

alter table "public"."project_users" drop constraint "project_users_project_id_user_id_key";

alter table "public"."project_users" drop constraint "project_users_user_id_fkey";

alter table "public"."projects" drop constraint "projects_workspace_id_fkey";

drop function if exists "public"."create_workspace_and_project"(ws_id uuid, ws_name text, proj_id uuid, proj_name text);

drop function if exists "public"."handle_new_project_user"();

alter table "public"."project_users" drop constraint "project_users_pkey";

alter table "public"."projects" drop constraint "projects_pkey";

drop index if exists "public"."project_users_pkey";

drop index if exists "public"."project_users_project_id_user_id_key";

drop index if exists "public"."projects_pkey";

drop table "public"."project_users";

drop table "public"."projects";

create table "public"."team_users" (
    "id" uuid not null default gen_random_uuid(),
    "team_id" uuid not null,
    "user_id" uuid not null,
    "role" team_role,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."team_users" enable row level security;

create table "public"."teams" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "name" text not null,
    "logo_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."teams" enable row level security;

alter table "public"."health_checks" drop column "project_id";

alter table "public"."health_checks" add column "team_id" uuid;

drop type "public"."project_role";

CREATE UNIQUE INDEX team_users_pkey ON public.team_users USING btree (id);

CREATE UNIQUE INDEX team_users_team_id_user_id_key ON public.team_users USING btree (team_id, user_id);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

alter table "public"."team_users" add constraint "team_users_pkey" PRIMARY KEY using index "team_users_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."health_checks" add constraint "health_checks_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL not valid;

alter table "public"."health_checks" validate constraint "health_checks_team_id_fkey";

alter table "public"."team_users" add constraint "team_users_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."team_users" validate constraint "team_users_team_id_fkey";

alter table "public"."team_users" add constraint "team_users_team_id_user_id_key" UNIQUE using index "team_users_team_id_user_id_key";

alter table "public"."team_users" add constraint "team_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."team_users" validate constraint "team_users_user_id_fkey";

alter table "public"."teams" add constraint "teams_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE not valid;

alter table "public"."teams" validate constraint "teams_workspace_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_workspace_and_team(ws_id uuid, ws_name text, team_id uuid, team_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  -- Insert workspace
  insert into workspaces (id, name)
  values (ws_id, ws_name);

  -- Insert team
  insert into teams (id, workspace_id, name)
  values (team_id, ws_id, team_name);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_team_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into team_users (team_id, user_id, role)
  values (new.id, auth.uid(), 'admin');
  return new;
end;
$function$
;

grant delete on table "public"."team_users" to "anon";

grant insert on table "public"."team_users" to "anon";

grant references on table "public"."team_users" to "anon";

grant select on table "public"."team_users" to "anon";

grant trigger on table "public"."team_users" to "anon";

grant truncate on table "public"."team_users" to "anon";

grant update on table "public"."team_users" to "anon";

grant delete on table "public"."team_users" to "authenticated";

grant insert on table "public"."team_users" to "authenticated";

grant references on table "public"."team_users" to "authenticated";

grant select on table "public"."team_users" to "authenticated";

grant trigger on table "public"."team_users" to "authenticated";

grant truncate on table "public"."team_users" to "authenticated";

grant update on table "public"."team_users" to "authenticated";

grant delete on table "public"."team_users" to "service_role";

grant insert on table "public"."team_users" to "service_role";

grant references on table "public"."team_users" to "service_role";

grant select on table "public"."team_users" to "service_role";

grant trigger on table "public"."team_users" to "service_role";

grant truncate on table "public"."team_users" to "service_role";

grant update on table "public"."team_users" to "service_role";

grant delete on table "public"."teams" to "anon";

grant insert on table "public"."teams" to "anon";

grant references on table "public"."teams" to "anon";

grant select on table "public"."teams" to "anon";

grant trigger on table "public"."teams" to "anon";

grant truncate on table "public"."teams" to "anon";

grant update on table "public"."teams" to "anon";

grant delete on table "public"."teams" to "authenticated";

grant insert on table "public"."teams" to "authenticated";

grant references on table "public"."teams" to "authenticated";

grant select on table "public"."teams" to "authenticated";

grant trigger on table "public"."teams" to "authenticated";

grant truncate on table "public"."teams" to "authenticated";

grant update on table "public"."teams" to "authenticated";

grant delete on table "public"."teams" to "service_role";

grant insert on table "public"."teams" to "service_role";

grant references on table "public"."teams" to "service_role";

grant select on table "public"."teams" to "service_role";

grant trigger on table "public"."teams" to "service_role";

grant truncate on table "public"."teams" to "service_role";

grant update on table "public"."teams" to "service_role";

create policy "Team admin can add team users"
on "public"."team_users"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM team_users tu2
  WHERE ((tu2.team_id = team_users.team_id) AND (tu2.user_id = auth.uid()) AND (tu2.role = 'admin'::team_role)))));


create policy "Team admin can delete team users"
on "public"."team_users"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM team_users tu2
  WHERE ((tu2.team_id = team_users.team_id) AND (tu2.user_id = auth.uid()) AND (tu2.role = 'admin'::team_role)))));


create policy "Team admin can update team users"
on "public"."team_users"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM team_users tu2
  WHERE ((tu2.team_id = team_users.team_id) AND (tu2.user_id = auth.uid()) AND (tu2.role = 'admin'::team_role)))));


create policy "Users can see their own team_users rows"
on "public"."team_users"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Owner/Admin can create teams"
on "public"."teams"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = teams.workspace_id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Owner/Admin can delete teams"
on "public"."teams"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = teams.workspace_id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Owner/Admin can update teams"
on "public"."teams"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = teams.workspace_id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Workspace members can view teams"
on "public"."teams"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = teams.workspace_id) AND (workspace_users.user_id = auth.uid())))));


create policy "Users can see their own workspace_users rows"
on "public"."workspace_users"
as permissive
for select
to public
using ((user_id = auth.uid()));

alter publication supabase_realtime add table teams;

alter publication supabase_realtime add table team_users;


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.team_users FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER on_team_created AFTER INSERT ON public.teams FOR EACH ROW EXECUTE FUNCTION handle_new_team_user();


