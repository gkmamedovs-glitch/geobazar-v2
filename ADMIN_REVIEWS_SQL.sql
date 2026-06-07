
-- GeoBazar Admin + Reviews + Ratings Pack

alter table public.profiles
add column if not exists rating_avg numeric default 0,
add column if not exists reviews_count int default 0,
add column if not exists response_rate numeric default 0,
add column if not exists last_seen_at timestamptz;

alter table public.companies
add column if not exists rating_avg numeric default 0,
add column if not exists reviews_count int default 0;

alter table public.listings
add column if not exists moderation_status text default 'pending_review',
add column if not exists admin_status text default 'active',
add column if not exists admin_note text;

-- Admin policies for reports/reviews/listings/verification
create policy if not exists "Admins can view reports"
on public.reports for select to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
    and au.status = 'active'
  )
);

create policy if not exists "Admins can update reports"
on public.reports for update to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
    and au.status = 'active'
  )
);

create policy if not exists "Admins can view verification requests"
on public.verification_requests for select to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
    and au.status = 'active'
  )
);

create policy if not exists "Admins can update verification requests"
on public.verification_requests for update to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
    and au.status = 'active'
  )
);

-- Note: Supabase may not support CREATE POLICY IF NOT EXISTS on some projects.
-- If you get an error "syntax error near if not exists", create the policies manually without IF NOT EXISTS,
-- or skip if policies already exist.
