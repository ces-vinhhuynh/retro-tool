create table issues (
    id uuid default gen_random_uuid() primary key,
    health_check_id uuid references health_checks(id) on delete cascade,
    team_id uuid references teams(id) on delete cascade,
    title text not null,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table issues enable row level security;

create policy "Issues can be created by authenticated users"
on issues for insert
with check (
  exists (
        select 1 from team_users tu
        where tu.team_id = issues.team_id
        and tu.user_id = auth.uid()
    )
);

create policy "Issues can be viewed by authenticated users"
on issues for select
using (
  exists (
        select 1 from team_users tu
        where tu.team_id = issues.team_id
        and tu.user_id = auth.uid()
    )
);

create policy "Issues can be updated by their creators"
on issues for update
using (
  exists (
        select 1 from team_users tu
        where tu.team_id = issues.team_id
        and tu.user_id = auth.uid()
    )
);

create policy "Issues can be deleted by their creators"
on issues for delete
using (
  exists (
        select 1 from team_users tu
        where tu.team_id = issues.team_id
        and tu.user_id = auth.uid()
    )
);

-- Triggers for updated_at
create trigger handle_updated_at before update on issues
    for each row execute procedure moddatetime (updated_at);