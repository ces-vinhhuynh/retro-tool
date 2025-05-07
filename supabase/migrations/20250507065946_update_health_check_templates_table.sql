alter table "public"."health_check_templates" alter column "max_value" set data type jsonb using to_jsonb(max_value);

alter table "public"."health_check_templates" alter column "min_value" set data type jsonb using to_jsonb(min_value);


