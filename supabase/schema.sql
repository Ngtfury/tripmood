-- ==============================================================================
-- Sreeram × Niyaa: "Christmas vacation trip" Database Schema
-- Supabase PostgreSQL Setup & Row Level Security
-- ==============================================================================

-- 1. Create Trips Table
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Sreeram × Niyaa',
  trip_name text not null default 'Christmas vacation trip',
  start_date date not null default '2026-10-01',
  target_date date not null default '2026-12-10',
  daily_person_amount integer not null default 50,
  main_target integer not null default 7100,
  timezone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Create Daily Contributions Table
create table if not exists public.daily_contributions (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  contribution_date date not null,
  sreeram_amount integer not null default 0 check (
    sreeram_amount >= 0 and (sreeram_amount = 0 or sreeram_amount >= 50)
  ),
  niyaa_amount integer not null default 0 check (
    niyaa_amount >= 0 and (niyaa_amount = 0 or niyaa_amount >= 50)
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_trip_contribution_date unique(trip_id, contribution_date),
  constraint check_valid_trip_range check (
    contribution_date >= '2026-10-01' and contribution_date <= '2026-12-10'
  )
);

-- 3. Indexes for fast lookup
create index if not exists idx_contributions_trip_date 
  on public.daily_contributions(trip_id, contribution_date desc);

-- 4. Enable Row Level Security (RLS)
alter table public.trips enable row level security;
alter table public.daily_contributions enable row level security;

-- 5. RLS Policies
-- Allow anyone with the anon key to read trips and contributions
create policy "Allow read access to trips" 
  on public.trips for select 
  using (true);

create policy "Allow read access to contributions" 
  on public.daily_contributions for select 
  using (true);

-- CRITICAL BACKWARD-ONLY RULE: Server/Database-level check
-- Rejects any insert or update for future dates in Asia/Kolkata
create policy "Allow insert contributions backwards only" 
  on public.daily_contributions for insert 
  with check (
    contribution_date <= (timezone('Asia/Kolkata', now()))::date
    and contribution_date >= '2026-10-01'
    and contribution_date <= '2026-12-10'
  );

create policy "Allow update contributions backwards only" 
  on public.daily_contributions for update 
  using (
    contribution_date <= (timezone('Asia/Kolkata', now()))::date
  )
  with check (
    contribution_date <= (timezone('Asia/Kolkata', now()))::date
  );

-- 6. Updated_at Trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_daily_contributions_updated_at
  before update on public.daily_contributions
  for each row execute function public.handle_updated_at();

-- 7. Seed Initial Trip
insert into public.trips (
  id,
  name,
  trip_name,
  start_date,
  target_date,
  daily_person_amount,
  main_target,
  timezone
) values (
  '00000000-0000-0000-0000-000000000001',
  'Sreeram × Niyaa',
  'Christmas vacation trip',
  '2026-10-01',
  '2026-12-10',
  50,
  7100,
  'Asia/Kolkata'
)
on conflict (id) do nothing;

-- 8. Enable Realtime Replication
alter publication supabase_realtime add table public.daily_contributions;
