create type "public"."team_user_status" as enum ('pending', 'accepted', 'expired');

alter table "public"."team_users" add column "email" text;

alter table "public"."team_users" add column "status" team_user_status default 'pending'::team_user_status;

alter table "public"."team_users" add column "token" text;

alter table "public"."team_users" add column "token_expires_at" timestamp with time zone;

alter table "public"."team_users" alter column "user_id" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_team_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into team_users (team_id, user_id, role, status)
  values (new.id, auth.uid(), 'admin', 'accepted');
  return new;
end;
$function$
;


