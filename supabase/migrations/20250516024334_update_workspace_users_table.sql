create type "public"."project_user_status" as enum ('pending', 'accepted', 'expired');

drop policy "Owner/Admin can update workspace users" on "public"."workspace_users";

alter table "public"."users" enable row level security;

alter table "public"."workspace_users" add column "status" project_user_status default 'pending'::project_user_status;

alter table "public"."workspace_users" add column "token" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_workspace_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into workspace_users (workspace_id, user_id, role, status)
  values (new.id, auth.uid(), 'owner', 'accepted');
  return new;
end;
$function$
;

create policy "Authenticated users can view other users' details"
on "public"."users"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "Owner/Admin can update workspace users"
on "public"."workspace_users"
as permissive
for update
to public
using ((auth.uid() IS NOT NULL));



