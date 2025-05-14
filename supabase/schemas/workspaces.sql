-- Create the workspaces table
create table workspaces (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table workspaces enable row level security;

-- Add trigger for updated_at
create trigger handle_updated_at before update on workspaces
    for each row execute procedure moddatetime (updated_at);

create or replace function public.create_workspace_and_project(
  ws_id uuid,
  ws_name text,
  proj_id uuid,
  proj_name text
)
returns void
language plpgsql
security definer
as $$
begin
  -- Insert workspace
  insert into workspaces (id, name)
  values (ws_id, ws_name);

  -- Insert project
  insert into projects (id, workspace_id, name)
  values (proj_id, ws_id, proj_name);
end;
$$;