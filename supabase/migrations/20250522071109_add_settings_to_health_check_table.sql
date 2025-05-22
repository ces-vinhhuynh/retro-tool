alter table "public"."health_checks" add column "settings" jsonb default '{"display_mode": "grouped"}'::jsonb;

alter table "public"."health_checks" add constraint "valid_display_mode" CHECK (((settings ->> 'display_mode'::text) = ANY (ARRAY['single'::text, 'grouped'::text, 'all'::text]))) not valid;

alter table "public"."health_checks" validate constraint "valid_display_mode";


