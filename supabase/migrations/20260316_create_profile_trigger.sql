-- ============================================================
-- Step 1: Create the trigger function
-- This auto-creates a profile row when a new user signs up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    username,
    lifetime_xp,
    weekly_xp,
    level,
    streak,
    streak_at_risk,
    favorite_league
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1),
      'Player'
    ),
    0,    -- lifetime_xp
    0,    -- weekly_xp
    1,    -- level
    0,    -- streak
    false, -- streak_at_risk
    'NBA'  -- favorite_league default
  );
  return new;
end;
$$;

-- ============================================================
-- Step 2: Create the trigger on auth.users
-- ============================================================
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Step 3: Backfill existing auth users who are missing profiles
-- ============================================================
insert into public.profiles (id, username, lifetime_xp, weekly_xp, level, streak, streak_at_risk, favorite_league)
select
  au.id,
  coalesce(
    au.raw_user_meta_data ->> 'full_name',
    split_part(au.email, '@', 1),
    'Player'
  ),
  0, 0, 1, 0, false, 'NBA'
from auth.users au
left join public.profiles p on p.id = au.id
where p.id is null;

-- ============================================================
-- Step 4: RLS policies for profiles table
-- ============================================================
alter table public.profiles enable row level security;

-- Anyone can read any profile
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users can insert their own profile (for the client-side fallback)
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update only their own profile
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
