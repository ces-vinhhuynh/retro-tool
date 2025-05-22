alter table "public"."action_items" drop constraint "action_items_assigned_to_fkey";

create table "public"."action_item_assignees" (
    "id" uuid not null default gen_random_uuid(),
    "action_item_id" uuid,
    "team_user_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."action_item_assignees" enable row level security;

alter table "public"."action_items" drop column "assigned_to";

CREATE UNIQUE INDEX action_item_assignees_action_item_id_team_user_id_key ON public.action_item_assignees USING btree (action_item_id, team_user_id);

CREATE UNIQUE INDEX action_item_assignees_pkey ON public.action_item_assignees USING btree (id);

CREATE INDEX idx_action_item_assignees_action_item_id ON public.action_item_assignees USING btree (action_item_id);

CREATE INDEX idx_action_item_assignees_team_user_id ON public.action_item_assignees USING btree (team_user_id);

alter table "public"."action_item_assignees" add constraint "action_item_assignees_pkey" PRIMARY KEY using index "action_item_assignees_pkey";

alter table "public"."action_item_assignees" add constraint "action_item_assignees_action_item_id_fkey" FOREIGN KEY (action_item_id) REFERENCES action_items(id) ON DELETE CASCADE not valid;

alter table "public"."action_item_assignees" validate constraint "action_item_assignees_action_item_id_fkey";

alter table "public"."action_item_assignees" add constraint "action_item_assignees_action_item_id_team_user_id_key" UNIQUE using index "action_item_assignees_action_item_id_team_user_id_key";

alter table "public"."action_item_assignees" add constraint "action_item_assignees_team_user_id_fkey" FOREIGN KEY (team_user_id) REFERENCES team_users(id) ON DELETE CASCADE not valid;

alter table "public"."action_item_assignees" validate constraint "action_item_assignees_team_user_id_fkey";

grant delete on table "public"."action_item_assignees" to "anon";

grant insert on table "public"."action_item_assignees" to "anon";

grant references on table "public"."action_item_assignees" to "anon";

grant select on table "public"."action_item_assignees" to "anon";

grant trigger on table "public"."action_item_assignees" to "anon";

grant truncate on table "public"."action_item_assignees" to "anon";

grant update on table "public"."action_item_assignees" to "anon";

grant delete on table "public"."action_item_assignees" to "authenticated";

grant insert on table "public"."action_item_assignees" to "authenticated";

grant references on table "public"."action_item_assignees" to "authenticated";

grant select on table "public"."action_item_assignees" to "authenticated";

grant trigger on table "public"."action_item_assignees" to "authenticated";

grant truncate on table "public"."action_item_assignees" to "authenticated";

grant update on table "public"."action_item_assignees" to "authenticated";

grant delete on table "public"."action_item_assignees" to "service_role";

grant insert on table "public"."action_item_assignees" to "service_role";

grant references on table "public"."action_item_assignees" to "service_role";

grant select on table "public"."action_item_assignees" to "service_role";

grant trigger on table "public"."action_item_assignees" to "service_role";

grant truncate on table "public"."action_item_assignees" to "service_role";

grant update on table "public"."action_item_assignees" to "service_role";

create policy "Team members can create assignments"
on "public"."action_item_assignees"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM (action_items ai
     JOIN team_users tu ON ((tu.team_id = ai.team_id)))
  WHERE ((ai.id = action_item_assignees.action_item_id) AND (tu.user_id = auth.uid())))));


create policy "Team members can delete assignments"
on "public"."action_item_assignees"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM (action_items ai
     JOIN team_users tu ON ((tu.team_id = ai.team_id)))
  WHERE ((ai.id = action_item_assignees.action_item_id) AND (tu.user_id = auth.uid())))));


create policy "Team members can update assignments"
on "public"."action_item_assignees"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM (action_items ai
     JOIN team_users tu ON ((tu.team_id = ai.team_id)))
  WHERE ((ai.id = action_item_assignees.action_item_id) AND (tu.user_id = auth.uid())))));


create policy "Team members can view action item assignees"
on "public"."action_item_assignees"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (action_items ai
     JOIN team_users tu ON ((tu.team_id = ai.team_id)))
  WHERE ((ai.id = action_item_assignees.action_item_id) AND (tu.user_id = auth.uid())))));

alter publication supabase_realtime add table action_item_assignees;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.action_item_assignees FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


