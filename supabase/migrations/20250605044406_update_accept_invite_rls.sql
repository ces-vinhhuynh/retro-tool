create policy "Invited user can accept team invite"
on "public"."team_users"
as permissive
for update
to authenticated
using (true);


create policy "Invited user can accept workspace invite"
on "public"."workspace_users"
as permissive
for update
to authenticated
using (true);



