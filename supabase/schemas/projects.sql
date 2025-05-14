create table projects (
    id uuid default gen_random_uuid() primary key,
    workspace_id uuid references workspaces(id) on delete cascade not null,
    name text not null,
    logo_url text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table projects enable row level security;

-- Workspace members can view projects
create policy "Workspace members can view projects"
on projects for select
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = projects.workspace_id
      and workspace_users.user_id = auth.uid()
  )
);

-- Only owner/admin can create projects
create policy "Owner/Admin can create projects"
on projects for insert
with check (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = projects.workspace_id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role in ('owner', 'admin')
  )
);

-- Only owner/admin can update projects
create policy "Owner/Admin can update projects"
on projects for update
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = projects.workspace_id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role in ('owner', 'admin')
  )
);

-- Only owner/admin can delete projects
create policy "Owner/Admin can delete projects"
on projects for delete
using (
  exists (
    select 1 from workspace_users
    where workspace_users.workspace_id = projects.workspace_id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role in ('owner', 'admin')
  )
);


-- Triggers for updated_at
create trigger handle_updated_at before update on projects
    for each row execute procedure moddatetime (updated_at);