alter table "public"."action_items" alter column "status" drop default;

alter type "public"."action_item_status" rename to "action_item_status__old_version_to_be_dropped";

create type "public"."action_item_status" as enum ('todo', 'in_progress', 'done', 'blocked');

alter table "public"."action_items" alter column status type "public"."action_item_status" using status::text::"public"."action_item_status";

alter table "public"."action_items" alter column "status" set default 'todo'::action_item_status;

drop type "public"."action_item_status__old_version_to_be_dropped";

alter table "public"."action_items" add column "due_date" timestamp with time zone;

alter table "public"."action_items" alter column "question_id" drop not null;

ALTER TABLE action_items REPLICA IDENTITY FULL;

