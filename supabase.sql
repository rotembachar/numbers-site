tension
-- lock the single settings row to avoid race conditions
perform 1 from public.settings where id = 1 for update;
select next_number into n from public.settings where id = 1;
update public.settings set next_number = next_number + 1 where id = 1;
insert into public.purchases(number) values (n);
return n;
end;
$$;


-- Allow anon to call the RPC
grant execute on function public.reserve_next_number() to anon;
```sql
-- Enable useful extension
create extension if not exists pgcrypto; -- for gen_random_uuid()


-- Settings: holds the global counter (single row)
create table if not exists public.settings (
id int primary key default 1 check (id = 1),
next_number int not null default 1
);
insert into public.settings (id, next_number)
values (1, 1)
on conflict (id) do nothing;


-- Purchases (you can extend later with email, payment status, etc.)
create table if not exists public.purchases (
id uuid primary key default gen_random_uuid(),
number int not null unique,
email text,
status text not null default 'reserved',
created_at timestamptz not null default now()
);


-- Row Level Security
alter table public.settings enable row level security;
alter table public.purchases enable row level security;


-- Policies: allow read of settings.next_number to anyone (to show the counter)
create policy if not exists "read settings" on public.settings
for select to anon
using (true);


-- By default, nobody reads purchases (keeps privacy). Add policies later if needed.


-- Atomic reservation function
create or replace function public.reserve_next_number()
returns integer
language plpgsql
security definer -- run with table owner privileges (bypass RLS inside the function)
as $$
declare
n integer;
begin
-- lock the row to avoid race conditions
perform 1 from public.settings where id = 1 for update;
select next_number into n from public.settings where id = 1;
update public.settings set next_number = next_number + 1 where id = 1;
insert into public.purchases(number) values (n);
return n;
end;
$$;


-- Permit calling the function via RPC
grant execute on function public.reserve_next_number() to anon;
