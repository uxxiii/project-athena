-- Project Athena Database Migration
-- Fixes for Donations Table and MUN Picnic / Registration Columns

-- 1. Create donations table if it doesn't already exist
create table if not exists public.donations (
  id text primary key,
  donor_name text not null,
  donor_email text not null,
  donor_phone text not null default '',
  amount numeric(12, 2) not null default 0,
  transaction_ref text not null,
  screenshot text,
  message text not null default '',
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

-- 2. Enable Row Level Security (RLS) on donations
alter table public.donations enable row level security;

-- 3. Add RLS policies for donations
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'donations' and policyname = 'Allow service_role full access to donations'
  ) then
    create policy "Allow service_role full access to donations"
      on public.donations for all to service_role using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'donations' and policyname = 'Allow public insert to donations'
  ) then
    create policy "Allow public insert to donations"
      on public.donations for insert to anon, authenticated with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'donations' and policyname = 'Allow public read donations'
  ) then
    create policy "Allow public read donations"
      on public.donations for select to anon, authenticated using (true);
  end if;
end $$;

-- 4. Add missing columns to registrations table
alter table public.registrations add column if not exists food_preference text;
alter table public.registrations add column if not exists notes text;
alter table public.registrations add column if not exists rejection_reason text;
alter table public.registrations add column if not exists registration_code text;

-- 5. Helpful indexes
create index if not exists idx_registrations_event_slug on public.registrations(event_slug);
create index if not exists idx_registrations_status on public.registrations(status);
create index if not exists idx_donations_created_at on public.donations(created_at desc);
