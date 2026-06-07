
-- GeoBazar smart category parameters
alter table public.listings
add column if not exists parameters jsonb default '{}'::jsonb;
