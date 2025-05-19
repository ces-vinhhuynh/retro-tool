drop policy "Users can see their own workspace_users rows" on "public"."workspace_users";

create policy "Users can see their own workspace_users rows"
on "public"."workspace_users"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));



