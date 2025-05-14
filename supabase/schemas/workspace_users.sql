create type workspace_role as enum ('owner', 'admin', 'member');

-- Then create the table
create table workspace_users (
    id uuid default gen_random_uuid() primary key,
    workspace_id uuid references workspaces(id) on delete cascade not null,
    user_id uuid references users(id) on delete cascade not null,
    role workspace_role,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (workspace_id, user_id)
);

alter table workspace_users enable row level security;

-- Members can view workspace users
create policy "Workspace members can view workspace users"
on workspace_users for select
using (
  exists (
    select 1 from workspace_users wu2
    where wu2.workspace_id = workspace_users.workspace_id
      and wu2.user_id = auth.uid()
  )
);

-- Only owner/admin can create workspace users
create policy "Owner/Admin can create workspace users"
on workspace_users for insert
with check (
  exists (
    select 1 from workspace_users wu2
    where wu2.workspace_id = workspace_users.workspace_id
      and wu2.user_id = auth.uid()
      and wu2.role in ('owner', 'admin')
  )
);

-- Only owner/admin can update workspace users
create policy "Owner/Admin can update workspace users"
on workspace_users for update
using (
  exists (
    select 1 from workspace_users wu2
    where wu2.workspace_id = workspace_users.workspace_id
      and wu2.user_id = auth.uid()
      and wu2.role in ('owner', 'admin')
  )
);

-- Only owner can remove workspace users
create policy "Owner can remove workspace users"
on workspace_users for delete
using (
  exists (
    select 1 from workspace_users wu2
    where wu2.workspace_id = workspace_users.workspace_id
      and wu2.user_id = auth.uid()
      and wu2.role = 'owner'
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
  insert into workspace_users (workspace_id, user_id, role)
  values (new.id, auth.uid(), 'owner');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function after workspace is created
create trigger on_workspace_created
after insert on workspaces
for each row execute procedure public.handle_new_workspace_user();