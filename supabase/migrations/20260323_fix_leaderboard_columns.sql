-- ============================================================
-- Fix: Ensure all XP/leaderboard columns exist on profiles
-- The leaderboard reads lifetime_xp and weekly_xp from profiles.
-- updateUserXPAndStreak() writes to these columns after each game.
-- If any column is missing, the update silently fails and users
-- never appear on the leaderboard.
-- ============================================================

-- XP columns (leaderboard queries ORDER BY these)
alter table public.profiles add column if not exists lifetime_xp integer not null default 0;
alter table public.profiles add column if not exists weekly_xp integer not null default 0;
alter table public.profiles add column if not exists level integer not null default 1;

-- Streak columns (updated by updateUserXPAndStreak when isDailyGame=true)
alter table public.profiles add column if not exists streak integer not null default 0;
alter table public.profiles add column if not exists streak_at_risk boolean not null default false;
alter table public.profiles add column if not exists last_game_date date;

-- Username column (leaderboard displays this)
alter table public.profiles add column if not exists username text;

-- Friend system column (friends leaderboard reads this)
alter table public.profiles add column if not exists friend_ids uuid[] not null default '{}';

-- Ensure the RLS update policy exists (required for XP writes)
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
