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

alter table public.donations enable row level security;
