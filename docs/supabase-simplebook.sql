create table if not exists simplebook_user_data (
  id uuid primary key default gen_random_uuid(),
  device_id text not null unique,
  recovery_code text not null unique,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_simplebook_recovery_code
  on simplebook_user_data(recovery_code);

alter table simplebook_user_data enable row level security;

-- Development MVP policy:
-- Allows the frontend anon key to read/write rows by device_id or recovery_code.
-- Use this only while the app is recovery-code based and has no real login.
create policy "simplebook anon can read"
  on simplebook_user_data
  for select
  to anon
  using (true);

create policy "simplebook anon can insert"
  on simplebook_user_data
  for insert
  to anon
  with check (true);

create policy "simplebook anon can update"
  on simplebook_user_data
  for update
  to anon
  using (true)
  with check (true);

-- Production recommendation:
-- Replace the broad anon policies above with Supabase Auth based policies,
-- or move writes behind a serverless API that validates device ownership.
