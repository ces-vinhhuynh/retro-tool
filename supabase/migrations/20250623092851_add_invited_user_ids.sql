alter table "public"."health_checks" add column "invited_user_ids" jsonb default '[]'::jsonb;


