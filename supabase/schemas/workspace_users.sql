create type workspace_role as enum ('owner', 'admin', 'member');
create type project_user_status as enum ('pending', 'accepted', 'expired');

-- Create the workspace_users table
create table workspace_users (
    id uuid default gen_random_uuid() primary key,
    workspace_id uuid references workspaces(id) on delete cascade not null,
    user_id uuid references users(id) on delete cascade not null,
    role workspace_role,
    token text,
    status project_user_status default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (workspace_id, user_id)
);

-- Enable RLS
alter table workspace_users enable row level security;

-- Policies
create policy "Owner/Admin can create workspace users"
on workspace_users
as restrictive
for insert
to authenticated
with check (
  exists (
    select 1 from workspace_users wu2
    where wu2.workspace_id = workspace_users.workspace_id
      and wu2.user_id = auth.uid()
      and wu2.role in ('owner', 'admin')
  )
);

create policy "Only one owner per workspace allowed"
on workspace_users
as restrictive
for insert
to authenticated
with check (
  workspace_users.role != 'owner'
  OR NOT EXISTS (
    select 1 from workspace_users wu2
    where wu2.workspace_id = workspace_users.workspace_id
      and wu2.role = 'owner'
  )
);

create policy "Users can see other users in their workspace"
on workspace_users
for select
to authenticated
using (
  true
);
 
create policy "Owner/Admin can update workspace users"
on workspace_users
for update
to authenticated
using (
  exists (
    select 1 from workspace_users wu2
    where wu2.workspace_id = workspace_users.workspace_id
      and wu2.user_id = auth.uid()
      and wu2.role in ('owner', 'admin')
  ) AND
  workspace_users.role != 'owner'
);

create policy "Owner/Admin can remove workspace users"
on workspace_users for delete
using (
  exists (
    select 1 from workspace_users wu2
    where wu2.workspace_id = workspace_users.workspace_id
      and wu2.user_id = auth.uid()
      and wu2.role in ('owner', 'admin')
  )
  and workspace_users.role != 'owner'
);

-- Triggers for updated_at
create trigger handle_updated_at before update on workspace_users
    for each row execute procedure moddatetime (updated_at);

-- Function to add workspace creator as owner
create or replace function public.handle_new_workspace_user()
returns trigger as $$
begin
  insert into workspace_users (workspace_id, user_id, role, status)
  values (new.id, auth.uid(), 'owner', 'accepted');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function after workspace is created
create trigger on_workspace_created
after insert on workspaces
for each row execute procedure public.handle_new_workspace_user();