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

create policy "Templates are viewable by authenticated users"
on health_check_templates for select
using (auth.uid() is not null);

-- Triggers for updated_at
create trigger handle_updated_at before update on health_check_templates
    for each row execute procedure moddatetime (updated_at);