create type action_item_status as enum ('todo', 'in_progress', 'done', 'blocked');
create type action_item_priority as enum ('high', 'medium', 'low');

create table action_items (
    id uuid default gen_random_uuid() primary key,
    health_check_id uuid references health_checks(id) on delete cascade not null,
    team_id uuid,
    question_id uuid,
    title text not null,
    description text,
    due_date timestamp with time zone,
    status action_item_status default 'todo',
    priority action_item_priority,
    assigned_to uuid references public.users(id) on delete set null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table action_items enable row level security;

create policy "Actions can be created by authenticated users"
on action_items for insert
with check (
  auth.uid() is not null
);

create policy "Actions can be viewed by authenticated users"
on action_items for select
using (
  auth.uid() is not null
);

create policy "Actions can be updated by their creators"
on action_items for update
using (
  auth.uid() is not null
);

create policy "Actions can be deleted by their creators"
on action_items for delete
using (
  auth.uid() is not null
);

-- Triggers for updated_at
create trigger handle_updated_at before update on action_items
    for each row execute procedure moddatetime (updated_at);