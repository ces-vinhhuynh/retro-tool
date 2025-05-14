create type "public"."project_role" as enum ('admin', 'member');

create type "public"."workspace_role" as enum ('owner', 'admin', 'member');

create table "public"."project_users" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "user_id" uuid not null,
    "role" project_role,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."project_users" enable row level security;

create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "name" text not null,
    "logo_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."projects" enable row level security;

create table "public"."workspace_users" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "user_id" uuid not null,
    "role" workspace_role,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."workspace_users" enable row level security;

create table "public"."workspaces" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."workspaces" enable row level security;

alter table "public"."health_checks" drop column "team_id";

alter table "public"."health_checks" add column "project_id" uuid;

CREATE UNIQUE INDEX project_users_pkey ON public.project_users USING btree (id);

CREATE UNIQUE INDEX project_users_project_id_user_id_key ON public.project_users USING btree (project_id, user_id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX workspace_users_pkey ON public.workspace_users USING btree (id);

CREATE UNIQUE INDEX workspace_users_workspace_id_user_id_key ON public.workspace_users USING btree (workspace_id, user_id);

CREATE UNIQUE INDEX workspaces_pkey ON public.workspaces USING btree (id);

alter table "public"."project_users" add constraint "project_users_pkey" PRIMARY KEY using index "project_users_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."workspace_users" add constraint "workspace_users_pkey" PRIMARY KEY using index "workspace_users_pkey";

alter table "public"."workspaces" add constraint "workspaces_pkey" PRIMARY KEY using index "workspaces_pkey";

alter table "public"."health_checks" add constraint "health_checks_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL not valid;

alter table "public"."health_checks" validate constraint "health_checks_project_id_fkey";

alter table "public"."project_users" add constraint "project_users_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."project_users" validate constraint "project_users_project_id_fkey";

alter table "public"."project_users" add constraint "project_users_project_id_user_id_key" UNIQUE using index "project_users_project_id_user_id_key";

alter table "public"."project_users" add constraint "project_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."project_users" validate constraint "project_users_user_id_fkey";

alter table "public"."projects" add constraint "projects_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_workspace_id_fkey";

alter table "public"."workspace_users" add constraint "workspace_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_users" validate constraint "workspace_users_user_id_fkey";

alter table "public"."workspace_users" add constraint "workspace_users_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE not valid;

alter table "public"."workspace_users" validate constraint "workspace_users_workspace_id_fkey";

alter table "public"."workspace_users" add constraint "workspace_users_workspace_id_user_id_key" UNIQUE using index "workspace_users_workspace_id_user_id_key";

alter publication supabase_realtime add table workspaces;

alter publication supabase_realtime add table workspace_users;

alter publication supabase_realtime add table projects;

alter publication supabase_realtime add table project_users;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_workspace_and_project(ws_id uuid, ws_name text, proj_id uuid, proj_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  -- Insert workspace
  insert into workspaces (id, name)
  values (ws_id, ws_name);

  -- Insert project
  insert into projects (id, workspace_id, name)
  values (proj_id, ws_id, proj_name);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_project_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into project_users (project_id, user_id, role)
  values (new.id, auth.uid(), 'admin');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_workspace_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into workspace_users (workspace_id, user_id, role)
  values (new.id, auth.uid(), 'owner');
  return new;
end;
$function$
;

grant delete on table "public"."project_users" to "anon";

grant insert on table "public"."project_users" to "anon";

grant references on table "public"."project_users" to "anon";

grant select on table "public"."project_users" to "anon";

grant trigger on table "public"."project_users" to "anon";

grant truncate on table "public"."project_users" to "anon";

grant update on table "public"."project_users" to "anon";

grant delete on table "public"."project_users" to "authenticated";

grant insert on table "public"."project_users" to "authenticated";

grant references on table "public"."project_users" to "authenticated";

grant select on table "public"."project_users" to "authenticated";

grant trigger on table "public"."project_users" to "authenticated";

grant truncate on table "public"."project_users" to "authenticated";

grant update on table "public"."project_users" to "authenticated";

grant delete on table "public"."project_users" to "service_role";

grant insert on table "public"."project_users" to "service_role";

grant references on table "public"."project_users" to "service_role";

grant select on table "public"."project_users" to "service_role";

grant trigger on table "public"."project_users" to "service_role";

grant truncate on table "public"."project_users" to "service_role";

grant update on table "public"."project_users" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."workspace_users" to "anon";

grant insert on table "public"."workspace_users" to "anon";

grant references on table "public"."workspace_users" to "anon";

grant select on table "public"."workspace_users" to "anon";

grant trigger on table "public"."workspace_users" to "anon";

grant truncate on table "public"."workspace_users" to "anon";

grant update on table "public"."workspace_users" to "anon";

grant delete on table "public"."workspace_users" to "authenticated";

grant insert on table "public"."workspace_users" to "authenticated";

grant references on table "public"."workspace_users" to "authenticated";

grant select on table "public"."workspace_users" to "authenticated";

grant trigger on table "public"."workspace_users" to "authenticated";

grant truncate on table "public"."workspace_users" to "authenticated";

grant update on table "public"."workspace_users" to "authenticated";

grant delete on table "public"."workspace_users" to "service_role";

grant insert on table "public"."workspace_users" to "service_role";

grant references on table "public"."workspace_users" to "service_role";

grant select on table "public"."workspace_users" to "service_role";

grant trigger on table "public"."workspace_users" to "service_role";

grant truncate on table "public"."workspace_users" to "service_role";

grant update on table "public"."workspace_users" to "service_role";

grant delete on table "public"."workspaces" to "anon";

grant insert on table "public"."workspaces" to "anon";

grant references on table "public"."workspaces" to "anon";

grant select on table "public"."workspaces" to "anon";

grant trigger on table "public"."workspaces" to "anon";

grant truncate on table "public"."workspaces" to "anon";

grant update on table "public"."workspaces" to "anon";

grant delete on table "public"."workspaces" to "authenticated";

grant insert on table "public"."workspaces" to "authenticated";

grant references on table "public"."workspaces" to "authenticated";

grant select on table "public"."workspaces" to "authenticated";

grant trigger on table "public"."workspaces" to "authenticated";

grant truncate on table "public"."workspaces" to "authenticated";

grant update on table "public"."workspaces" to "authenticated";

grant delete on table "public"."workspaces" to "service_role";

grant insert on table "public"."workspaces" to "service_role";

grant references on table "public"."workspaces" to "service_role";

grant select on table "public"."workspaces" to "service_role";

grant trigger on table "public"."workspaces" to "service_role";

grant truncate on table "public"."workspaces" to "service_role";

grant update on table "public"."workspaces" to "service_role";

create policy "Project admin can add project users"
on "public"."project_users"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM project_users pu2
  WHERE ((pu2.project_id = project_users.project_id) AND (pu2.user_id = auth.uid()) AND (pu2.role = 'admin'::project_role)))));


create policy "Project admin can delete project users"
on "public"."project_users"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM project_users pu2
  WHERE ((pu2.project_id = project_users.project_id) AND (pu2.user_id = auth.uid()) AND (pu2.role = 'admin'::project_role)))));


create policy "Project admin can update project users"
on "public"."project_users"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM project_users pu2
  WHERE ((pu2.project_id = project_users.project_id) AND (pu2.user_id = auth.uid()) AND (pu2.role = 'admin'::project_role)))));


create policy "Project members can view project users"
on "public"."project_users"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM project_users pu2
  WHERE ((pu2.project_id = project_users.project_id) AND (pu2.user_id = auth.uid())))));


create policy "Owner/Admin can create projects"
on "public"."projects"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = projects.workspace_id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Owner/Admin can delete projects"
on "public"."projects"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = projects.workspace_id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Owner/Admin can update projects"
on "public"."projects"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = projects.workspace_id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Workspace members can view projects"
on "public"."projects"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = projects.workspace_id) AND (workspace_users.user_id = auth.uid())))));


create policy "Owner can remove workspace users"
on "public"."workspace_users"
as permissive
for delete
to public
using (((EXISTS ( SELECT 1
   FROM workspace_users wu2
  WHERE ((wu2.workspace_id = workspace_users.workspace_id) AND (wu2.user_id = auth.uid()) AND (wu2.role = 'owner'::workspace_role)))) AND (role <> 'owner'::workspace_role)));


create policy "Owner/Admin can create workspace users"
on "public"."workspace_users"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM workspace_users wu2
  WHERE ((wu2.workspace_id = workspace_users.workspace_id) AND (wu2.user_id = auth.uid()) AND (wu2.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Owner/Admin can update workspace users"
on "public"."workspace_users"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users wu2
  WHERE ((wu2.workspace_id = workspace_users.workspace_id) AND (wu2.user_id = auth.uid()) AND (wu2.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Workspace members can view workspace users"
on "public"."workspace_users"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users wu2
  WHERE ((wu2.workspace_id = workspace_users.workspace_id) AND (wu2.user_id = auth.uid())))));


create policy "Authenticated users can create workspace"
on "public"."workspaces"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Owner can delete workspace"
on "public"."workspaces"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = workspaces.id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = 'owner'::workspace_role)))));


create policy "Owner/Admin can update workspace"
on "public"."workspaces"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = workspaces.id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Workspace members can view workspace"
on "public"."workspaces"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = workspaces.id) AND (workspace_users.user_id = auth.uid())))));


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.project_users FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER on_project_created AFTER INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_new_project_user();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.workspace_users FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER on_workspace_created AFTER INSERT ON public.workspaces FOR EACH ROW EXECUTE FUNCTION handle_new_workspace_user();


