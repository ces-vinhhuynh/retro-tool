-- Create junction table for action item assignees
create table action_item_assignees (
    id uuid default gen_random_uuid() primary key,
    action_item_id uuid references action_items(id) on delete cascade,
    team_user_id uuid references team_users(id) on delete cascade,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- Ensure a team user can't be assigned to the same action item multiple times
    unique (action_item_id, team_user_id)
);

-- Enable RLS
alter table action_item_assignees enable row level security;

-- Policy to allow viewing assignees for team members
create policy "Team members can view action item assignees"
on action_item_assignees for select
using (
    exists (
        select 1 from action_items ai
        join team_users tu on tu.team_id = ai.team_id
        where ai.id = action_item_assignees.action_item_id
        and tu.user_id = auth.uid()
    )
);

create policy "Team members can create assignments"
on action_item_assignees for insert
with check (
    exists (
        select 1 from action_items ai
        join team_users tu on tu.team_id = ai.team_id
        where ai.id = action_item_assignees.action_item_id
        and tu.user_id = auth.uid()
    )
);

create policy "Team members can update assignments"
on action_item_assignees for update
using (
    exists (
        select 1 from action_items ai
        join team_users tu on tu.team_id = ai.team_id
        where ai.id = action_item_assignees.action_item_id
        and tu.user_id = auth.uid()
    )
);

create policy "Team members can delete assignments"
on action_item_assignees for delete
using (
    exists (
        select 1 from action_items ai
        join team_users tu on tu.team_id = ai.team_id
        where ai.id = action_item_assignees.action_item_id
        and tu.user_id = auth.uid()
    )
);

-- Trigger for updated_at
create trigger handle_updated_at before update on action_item_assignees
    for each row execute procedure moddatetime (updated_at);

-- Add index for better query performance
create index idx_action_item_assignees_action_item_id on action_item_assignees(action_item_id);
create index idx_action_item_assignees_team_user_id on action_item_assignees(team_user_id);