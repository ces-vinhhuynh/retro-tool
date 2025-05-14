create type health_check_status as enum ('in progress', 'done');

create table health_checks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    facilitator_id uuid references public.users(id) on delete set null,
    team_id uuid references teams(id) on delete set null,
    current_step integer default 1,
    template_id uuid references health_check_templates(id) on delete set null,
    status health_check_status default 'in progress',
    average_score jsonb default '{}',
    participants jsonb default '[]',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table health_checks enable row level security;

create policy "Health checks can be created by authenticated users"
on health_checks for insert
with check (auth.uid() is not null);

create policy "Health checks can be viewed by authenticated users"
on health_checks for select
using (auth.uid() is not null);

create policy "Health checks can be updated by creator"
on health_checks for update
using (auth.uid() = facilitator_id);

create policy "Health checks can be deleted by creator"
on health_checks for delete
using (auth.uid() = facilitator_id);

-- Triggers for updated_at
create trigger handle_updated_at before update on health_checks
    for each row execute procedure moddatetime (updated_at);