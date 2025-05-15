create table participants (
    health_check_id uuid not null references health_checks(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    progress integer default 0,
    last_active timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    primary key (health_check_id, user_id)
);

-- Enable RLS
alter table participants enable row level security;

create policy "Participants can be created by authenticated users"
on participants for insert
with check (auth.uid() is not null);

create policy "Participants can view their own records"
on participants for select
using (auth.uid() is not null);

create policy "Participants can update their own records"
on participants for update
using (auth.uid() = user_id);

create policy "Participants can delete their own records"
on participants for delete
using (auth.uid() is not null);

create trigger handle_updated_at before update on participants
for each row execute procedure moddatetime(updated_at);
