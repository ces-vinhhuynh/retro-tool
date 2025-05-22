create table agreements (
    id uuid default gen_random_uuid() primary key,
    health_check_id uuid references health_checks(id) on delete cascade,
    team_id uuid references teams(id) on delete cascade,
    title text not null,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table agreements enable row level security;

create policy "Agreements can be created by authenticated users"
on agreements for insert
with check (
    exists (
        select 1 from teams_users tu
        where tu.team_id = agreements.team_id
        and tu.user_id = auth.uid()
    )
);

create policy "Agreements can be viewed by authenticated users"
on agreements for select
using (
    exists (
        select 1 from teams_users tu
        where tu.team_id = agreements.team_id
        and tu.user_id = auth.uid()
    )
);

create policy "Agreements can be updated by their creators"
on agreements for update
using (
    exists (
        select 1 from teams_users tu
        where tu.team_id = agreements.team_id
        and tu.user_id = auth.uid()
    )
);

create policy "Agreements can be deleted by their creators"
on agreements for delete
using (
    exists (
        select 1 from teams_users tu
        where tu.team_id = agreements.team_id
        and tu.user_id = auth.uid()
    )
);

-- Triggers for updated_at
create trigger handle_updated_at before update on agreements
    for each row execute procedure moddatetime (updated_at);