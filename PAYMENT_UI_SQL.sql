
-- GeoBazar Payment UI Pack
-- Это подготовка платежной системы. Реальный банк подключим следующим этапом.

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_id uuid,
  balance numeric default 0,
  currency text default 'GEL',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_id uuid,
  listing_id uuid,
  plan_id uuid,
  type text not null,
  amount numeric default 0,
  currency text default 'GEL',
  status text default 'pending',
  provider text default 'manual',
  provider_reference text,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_id uuid,
  plan_id uuid,
  status text default 'active',
  starts_at timestamptz default now(),
  ends_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_id uuid,
  payment_id uuid,
  invoice_number text,
  amount numeric default 0,
  currency text default 'GEL',
  status text default 'issued',
  created_at timestamptz default now()
);

alter table public.wallets enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invoices enable row level security;

-- Если policy already exists — это не критично, можно пропустить.
create policy "Users can view own wallets"
on public.wallets for select to authenticated
using (user_id = auth.uid());

create policy "Users can view own payments"
on public.payments for select to authenticated
using (user_id = auth.uid());

create policy "Users can create own payments"
on public.payments for insert to authenticated
with check (user_id = auth.uid());

create policy "Users can view own subscriptions"
on public.subscriptions for select to authenticated
using (user_id = auth.uid());

create policy "Users can view own invoices"
on public.invoices for select to authenticated
using (user_id = auth.uid());
