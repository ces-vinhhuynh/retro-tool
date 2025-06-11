drop policy "Templates are viewable by authenticated users" on "public"."health_check_templates";

create policy "Standard templates are viewable by all authenticated users, cus"
on "public"."health_check_templates"
as permissive
for select
to authenticated
using (((auth.uid() IS NOT NULL) AND ((is_custom = false) OR ((is_custom = true) AND (EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = ( SELECT teams.workspace_id
           FROM teams
          WHERE (teams.id = health_check_templates.team_id))) AND (workspace_users.user_id = auth.uid()))))))));


create policy "Workspace owners/admins and team admins can create templates"
on "public"."health_check_templates"
as permissive
for insert
to authenticated
with check (((auth.uid() IS NOT NULL) AND ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = ( SELECT teams.workspace_id
           FROM teams
          WHERE (teams.id = health_check_templates.team_id))) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))) OR (EXISTS ( SELECT 1
   FROM team_users
  WHERE ((team_users.team_id = health_check_templates.team_id) AND (team_users.user_id = auth.uid()) AND (team_users.role = 'admin'::team_role)))))));


create policy "Workspace owners/admins and team admins can update their own cu"
on "public"."health_check_templates"
as permissive
for update
to authenticated
using (((auth.uid() IS NOT NULL) AND (is_custom = true) AND ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = ( SELECT teams.workspace_id
           FROM teams
          WHERE (teams.id = health_check_templates.team_id))) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))) OR (EXISTS ( SELECT 1
   FROM team_users
  WHERE ((team_users.team_id = health_check_templates.team_id) AND (team_users.user_id = auth.uid()) AND (team_users.role = 'admin'::team_role)))))));



