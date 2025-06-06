create policy "Workspace owner/admin can view health checks"
on "public"."health_checks"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (teams
     JOIN workspace_users ON ((workspace_users.workspace_id = teams.workspace_id)))
  WHERE ((teams.id = health_checks.team_id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));



