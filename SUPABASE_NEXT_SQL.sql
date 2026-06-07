
-- GeoBazar Support Center + Payment Architecture

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_id uuid,
  category text default 'other',
  subject text,
  message text,
  status text default 'new',
  priority text default 'normal',
  assigned_to uuid,
  admin_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.support_tickets(id) on delete cascade,
  sender_id uuid,
  message text,
  attachment_url text,
  created_at timestamptz default now()
);

alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;

create policy "Users can view own support tickets"
on public.support_tickets for select to authenticated
using (user_id = auth.uid());

create policy "Users can create support tickets"
on public.support_tickets for insert to authenticated
with check (user_id = auth.uid());

create policy "Users can update own support tickets"
on public.support_tickets for update to authenticated
using (user_id = auth.uid());

create policy "Users can view own support messages"
on public.support_messages for select to authenticated
using (
  exists (
    select 1 from public.support_tickets t
    where t.id = support_messages.ticket_id
    and t.user_id = auth.uid()
  )
);

create policy "Users can create support messages"
on public.support_messages for insert to authenticated
with check (sender_id = auth.uid());

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_id uuid,
  plan_id uuid,
  payment_id uuid,
  type text,
  amount numeric default 0,
  currency text default 'GEL',
  status text default 'pending',
  provider text,
  provider_reference text,
  description text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.payment_transactions enable row level security;

create policy "Users can view own payment transactions"
on public.payment_transactions for select to authenticated
using (user_id = auth.uid());
