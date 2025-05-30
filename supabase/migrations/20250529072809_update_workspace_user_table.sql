alter table "public"."workspace_users" add column "email" text;

alter table "public"."workspace_users" add column "token_expires_at" timestamp with time zone;

alter table "public"."workspace_users" alter column "user_id" drop not null;


