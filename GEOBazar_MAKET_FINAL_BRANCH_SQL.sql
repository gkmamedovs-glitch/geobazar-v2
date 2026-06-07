
-- GeoBazar Maket Final Branch SQL
alter table public.listings add column if not exists latitude double precision;
alter table public.listings add column if not exists longitude double precision;
alter table public.listings add column if not exists address text;
alter table public.listings add column if not exists images text[] default '{}';
alter table public.listings add column if not exists video_url text;
alter table public.listings add column if not exists parameters jsonb default '{}'::jsonb;
alter table public.listings add column if not exists status text default 'active';
alter table public.listings add column if not exists is_vip boolean default false;
alter table public.listings add column if not exists is_boosted boolean default false;
alter table public.listings add column if not exists views_count int default 0;

create table if not exists public.favorites (id uuid primary key default gen_random_uuid(), user_id uuid, listing_id uuid, created_at timestamptz default now(), unique(user_id, listing_id));
create table if not exists public.support_tickets (id uuid primary key default gen_random_uuid(), user_id uuid, subject text, message text, status text default 'new', created_at timestamptz default now());
create table if not exists public.company_leads (id uuid primary key default gen_random_uuid(), company_id uuid, listing_id uuid, client_id uuid, title text, client_name text, client_phone text, client_message text, status text default 'new', created_at timestamptz default now());
create table if not exists public.company_team (id uuid primary key default gen_random_uuid(), company_id uuid, user_id uuid, role text default 'manager', status text default 'active', created_at timestamptz default now());
create table if not exists public.conversations (id uuid primary key default gen_random_uuid(), listing_id uuid, buyer_id uuid, seller_id uuid, company_id uuid, last_message text, created_at timestamptz default now());
create table if not exists public.messages (id uuid primary key default gen_random_uuid(), conversation_id uuid, sender_id uuid, body text, read_at timestamptz, created_at timestamptz default now());
create table if not exists public.payments (id uuid primary key default gen_random_uuid(), user_id uuid, company_id uuid, listing_id uuid, type text, amount numeric default 0, currency text default 'GEL', status text default 'pending', description text, created_at timestamptz default now());
create table if not exists public.verification_requests (id uuid primary key default gen_random_uuid(), user_id uuid, company_id uuid, comment text, status text default 'pending', created_at timestamptz default now());
create table if not exists public.cargo_orders (id uuid primary key default gen_random_uuid(), user_id uuid, from_location text, to_location text, cargo_type text, weight text, price numeric, status text default 'active', created_at timestamptz default now());
create table if not exists public.travel_requests (id uuid primary key default gen_random_uuid(), user_id uuid, service_type text, destination text, people_count int, phone text, comment text, status text default 'new', created_at timestamptz default now());
