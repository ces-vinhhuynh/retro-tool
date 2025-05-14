-- Only workspace members can view the workspace
create policy "Workspace members can view workspace"
on workspaces for select
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = workspaces.id
      and workspace_users.user_id = auth.uid()
  )
);

-- Only owner/admin can update workspace
create policy "Owner/Admin can update workspace"
on workspaces for update
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = workspaces.id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role in ('owner', 'admin')
  )
);

-- Only owner can delete workspace
create policy "Owner can delete workspace"
on workspaces for delete
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = workspaces.id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role = 'owner'
  )
);

-- Only authenticated users can create workspace (become owner)
create policy "Authenticated users can create workspace"
on workspaces for insert
with check (auth.uid() is not null);