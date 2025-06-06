create type health_check_status as enum ('in progress', 'done');

-- Create the health_checks table
create table health_checks (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    facilitator_ids uuid[] default '{}',
    team_id uuid references teams(id) on delete set null,
    current_step integer default 1,
    template_id uuid references health_check_templates(id) on delete set null,
    status health_check_status default 'in progress',
    average_score jsonb default '{}',
    participants jsonb default '[]',
    settings jsonb default '{
        "display_mode": "grouped",
        "allow_participant_navigation": true
    }',
    current_group_index integer default 0,
    current_question_index integer default 0,
    end_time timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint valid_display_mode check (
        settings->>'display_mode' in ('single', 'grouped', 'all')
    ),
    constraint valid_allow_navigation check (
        settings->>'allow_participant_navigation' in ('true', 'false')
    )
);

-- Enable RLS
alter table health_checks enable row level security;

-- Policies
create policy "Team admin can create health checks"
on health_checks
for insert
to authenticated
with check (
  exists (
    select 1 from team_users
    where team_users.team_id = health_checks.team_id
      and team_users.user_id = auth.uid()
      and team_users.role = 'admin'
  )
);

create policy "Workspace owner/admin can create health checks"
on health_checks
for insert
to authenticated
with check (
  exists (
    select 1
    from teams
    join workspace_users
      on workspace_users.workspace_id = teams.workspace_id
    where teams.id = health_checks.team_id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role in ('owner', 'admin')
  )
);

create policy "Workspace owner/admin can view health checks"
on health_checks
for select
to authenticated
using (
  exists (
    select 1
    from teams
    join workspace_users
      on workspace_users.workspace_id = teams.workspace_id
    where teams.id = health_checks.team_id
      and workspace_users.user_id = auth.uid()
      and workspace_users.role in ('owner', 'admin')
  )
);

create policy "Team members can view health checks"
on health_checks
for select
to authenticated
using (
  exists (
    select 1 from team_users
    where team_users.team_id = health_checks.team_id
      and team_users.user_id = auth.uid()
  )
);

create policy "Facilitators can update health checks"
on public.health_checks
for update
to authenticated
using (
  auth.uid() = ANY (facilitator_ids)
)
with check (
  true
);

create policy "Team admin can delete health checks"
on health_checks
for delete
to authenticated
using (
  exists (
    select 1 from team_users
    where team_users.team_id = health_checks.team_id
      and team_users.user_id = auth.uid()
      and team_users.role = 'admin'
  )
);

-- Triggers for updated_at
create trigger handle_updated_at before update on health_checks
    for each row execute procedure moddatetime (updated_at);