drop policy "Workspace member can view team users" on "public"."team_users";

create policy "Team admin can delete teams"
on "public"."teams"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM team_users tu2
  WHERE ((tu2.team_id = teams.id) AND (tu2.user_id = auth.uid()) AND (tu2.role = 'admin'::team_role)))));


create policy "Team admin can update teams"
on "public"."teams"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM team_users tu2
  WHERE ((tu2.team_id = teams.id) AND (tu2.user_id = auth.uid()) AND (tu2.role = 'admin'::team_role)))));


create policy "Workspace member can view team users"
on "public"."team_users"
as permissive
for select
to authenticated
using (true);



