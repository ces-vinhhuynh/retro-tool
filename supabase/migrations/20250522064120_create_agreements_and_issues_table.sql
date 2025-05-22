create extension if not exists "pgjwt" with schema "extensions";


create table "public"."agreements" (
    "id" uuid not null default gen_random_uuid(),
    "health_check_id" uuid,
    "team_id" uuid,
    "title" text not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."agreements" enable row level security;

create table "public"."issues" (
    "id" uuid not null default gen_random_uuid(),
    "health_check_id" uuid,
    "team_id" uuid,
    "title" text not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."issues" enable row level security;

CREATE UNIQUE INDEX agreements_pkey ON public.agreements USING btree (id);

CREATE UNIQUE INDEX issues_pkey ON public.issues USING btree (id);

alter table "public"."agreements" add constraint "agreements_pkey" PRIMARY KEY using index "agreements_pkey";

alter table "public"."issues" add constraint "issues_pkey" PRIMARY KEY using index "issues_pkey";

alter table "public"."agreements" add constraint "agreements_health_check_id_fkey" FOREIGN KEY (health_check_id) REFERENCES health_checks(id) ON DELETE CASCADE not valid;

alter table "public"."agreements" validate constraint "agreements_health_check_id_fkey";

alter table "public"."issues" add constraint "issues_health_check_id_fkey" FOREIGN KEY (health_check_id) REFERENCES health_checks(id) ON DELETE CASCADE not valid;

alter table "public"."issues" validate constraint "issues_health_check_id_fkey";

grant delete on table "public"."agreements" to "anon";

grant insert on table "public"."agreements" to "anon";

grant references on table "public"."agreements" to "anon";

grant select on table "public"."agreements" to "anon";

grant trigger on table "public"."agreements" to "anon";

grant truncate on table "public"."agreements" to "anon";

grant update on table "public"."agreements" to "anon";

grant delete on table "public"."agreements" to "authenticated";

grant insert on table "public"."agreements" to "authenticated";

grant references on table "public"."agreements" to "authenticated";

grant select on table "public"."agreements" to "authenticated";

grant trigger on table "public"."agreements" to "authenticated";

grant truncate on table "public"."agreements" to "authenticated";

grant update on table "public"."agreements" to "authenticated";

grant delete on table "public"."agreements" to "service_role";

grant insert on table "public"."agreements" to "service_role";

grant references on table "public"."agreements" to "service_role";

grant select on table "public"."agreements" to "service_role";

grant trigger on table "public"."agreements" to "service_role";

grant truncate on table "public"."agreements" to "service_role";

grant update on table "public"."agreements" to "service_role";

grant delete on table "public"."issues" to "anon";

grant insert on table "public"."issues" to "anon";

grant references on table "public"."issues" to "anon";

grant select on table "public"."issues" to "anon";

grant trigger on table "public"."issues" to "anon";

grant truncate on table "public"."issues" to "anon";

grant update on table "public"."issues" to "anon";

grant delete on table "public"."issues" to "authenticated";

grant insert on table "public"."issues" to "authenticated";

grant references on table "public"."issues" to "authenticated";

grant select on table "public"."issues" to "authenticated";

grant trigger on table "public"."issues" to "authenticated";

grant truncate on table "public"."issues" to "authenticated";

grant update on table "public"."issues" to "authenticated";

grant delete on table "public"."issues" to "service_role";

grant insert on table "public"."issues" to "service_role";

grant references on table "public"."issues" to "service_role";

grant select on table "public"."issues" to "service_role";

grant trigger on table "public"."issues" to "service_role";

grant truncate on table "public"."issues" to "service_role";

grant update on table "public"."issues" to "service_role";

create policy "Agreements can be created by authenticated users"
on "public"."agreements"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Agreements can be deleted by their creators"
on "public"."agreements"
as permissive
for delete
to public
using ((auth.uid() IS NOT NULL));


create policy "Agreements can be updated by their creators"
on "public"."agreements"
as permissive
for update
to public
using ((auth.uid() IS NOT NULL));


create policy "Agreements can be viewed by authenticated users"
on "public"."agreements"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "Issues can be created by authenticated users"
on "public"."issues"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Issues can be deleted by their creators"
on "public"."issues"
as permissive
for delete
to public
using ((auth.uid() IS NOT NULL));


create policy "Issues can be updated by their creators"
on "public"."issues"
as permissive
for update
to public
using ((auth.uid() IS NOT NULL));


create policy "Issues can be viewed by authenticated users"
on "public"."issues"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.agreements FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


alter publication supabase_realtime add table issues;

alter publication supabase_realtime add table agreements;