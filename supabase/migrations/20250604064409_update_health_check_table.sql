drop policy "Health checks can be updated by creator" on "public"."health_checks";

alter table "public"."health_checks" drop constraint "health_checks_facilitator_id_fkey";

alter table "public"."health_checks" drop column "facilitator_id";

alter table "public"."health_checks" add column "facilitator_ids" uuid[] default '{}'::uuid[];

create policy "Facilitators can update health checks"
on "public"."health_checks"
as permissive
for update
to authenticated
using ((auth.uid() = ANY (facilitator_ids)))
with check (true);



