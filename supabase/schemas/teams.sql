-- Create the teams table
create table teams (
    id uuid default gen_random_uuid() primary key,
    workspace_id uuid references workspaces(id) on delete cascade not null,
    name text not null,
    logo_url text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table teams enable row level security;

-- Triggers for updated_at
create trigger handle_updated_at before update on teams
    for each row execute procedure moddatetime (updated_at);