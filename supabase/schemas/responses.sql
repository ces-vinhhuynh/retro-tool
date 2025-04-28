create table responses (
    id uuid default gen_random_uuid() primary key,
    health_check_id uuid references health_checks(id) on delete cascade not null,
    user_id uuid references public.users(id) on delete cascade not null,
    answers jsonb default '{}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (health_check_id, user_id)
);

-- Enable RLS
alter table responses enable row level security;

create policy "Responses can be created by authenticated users"
on responses for insert
with check (
  auth.uid() is not null
);

create policy "Responses can be viewed by authenticated users"
on responses for select
using (
  auth.uid() is not null
);

create policy "Responses can be updated by their creators"
on responses for update
using (auth.uid() = user_id);

create policy "Responses can be deleted by their creators"
on responses for delete
using (auth.uid() = user_id);

-- Triggers for updated_at
create trigger handle_updated_at before update on responses
    for each row execute procedure moddatetime (updated_at);