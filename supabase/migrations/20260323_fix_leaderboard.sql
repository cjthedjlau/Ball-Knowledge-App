-- ============================================================
-- Fix: Add missing columns and tables that prevent XP tracking
-- ============================================================

-- 1. Add last_game_date column to profiles (required by updateUserXPAndStreak)
alter table public.profiles
  add column if not exists last_game_date date;

-- 2. Create game_sessions table (required by saveGameResult in xp.ts)
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  game_type text not null,
  xp_earned integer not null default 0,
  score integer not null default 0,
  created_at timestamptz not null default now()
);

-- RLS for game_sessions
alter table public.game_sessions enable row level security;

create policy "Users can read own game sessions"
  on public.game_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own game sessions"
  on public.game_sessions for insert
  with check (auth.uid() = user_id);
