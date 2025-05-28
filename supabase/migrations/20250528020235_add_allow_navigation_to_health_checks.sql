alter table "public"."health_checks" add column "current_group_index" integer default 0;

alter table "public"."health_checks" add column "current_question_index" integer default 0;

alter table "public"."health_checks" alter column "settings" set default '{"display_mode": "grouped", "allow_participant_navigation": true}'::jsonb;

alter table "public"."health_checks" add constraint "valid_allow_navigation" CHECK (((settings ->> 'allow_participant_navigation'::text) = ANY (ARRAY['true'::text, 'false'::text]))) not valid;

alter table "public"."health_checks" validate constraint "valid_allow_navigation";


