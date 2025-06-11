create table health_check_templates (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    type text,
    team_id uuid,
    min_value jsonb not null,
    max_value jsonb not null,
    questions jsonb not null,
    is_custom boolean default false,
    original_id uuid,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

-- Enable RLS
alter table health_check_templates enable row level security;

-- Policy for selecting templates
create policy "Standard templates are viewable by all authenticated users, custom templates are only viewable by users in the workspace"
on health_check_templates for select
to authenticated
using (
    auth.uid() is not null
    and (
        -- Standard templates are viewable by all authenticated users
        (is_custom = false)
        or
        -- Custom templates are only viewable by users in the workspace
        (is_custom = true and exists (
            select 1 
            from workspace_users
            where workspace_users.workspace_id = (
                select workspace_id 
                from teams 
                where id = health_check_templates.team_id
            )
            and workspace_users.user_id = auth.uid()
        ))
    )
);

-- Policy for inserting templates
create policy "Workspace owners/admins and team admins can create templates"
on health_check_templates for insert
to authenticated
with check (
    auth.uid() is not null
    and (
        -- Workspace owner or admin
        exists (
            select 1 
            from workspace_users
            where workspace_users.workspace_id = (
                select workspace_id 
                from teams 
                where id = health_check_templates.team_id
            )
            and workspace_users.user_id = auth.uid()
            and workspace_users.role in ('owner', 'admin')
        )
        or
        -- Team admin
        exists (
            select 1 
            from team_users
            where team_users.team_id = health_check_templates.team_id
            and team_users.user_id = auth.uid()
            and team_users.role = 'admin'
        )
    )
);

-- Policy for updating templates
create policy "Workspace owners/admins and team admins can update their own custom templates"
on health_check_templates for update
to authenticated
using (
    auth.uid() is not null 
    and is_custom = true
    and (
        -- Workspace owner or admin
        exists (
            select 1 
            from workspace_users
            where workspace_users.workspace_id = (
                select workspace_id 
                from teams 
                where id = health_check_templates.team_id
            )
            and workspace_users.user_id = auth.uid()
            and workspace_users.role in ('owner', 'admin')
        )
        or
        -- Team admin
        exists (
            select 1 
            from team_users
            where team_users.team_id = health_check_templates.team_id
            and team_users.user_id = auth.uid()
            and team_users.role = 'admin'
        )
    )
);

-- Triggers for updated_at
create trigger handle_updated_at before update on health_check_templates
    for each row execute procedure moddatetime (updated_at);