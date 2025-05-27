-- Create the responses table
create table responses (
    id uuid default gen_random_uuid() primary key,
    health_check_id uuid references health_checks(id) on delete cascade not null,
    user_id uuid references public.users(id) on delete cascade not null,
    answers jsonb default '{}',
    health_check_rating integer,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (health_check_id, user_id)
);

-- Enable RLS
alter table responses enable row level security;

-- Policies
create policy "Team members can create responses"
on responses
for insert
to authenticated
with check (
  exists (
    select 1
    from health_checks hc
    join team_users tu on tu.team_id = hc.team_id
    where hc.id = responses.health_check_id
      and tu.user_id = auth.uid()
  )
);

create policy "Team members can view responses"
on responses
for select
to authenticated
using (
  exists (
    select 1
    from health_checks hc
    join team_users tu on tu.team_id = hc.team_id
    where hc.id = responses.health_check_id
      and tu.user_id = auth.uid()
  )
);

create policy "Authors can update their own responses"
on responses
for update
to authenticated
using (
  user_id = auth.uid()
);

create policy "Authors can delete their own responses"
on responses
for delete
to authenticated
using (
  user_id = auth.uid()
);

-- Triggers for updated_at
create trigger handle_updated_at before update on responses
    for each row execute procedure moddatetime (updated_at);