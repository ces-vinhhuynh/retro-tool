create table invitations (
    id uuid default gen_random_uuid() primary key,
    token text not null,
    workspace_id uuid references workspaces(id) on delete set null,
    team_id uuid references teams(id) on delete set null,
    health_check_id uuid references health_checks(id) on delete set null
);