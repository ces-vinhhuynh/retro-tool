-- Policies
create policy "Owner/Admin can create teams"
on teams
for insert
to authenticated
with check (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = teams.workspace_id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role in ('owner', 'admin')
  )
);

create policy "Workspace members can view teams"
on teams
for select
to authenticated
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = teams.workspace_id
      and workspace_users.user_id = auth.uid()
  )
);

create policy "Team admin can update teams"
on teams
for update
to authenticated
using (
  exists (
    select 1 from team_users tu2
    where tu2.team_id = teams.id
      and tu2.user_id = auth.uid()
      and tu2.role = 'admin'
  )
);

create policy "Owner/Admin can update teams"
on teams
for update
to authenticated
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = teams.workspace_id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role in ('owner', 'admin')
  )
);

create policy "Team admin can delete teams"
on teams
for delete
to authenticated
using (
  exists (
    select 1 from team_users tu2
    where tu2.team_id = teams.id
      and tu2.user_id = auth.uid()
      and tu2.role = 'admin'
  )
);

create policy "Owner/Admin can delete teams"
on teams
for delete
to authenticated
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = teams.workspace_id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role in ('owner', 'admin')
  )
);