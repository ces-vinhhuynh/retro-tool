create extension if not exists "moddatetime" with schema "extensions";


create type "public"."action_item_priority" as enum ('high', 'medium', 'low');

create type "public"."action_item_status" as enum ('todo', 'in_progress', 'done');

create type "public"."health_check_status" as enum ('in progress', 'done');

create table "public"."action_items" (
    "id" uuid not null default gen_random_uuid(),
    "health_check_id" uuid not null,
    "team_id" uuid,
    "question_id" uuid not null,
    "title" text not null,
    "description" text,
    "status" action_item_status default 'todo'::action_item_status,
    "priority" action_item_priority,
    "assigned_to" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."action_items" enable row level security;

create table "public"."health_check_templates" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "type" text,
    "team_id" uuid,
    "min_value" integer not null,
    "max_value" integer not null,
    "questions" jsonb not null,
    "is_custom" boolean default false,
    "original_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."health_check_templates" enable row level security;

create table "public"."health_checks" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "facilitator_id" uuid,
    "team_id" uuid,
    "current_step" integer default 1,
    "template_id" uuid,
    "status" health_check_status default 'in progress'::health_check_status,
    "average_score" jsonb default '{}'::jsonb,
    "participants" jsonb default '[]'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."health_checks" enable row level security;

create table "public"."responses" (
    "id" uuid not null default gen_random_uuid(),
    "health_check_id" uuid not null,
    "user_id" uuid not null,
    "answers" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."responses" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "email" text,
    "full_name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone default timezone('utc'::text, now())
);


CREATE UNIQUE INDEX action_items_pkey ON public.action_items USING btree (id);

CREATE UNIQUE INDEX health_check_templates_pkey ON public.health_check_templates USING btree (id);

CREATE UNIQUE INDEX health_checks_pkey ON public.health_checks USING btree (id);

CREATE UNIQUE INDEX responses_health_check_id_user_id_key ON public.responses USING btree (health_check_id, user_id);

CREATE UNIQUE INDEX responses_pkey ON public.responses USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."action_items" add constraint "action_items_pkey" PRIMARY KEY using index "action_items_pkey";

alter table "public"."health_check_templates" add constraint "health_check_templates_pkey" PRIMARY KEY using index "health_check_templates_pkey";

alter table "public"."health_checks" add constraint "health_checks_pkey" PRIMARY KEY using index "health_checks_pkey";

alter table "public"."responses" add constraint "responses_pkey" PRIMARY KEY using index "responses_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."action_items" add constraint "action_items_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL not valid;

alter table "public"."action_items" validate constraint "action_items_assigned_to_fkey";

alter table "public"."action_items" add constraint "action_items_health_check_id_fkey" FOREIGN KEY (health_check_id) REFERENCES health_checks(id) ON DELETE CASCADE not valid;

alter table "public"."action_items" validate constraint "action_items_health_check_id_fkey";

alter table "public"."health_checks" add constraint "health_checks_facilitator_id_fkey" FOREIGN KEY (facilitator_id) REFERENCES users(id) ON DELETE SET NULL not valid;

alter table "public"."health_checks" validate constraint "health_checks_facilitator_id_fkey";

alter table "public"."health_checks" add constraint "health_checks_template_id_fkey" FOREIGN KEY (template_id) REFERENCES health_check_templates(id) ON DELETE SET NULL not valid;

alter table "public"."health_checks" validate constraint "health_checks_template_id_fkey";

alter table "public"."responses" add constraint "responses_health_check_id_fkey" FOREIGN KEY (health_check_id) REFERENCES health_checks(id) ON DELETE CASCADE not valid;

alter table "public"."responses" validate constraint "responses_health_check_id_fkey";

alter table "public"."responses" add constraint "responses_health_check_id_user_id_key" UNIQUE using index "responses_health_check_id_user_id_key";

alter table "public"."responses" add constraint "responses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."responses" validate constraint "responses_user_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        avatar_url = excluded.avatar_url;
  return new;
end;
$function$
;

grant delete on table "public"."action_items" to "anon";

grant insert on table "public"."action_items" to "anon";

grant references on table "public"."action_items" to "anon";

grant select on table "public"."action_items" to "anon";

grant trigger on table "public"."action_items" to "anon";

grant truncate on table "public"."action_items" to "anon";

grant update on table "public"."action_items" to "anon";

grant delete on table "public"."action_items" to "authenticated";

grant insert on table "public"."action_items" to "authenticated";

grant references on table "public"."action_items" to "authenticated";

grant select on table "public"."action_items" to "authenticated";

grant trigger on table "public"."action_items" to "authenticated";

grant truncate on table "public"."action_items" to "authenticated";

grant update on table "public"."action_items" to "authenticated";

grant delete on table "public"."action_items" to "service_role";

grant insert on table "public"."action_items" to "service_role";

grant references on table "public"."action_items" to "service_role";

grant select on table "public"."action_items" to "service_role";

grant trigger on table "public"."action_items" to "service_role";

grant truncate on table "public"."action_items" to "service_role";

grant update on table "public"."action_items" to "service_role";

grant delete on table "public"."health_check_templates" to "anon";

grant insert on table "public"."health_check_templates" to "anon";

grant references on table "public"."health_check_templates" to "anon";

grant select on table "public"."health_check_templates" to "anon";

grant trigger on table "public"."health_check_templates" to "anon";

grant truncate on table "public"."health_check_templates" to "anon";

grant update on table "public"."health_check_templates" to "anon";

grant delete on table "public"."health_check_templates" to "authenticated";

grant insert on table "public"."health_check_templates" to "authenticated";

grant references on table "public"."health_check_templates" to "authenticated";

grant select on table "public"."health_check_templates" to "authenticated";

grant trigger on table "public"."health_check_templates" to "authenticated";

grant truncate on table "public"."health_check_templates" to "authenticated";

grant update on table "public"."health_check_templates" to "authenticated";

grant delete on table "public"."health_check_templates" to "service_role";

grant insert on table "public"."health_check_templates" to "service_role";

grant references on table "public"."health_check_templates" to "service_role";

grant select on table "public"."health_check_templates" to "service_role";

grant trigger on table "public"."health_check_templates" to "service_role";

grant truncate on table "public"."health_check_templates" to "service_role";

grant update on table "public"."health_check_templates" to "service_role";

grant delete on table "public"."health_checks" to "anon";

grant insert on table "public"."health_checks" to "anon";

grant references on table "public"."health_checks" to "anon";

grant select on table "public"."health_checks" to "anon";

grant trigger on table "public"."health_checks" to "anon";

grant truncate on table "public"."health_checks" to "anon";

grant update on table "public"."health_checks" to "anon";

grant delete on table "public"."health_checks" to "authenticated";

grant insert on table "public"."health_checks" to "authenticated";

grant references on table "public"."health_checks" to "authenticated";

grant select on table "public"."health_checks" to "authenticated";

grant trigger on table "public"."health_checks" to "authenticated";

grant truncate on table "public"."health_checks" to "authenticated";

grant update on table "public"."health_checks" to "authenticated";

grant delete on table "public"."health_checks" to "service_role";

grant insert on table "public"."health_checks" to "service_role";

grant references on table "public"."health_checks" to "service_role";

grant select on table "public"."health_checks" to "service_role";

grant trigger on table "public"."health_checks" to "service_role";

grant truncate on table "public"."health_checks" to "service_role";

grant update on table "public"."health_checks" to "service_role";

grant delete on table "public"."responses" to "anon";

grant insert on table "public"."responses" to "anon";

grant references on table "public"."responses" to "anon";

grant select on table "public"."responses" to "anon";

grant trigger on table "public"."responses" to "anon";

grant truncate on table "public"."responses" to "anon";

grant update on table "public"."responses" to "anon";

grant delete on table "public"."responses" to "authenticated";

grant insert on table "public"."responses" to "authenticated";

grant references on table "public"."responses" to "authenticated";

grant select on table "public"."responses" to "authenticated";

grant trigger on table "public"."responses" to "authenticated";

grant truncate on table "public"."responses" to "authenticated";

grant update on table "public"."responses" to "authenticated";

grant delete on table "public"."responses" to "service_role";

grant insert on table "public"."responses" to "service_role";

grant references on table "public"."responses" to "service_role";

grant select on table "public"."responses" to "service_role";

grant trigger on table "public"."responses" to "service_role";

grant truncate on table "public"."responses" to "service_role";

grant update on table "public"."responses" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

alter publication supabase_realtime add table action_items;

alter publication supabase_realtime add table health_check_templates;

alter publication supabase_realtime add table health_checks;

alter publication supabase_realtime add table responses;

alter publication supabase_realtime add table users;

create policy "Actions can be created by authenticated users"
on "public"."action_items"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Actions can be deleted by their creators"
on "public"."action_items"
as permissive
for delete
to public
using ((auth.uid() IS NOT NULL));


create policy "Actions can be updated by their creators"
on "public"."action_items"
as permissive
for update
to public
using ((auth.uid() IS NOT NULL));


create policy "Actions can be viewed by authenticated users"
on "public"."action_items"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "Templates are viewable by authenticated users"
on "public"."health_check_templates"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "Health checks can be created by authenticated users"
on "public"."health_checks"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Health checks can be deleted by creator"
on "public"."health_checks"
as permissive
for delete
to public
using ((auth.uid() = facilitator_id));


create policy "Health checks can be updated by creator"
on "public"."health_checks"
as permissive
for update
to public
using ((auth.uid() = facilitator_id));


create policy "Health checks can be viewed by authenticated users"
on "public"."health_checks"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "Responses can be created by authenticated users"
on "public"."responses"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Responses can be deleted by their creators"
on "public"."responses"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Responses can be updated by their creators"
on "public"."responses"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Responses can be viewed by authenticated users"
on "public"."responses"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.action_items FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.health_check_templates FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.health_checks FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.responses FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();