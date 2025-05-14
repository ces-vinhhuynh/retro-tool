create type project_role as enum ('admin', 'member');

create table project_users (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references projects(id) on delete cascade not null,
    user_id uuid references users(id) on delete cascade not null,
    role project_role,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (project_id, user_id)
);

alter table project_users enable row level security;

-- Project members can view project users
create policy "Project members can view project users"
on project_users for select
using (
  exists (
    select 1 from project_users pu2
    where pu2.project_id = project_users.project_id
      and pu2.user_id = auth.uid()
  )
);

-- Only project admin can add project users
create policy "Project admin can add project users"
on project_users for insert
with check (
  exists (
    select 1 from project_users pu2
    where pu2.project_id = project_users.project_id
      and pu2.user_id = auth.uid()
      and pu2.role = 'admin'
  )
);

-- Only project admin can update project users
create policy "Project admin can update project users"
on project_users for update
using (
  exists (
    select 1 from project_users pu2
    where pu2.project_id = project_users.project_id
      and pu2.user_id = auth.uid()
      and pu2.role = 'admin'
  )
);

-- Only project admin can delete project users
create policy "Project admin can delete project users"
on project_users for delete
using (
  exists (
    select 1 from project_users pu2
    where pu2.project_id = project_users.project_id
      and pu2.user_id = auth.uid()
      and pu2.role = 'admin'
  )
);

-- Triggers for updated_at
create trigger handle_updated_at before update on project_users
    for each row execute procedure moddatetime (updated_at);

-- Function to add project creator as admin
create or replace function public.handle_new_project_user()
returns trigger as $$
begin
  insert into project_users (project_id, user_id, role)
  values (new.id, auth.uid(), 'admin');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function after project is created
create trigger on_project_created
after insert on projects
for each row execute procedure public.handle_new_project_user();