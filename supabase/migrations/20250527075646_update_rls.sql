drop policy "Health checks can be created by authenticated users" on "public"."health_checks";

drop policy "Health checks can be deleted by creator" on "public"."health_checks";

drop policy "Health checks can be viewed by authenticated users" on "public"."health_checks";

drop policy "Responses can be created by authenticated users" on "public"."responses";

drop policy "Responses can be deleted by their creators" on "public"."responses";

drop policy "Responses can be updated by their creators" on "public"."responses";

drop policy "Responses can be viewed by authenticated users" on "public"."responses";

drop policy "Team admin can add team users" on "public"."team_users";

drop policy "Users can see their own team_users rows" on "public"."team_users";

drop policy "Owner can remove workspace users" on "public"."workspace_users";

drop policy "Users can see their own workspace_users rows" on "public"."workspace_users";

drop policy "Authenticated users can create workspace" on "public"."workspaces";

drop policy "Agreements can be created by authenticated users" on "public"."agreements";

drop policy "Agreements can be deleted by their creators" on "public"."agreements";

drop policy "Agreements can be updated by their creators" on "public"."agreements";

drop policy "Agreements can be viewed by authenticated users" on "public"."agreements";

drop policy "Issues can be created by authenticated users" on "public"."issues";

drop policy "Issues can be deleted by their creators" on "public"."issues";

drop policy "Issues can be updated by their creators" on "public"."issues";

drop policy "Issues can be viewed by authenticated users" on "public"."issues";

drop policy "Team admin can delete team users" on "public"."team_users";

drop policy "Team admin can update team users" on "public"."team_users";

drop policy "Owner/Admin can create teams" on "public"."teams";

drop policy "Owner/Admin can delete teams" on "public"."teams";

drop policy "Owner/Admin can update teams" on "public"."teams";

drop policy "Workspace members can view teams" on "public"."teams";

drop policy "Owner/Admin can create workspace users" on "public"."workspace_users";

drop policy "Owner/Admin can update workspace users" on "public"."workspace_users";

drop policy "Owner can delete workspace" on "public"."workspaces";

drop policy "Owner/Admin can update workspace" on "public"."workspaces";

drop policy "Workspace members can view workspace" on "public"."workspaces";

alter table "public"."agreements" add constraint "agreements_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."agreements" validate constraint "agreements_team_id_fkey";

alter table "public"."issues" add constraint "issues_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."issues" validate constraint "issues_team_id_fkey";

create policy "Team admin can create health checks"
on "public"."health_checks"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM team_users
  WHERE ((team_users.team_id = health_checks.team_id) AND (team_users.user_id = auth.uid()) AND (team_users.role = 'admin'::team_role)))));


create policy "Team admin can delete health checks"
on "public"."health_checks"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM team_users
  WHERE ((team_users.team_id = health_checks.team_id) AND (team_users.user_id = auth.uid()) AND (team_users.role = 'admin'::team_role)))));


create policy "Team members can view health checks"
on "public"."health_checks"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM team_users
  WHERE ((team_users.team_id = health_checks.team_id) AND (team_users.user_id = auth.uid())))));


create policy "Authors can delete their own responses"
on "public"."responses"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Authors can update their own responses"
on "public"."responses"
as permissive
for update
to authenticated
using ((user_id = auth.uid()));


create policy "Team members can create responses"
on "public"."responses"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (health_checks hc
     JOIN team_users tu ON ((tu.team_id = hc.team_id)))
  WHERE ((hc.id = responses.health_check_id) AND (tu.user_id = auth.uid())))));


create policy "Team members can view responses"
on "public"."responses"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (health_checks hc
     JOIN team_users tu ON ((tu.team_id = hc.team_id)))
  WHERE ((hc.id = responses.health_check_id) AND (tu.user_id = auth.uid())))));


create policy "Team admin can create team users"
on "public"."team_users"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM team_users tu2
  WHERE ((tu2.team_id = team_users.team_id) AND (tu2.user_id = auth.uid()) AND (tu2.role = 'admin'::team_role)))));


create policy "Workspace member can view team users"
on "public"."team_users"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (teams t
     JOIN workspace_users wu ON ((wu.workspace_id = t.workspace_id)))
  WHERE ((t.id = team_users.team_id) AND (wu.user_id = auth.uid())))));


create policy "Workspace owner/admin can delete team users"
on "public"."team_users"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (teams t
     JOIN workspace_users wu ON ((wu.workspace_id = t.workspace_id)))
  WHERE ((t.id = team_users.team_id) AND (wu.user_id = auth.uid()) AND (wu.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Workspace owner/admin can update team users"
on "public"."team_users"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (teams t
     JOIN workspace_users wu ON ((wu.workspace_id = t.workspace_id)))
  WHERE ((t.id = team_users.team_id) AND (wu.user_id = auth.uid()) AND (wu.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Workspace owner/admin create add team users"
on "public"."team_users"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (teams t
     JOIN workspace_users wu ON ((wu.workspace_id = t.workspace_id)))
  WHERE ((t.id = team_users.team_id) AND (wu.user_id = auth.uid()) AND (wu.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Only one owner per workspace allowed"
on "public"."workspace_users"
as restrictive
for insert
to authenticated
with check (((role <> 'owner'::workspace_role) OR (NOT (EXISTS ( SELECT 1
   FROM workspace_users wu2
  WHERE ((wu2.workspace_id = workspace_users.workspace_id) AND (wu2.role = 'owner'::workspace_role)))))));


create policy "Owner/Admin can remove workspace users"
on "public"."workspace_users"
as permissive
for delete
to public
using (((EXISTS ( SELECT 1
   FROM workspace_users wu2
  WHERE ((wu2.workspace_id = workspace_users.workspace_id) AND (wu2.user_id = auth.uid()) AND (wu2.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))) AND (role <> 'owner'::workspace_role)));


create policy "Users can see other users in their workspace"
on "public"."workspace_users"
as permissive
for select
to authenticated
using (true);


create policy "Authenticated users can create workspaces"
on "public"."workspaces"
as permissive
for insert
to authenticated
with check (true);


create policy "Agreements can be created by authenticated users"
on "public"."agreements"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM team_users tu
  WHERE ((tu.team_id = agreements.team_id) AND (tu.user_id = auth.uid())))));


create policy "Agreements can be deleted by their creators"
on "public"."agreements"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM team_users tu
  WHERE ((tu.team_id = agreements.team_id) AND (tu.user_id = auth.uid())))));


create policy "Agreements can be updated by their creators"
on "public"."agreements"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM team_users tu
  WHERE ((tu.team_id = agreements.team_id) AND (tu.user_id = auth.uid())))));


create policy "Agreements can be viewed by authenticated users"
on "public"."agreements"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM team_users tu
  WHERE ((tu.team_id = agreements.team_id) AND (tu.user_id = auth.uid())))));


create policy "Issues can be created by authenticated users"
on "public"."issues"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM team_users tu
  WHERE ((tu.team_id = issues.team_id) AND (tu.user_id = auth.uid())))));


create policy "Issues can be deleted by their creators"
on "public"."issues"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM team_users tu
  WHERE ((tu.team_id = issues.team_id) AND (tu.user_id = auth.uid())))));


create policy "Issues can be updated by their creators"
on "public"."issues"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM team_users tu
  WHERE ((tu.team_id = issues.team_id) AND (tu.user_id = auth.uid())))));


create policy "Issues can be viewed by authenticated users"
on "public"."issues"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM team_users tu
  WHERE ((tu.team_id = issues.team_id) AND (tu.user_id = auth.uid())))));


create policy "Team admin can delete team users"
on "public"."team_users"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM team_users tu2
  WHERE ((tu2.team_id = team_users.team_id) AND (tu2.user_id = auth.uid()) AND (tu2.role = 'admin'::team_role)))));


create policy "Team admin can update team users"
on "public"."team_users"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM team_users tu2
  WHERE ((tu2.team_id = team_users.team_id) AND (tu2.user_id = auth.uid()) AND (tu2.role = 'admin'::team_role)))));


create policy "Owner/Admin can create teams"
on "public"."teams"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = teams.workspace_id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Owner/Admin can delete teams"
on "public"."teams"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = teams.workspace_id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Owner/Admin can update teams"
on "public"."teams"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = teams.workspace_id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Workspace members can view teams"
on "public"."teams"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = teams.workspace_id) AND (workspace_users.user_id = auth.uid())))));


create policy "Owner/Admin can create workspace users"
on "public"."workspace_users"
as restrictive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM workspace_users wu2
  WHERE ((wu2.workspace_id = workspace_users.workspace_id) AND (wu2.user_id = auth.uid()) AND (wu2.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Owner/Admin can update workspace users"
on "public"."workspace_users"
as permissive
for update
to authenticated
using (((EXISTS ( SELECT 1
   FROM workspace_users wu2
  WHERE ((wu2.workspace_id = workspace_users.workspace_id) AND (wu2.user_id = auth.uid()) AND (wu2.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))) AND (role <> 'owner'::workspace_role)));


create policy "Owner can delete workspace"
on "public"."workspaces"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = workspaces.id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = 'owner'::workspace_role)))));


create policy "Owner/Admin can update workspace"
on "public"."workspaces"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = workspaces.id) AND (workspace_users.user_id = auth.uid()) AND (workspace_users.role = ANY (ARRAY['owner'::workspace_role, 'admin'::workspace_role]))))));


create policy "Workspace members can view workspace"
on "public"."workspaces"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM workspace_users
  WHERE ((workspace_users.workspace_id = workspaces.id) AND (workspace_users.user_id = auth.uid())))));



