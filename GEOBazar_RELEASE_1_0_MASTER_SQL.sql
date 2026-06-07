
-- GeoBazar Release 1.0 Master SQL
-- Выполнить в Supabase SQL Editor один раз.

-- Listings final fields
alter table public.listings
add column if not exists latitude double precision,
add column if not exists longitude double precision,
add column if not exists address text,
add column if not exists images text[] default '{}',
add column if not exists video_url text,
add column if not exists parameters jsonb default '{}'::jsonb,
add column if not exists status text default 'active',
add column if not exists is_vip boolean default false,
add column if not exists is_boosted boolean default false,
add column if not exists boosted_until timestamptz,
add column if not exists vip_until timestamptz,
add column if not exists views_count int default 0,
add column if not exists favorites_count int default 0,
add column if not exists sold_at timestamptz,
add column if not exists archived_at timestamptz;

-- Profiles
alter table public.profiles
add column if not exists avatar_url text,
add column if not exists phone text,
add column if not exists whatsapp text,
add column if not exists city text,
add column if not exists rating_avg numeric default 0,
add column if not exists reviews_count int default 0,
add column if not exists verification_status text default 'none';

-- Companies / CRM
create table if not exists public.company_leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  listing_id uuid,
  client_id uuid,
  manager_id uuid,
  title text,
  client_name text,
  client_phone text,
  client_message text,
  status text default 'new',
  source text default 'geobazar',
  amount numeric default 0,
  currency text default 'GEL',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.company_team (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  user_id uuid,
  role text default 'manager',
  status text default 'active',
  created_at timestamptz default now()
);

-- Favorites
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  listing_id uuid not null,
  created_at timestamptz default now(),
  unique(user_id, listing_id)
);

-- Messages
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid,
  buyer_id uuid,
  seller_id uuid,
  company_id uuid,
  last_message text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid,
  sender_id uuid,
  body text,
  attachment_url text,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid,
  target_user_id uuid,
  company_id uuid,
  listing_id uuid,
  rating int check (rating between 1 and 5),
  comment text,
  status text default 'active',
  created_at timestamptz default now()
);

-- Reports / moderation
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid,
  target_type text,
  target_id text,
  reason text,
  status text default 'new',
  admin_note text,
  created_at timestamptz default now()
);

-- Payments
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_id uuid,
  balance numeric default 0,
  currency text default 'GEL',
  created_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_id uuid,
  listing_id uuid,
  type text,
  amount numeric default 0,
  currency text default 'GEL',
  status text default 'pending',
  provider text default 'manual',
  description text,
  created_at timestamptz default now()
);

-- GeoCargo
create table if not exists public.cargo_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_id uuid,
  from_location text,
  to_location text,
  cargo_type text,
  weight text,
  volume text,
  price numeric,
  currency text default 'GEL',
  date_needed date,
  status text default 'active',
  created_at timestamptz default now()
);

-- GeoTravel
create table if not exists public.travel_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  service_type text,
  destination text,
  people_count int,
  travel_date date,
  phone text,
  comment text,
  status text default 'new',
  created_at timestamptz default now()
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text,
  body text,
  type text default 'info',
  read_at timestamptz,
  created_at timestamptz default now()
);


-- GeoBazar Full No Placeholder Extra SQL

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  subject text,
  message text,
  status text default 'new',
  admin_note text,
  created_at timestamptz default now()
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  company_id uuid,
  request_type text default 'user',
  document_url text,
  comment text,
  status text default 'pending',
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create table if not exists public.user_profiles_public (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  display_name text,
  phone text,
  whatsapp text,
  city text,
  avatar_url text,
  created_at timestamptz default now()
);
