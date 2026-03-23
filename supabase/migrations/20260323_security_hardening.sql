-- ============================================================
-- Security Hardening Migration
-- Covers: missing tables + RLS, indexes, constraints, qotd fix
-- ============================================================

-- ============================================================
-- 1. Create user_game_results table (used by gameResults.ts but missing)
-- ============================================================
create table if not exists public.user_game_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  date date not null,
  league text not null,
  game_type text not null,
  completed boolean not null default false,
  score integer not null default 0,
  xp_earned integer not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, date, league, game_type)
);

alter table public.user_game_results enable row level security;

create policy "Users can read own game results"
  on public.user_game_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own game results"
  on public.user_game_results for insert
  with check (auth.uid() = user_id);

create policy "Users can update own game results"
  on public.user_game_results for update
  using (auth.uid() = user_id);

-- ============================================================
-- 2. Fix qotd_questions INSERT policy (was too permissive)
-- ============================================================
drop policy if exists "qotd_questions_insert" on public.qotd_questions;
create policy "qotd_questions_insert"
  on public.qotd_questions for insert
  with check (auth.uid() is not null);

-- ============================================================
-- 3. Add server-side constraints on username
-- ============================================================
do $$
begin
  -- Only add if constraint doesn't exist
  if not exists (
    select 1 from information_schema.check_constraints
    where constraint_name = 'username_length'
  ) then
    alter table public.profiles
      add constraint username_length
      check (username is null or (char_length(username) >= 1 and char_length(username) <= 30));
  end if;
end $$;

-- ============================================================
-- 4. Database indexes for common query patterns
-- ============================================================

-- Leaderboard queries (ORDER BY weekly_xp / lifetime_xp)
create index if not exists idx_profiles_lifetime_xp_desc
  on public.profiles (lifetime_xp desc nulls last);

create index if not exists idx_profiles_weekly_xp_desc
  on public.profiles (weekly_xp desc nulls last);

-- Game results by user + date (duplicate prevention, daily lookups)
create index if not exists idx_user_game_results_lookup
  on public.user_game_results (user_id, date, league, game_type);

-- Game sessions by user (XP history)
create index if not exists idx_game_sessions_user
  on public.game_sessions (user_id, created_at desc);

-- QotD questions by date (daily lookup)
create index if not exists idx_qotd_questions_date
  on public.qotd_questions (date);

-- QotD responses by question (response listing)
create index if not exists idx_qotd_responses_question
  on public.qotd_responses (question_id, created_at desc);

-- Streak notifications (edge function: profiles with active streaks)
create index if not exists idx_profiles_active_streaks
  on public.profiles (streak) where streak > 0;

-- Daily games by date + league
create index if not exists idx_daily_games_date_league
  on public.daily_games (date, league);

-- Players pool by league
create index if not exists idx_players_pool_league
  on public.players_pool (league);
