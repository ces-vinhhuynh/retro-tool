create table "public"."participants" (
    "health_check_id" uuid not null,
    "user_id" uuid not null,
    "progress" integer default 0,
    "last_active" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."participants" enable row level security;

CREATE UNIQUE INDEX participants_pkey ON public.participants USING btree (health_check_id, user_id);

alter table "public"."participants" add constraint "participants_pkey" PRIMARY KEY using index "participants_pkey";

alter table "public"."participants" add constraint "participants_health_check_id_fkey" FOREIGN KEY (health_check_id) REFERENCES health_checks(id) ON DELETE CASCADE not valid;

alter table "public"."participants" validate constraint "participants_health_check_id_fkey";

alter table "public"."participants" add constraint "participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."participants" validate constraint "participants_user_id_fkey";

grant delete on table "public"."participants" to "anon";

grant insert on table "public"."participants" to "anon";

grant references on table "public"."participants" to "anon";

grant select on table "public"."participants" to "anon";

grant trigger on table "public"."participants" to "anon";

grant truncate on table "public"."participants" to "anon";

grant update on table "public"."participants" to "anon";

grant delete on table "public"."participants" to "authenticated";

grant insert on table "public"."participants" to "authenticated";

grant references on table "public"."participants" to "authenticated";

grant select on table "public"."participants" to "authenticated";

grant trigger on table "public"."participants" to "authenticated";

grant truncate on table "public"."participants" to "authenticated";

grant update on table "public"."participants" to "authenticated";

grant delete on table "public"."participants" to "service_role";

grant insert on table "public"."participants" to "service_role";

grant references on table "public"."participants" to "service_role";

grant select on table "public"."participants" to "service_role";

grant trigger on table "public"."participants" to "service_role";

grant truncate on table "public"."participants" to "service_role";

grant update on table "public"."participants" to "service_role";

create policy "Participants can be created by authenticated users"
on "public"."participants"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Participants can delete their own records"
on "public"."participants"
as permissive
for delete
to public
using ((auth.uid() IS NOT NULL));


create policy "Participants can update their own records"
on "public"."participants"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Participants can view their own records"
on "public"."participants"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.participants FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

alter publication supabase_realtime add table participants;