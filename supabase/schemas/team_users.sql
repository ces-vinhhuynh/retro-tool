create type team_role as enum ('admin', 'member');

create table team_users (
    id uuid default gen_random_uuid() primary key,
    team_id uuid references teams(id) on delete cascade not null,
    user_id uuid references users(id) on delete cascade not null,
    role team_role,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (team_id, user_id)
);

alter table team_users enable row level security;

create policy "Users can see their own team_users rows"
on team_users for select
using (
  user_id = auth.uid()
);

-- Only team admin can add team users
create policy "Team admin can add team users"
on team_users for insert
with check (
  exists (
    select 1 from team_users tu2
    where tu2.team_id = team_users.team_id
      and tu2.user_id = auth.uid()
      and tu2.role = 'admin'
  )
);

-- Only team admin can update team users
create policy "Team admin can update team users"
on team_users for update
using (
  exists (
    select 1 from team_users tu2
    where tu2.team_id = team_users.team_id
      and tu2.user_id = auth.uid()
      and tu2.role = 'admin'
  )
);

-- Only team admin can delete team users
create policy "Team admin can delete team users"
on team_users for delete
using (
  exists (
    select 1 from team_users tu2
    where tu2.team_id = team_users.team_id
      and tu2.user_id = auth.uid()
      and tu2.role = 'admin'
  )
);

-- Triggers for updated_at
create trigger handle_updated_at before update on team_users
    for each row execute procedure moddatetime (updated_at);

-- Function to add team creator as admin
create or replace function public.handle_new_team_user()
returns trigger as $$
begin
  insert into team_users (team_id, user_id, role)
  values (new.id, auth.uid(), 'admin');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function after team is created
create trigger on_team_created
after insert on teams
for each row execute procedure public.handle_new_team_user();