create type team_role as enum ('admin', 'member');
create type team_user_status as enum ('pending', 'accepted', 'expired');
-- Create the team_users table
create table team_users (
    id uuid default gen_random_uuid() primary key,
    team_id uuid references teams(id) on delete cascade not null,
    user_id uuid references users(id) on delete cascade,
    role team_role,
    email text,
    token text,
    token_expires_at timestamp with time zone,
    status team_user_status default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (team_id, user_id)
);

-- Enable RLS
alter table team_users enable row level security;

-- Policies
create policy "Team admin can create team users"
on team_users
for insert
to authenticated
with check (
  exists (
    select 1 from team_users tu2
    where tu2.team_id = team_users.team_id
      and tu2.user_id = auth.uid()
      and tu2.role = 'admin'
  )
);

create policy "Workspace owner/admin create add team users"
on team_users
for insert
to authenticated
with check (
  exists (
    select 1 from teams t
    join workspace_users wu on wu.workspace_id = t.workspace_id
    where t.id = team_users.team_id
      and wu.user_id = auth.uid()
      and wu.role in ('owner', 'admin')
  )
);

create policy "Workspace member can view team users"
on team_users
for select
to authenticated
using (
  true
);

create policy "Team admin can update team users"
on team_users
for update
to authenticated
using (
  exists (
    select 1 from team_users tu2
    where tu2.team_id = team_users.team_id
      and tu2.user_id = auth.uid()
      and tu2.role = 'admin'
  )
);

create policy "Workspace owner/admin can update team users"
on team_users
for update
to authenticated
using (
  exists (
    select 1 from teams t
    join workspace_users wu on wu.workspace_id = t.workspace_id
    where t.id = team_users.team_id
      and wu.user_id = auth.uid()
      and wu.role in ('owner', 'admin')
  )
);

create policy "Team admin can delete team users"
on team_users
for delete
to authenticated
using (
  exists (
    select 1 from team_users tu2
    where tu2.team_id = team_users.team_id
      and tu2.user_id = auth.uid()
      and tu2.role = 'admin'
  )
);

create policy "Invited user can accept team invite"
on team_users
for update
to authenticated
using (
  true
);

create policy "Workspace owner/admin can delete team users"
on team_users
for delete
to authenticated
using (
  exists (
    select 1 from teams t
    join workspace_users wu on wu.workspace_id = t.workspace_id
    where t.id = team_users.team_id
      and wu.user_id = auth.uid()
      and wu.role in ('owner', 'admin')
  )
);

-- Triggers for updated_at
create trigger handle_updated_at before update on team_users
    for each row execute procedure moddatetime (updated_at);

-- Function to add team creator as admin
create or replace function public.handle_new_team_user()
returns trigger as $$
begin
  insert into team_users (team_id, user_id, role, status)
  values (new.id, auth.uid(), 'admin', 'accepted');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function after team is created
create trigger on_team_created
after insert on teams
for each row execute procedure public.handle_new_team_user();