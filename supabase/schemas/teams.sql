-- Create the teams table
create table teams (
    id uuid default gen_random_uuid() primary key,
    workspace_id uuid references workspaces(id) on delete cascade not null,
    name text not null,
    logo_url text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table teams enable row level security;

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

-- Triggers for updated_at
create trigger handle_updated_at before update on teams
    for each row execute procedure moddatetime (updated_at);