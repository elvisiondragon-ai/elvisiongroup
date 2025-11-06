-- Update Banner per-user, per-version tracking
-- Ensures a user can only "click" once per banner version.

-- 1) Table to store click events (history friendly)
create table if not exists public.update_banner_clicks (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  banner_version text not null,
  clicked_at timestamptz not null default now(),
  constraint update_banner_clicks_pk primary key (user_id, banner_version)
);

-- 2) RLS policies: users can see/insert their own records only
alter table public.update_banner_clicks enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'update_banner_clicks' and policyname = 'Allow read own clicks'
  ) then
    create policy "Allow read own clicks"
      on public.update_banner_clicks for select
      using ( auth.uid() = user_id );
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'update_banner_clicks' and policyname = 'Allow insert own clicks'
  ) then
    create policy "Allow insert own clicks"
      on public.update_banner_clicks for insert
      with check ( auth.uid() = user_id );
  end if;
end $$;

-- Optional: index for version queries (not strictly needed due to PK)
create index if not exists update_banner_clicks_version_idx
  on public.update_banner_clicks (banner_version);

-- Usage notes:
-- - The app checks for a row (user_id, current_version). If exists, banner stays hidden.
-- - On click, the app inserts a row. The primary key prevents duplicates per version.
-- - EXP awarding occurs only when the insert succeeds (no unique violation).

