-- Policies
create policy "Authenticated users can create workspaces"
on workspaces
for insert
to authenticated
with check (true);

create policy "Workspace members can view workspace"
on workspaces
for select
to authenticated
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = workspaces.id
      and workspace_users.user_id = auth.uid()
  )
);

create policy "Owner/Admin can update workspace"
on workspaces
for update
to authenticated
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = workspaces.id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role in ('owner', 'admin')
  )
);

create policy "Owner can delete workspace"
on workspaces
for delete
to authenticated
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = workspaces.id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role = 'owner'
  )
);