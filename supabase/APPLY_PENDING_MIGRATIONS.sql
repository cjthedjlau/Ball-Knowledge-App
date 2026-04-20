-- ============================================================
-- PENDING MIGRATIONS — Run this in Supabase SQL Editor
-- Covers all migrations from sessions on 2026-04-03 through 2026-04-07
-- Safe to run multiple times (uses IF NOT EXISTS / OR REPLACE)
-- ============================================================

-- 1. Add missing profile columns (push_token, last_play_hour)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS push_token text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_play_hour integer;

-- 2. Atomic XP update RPC (prevents read-modify-write race condition)
CREATE OR REPLACE FUNCTION public.update_xp_and_streak(
  p_user_id uuid,
  p_xp_earned integer,
  p_is_daily boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile profiles%ROWTYPE;
  v_today date := CURRENT_DATE;
  v_new_streak integer;
  v_new_level integer;
BEGIN
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Profile not found for user %', p_user_id; END IF;

  IF v_profile.last_game_date = v_today THEN
    v_new_streak := v_profile.streak;
  ELSIF v_profile.last_game_date = v_today - 1 THEN
    v_new_streak := COALESCE(v_profile.streak, 0) + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  v_new_level := CASE
    WHEN COALESCE(v_profile.lifetime_xp, 0) + p_xp_earned >= 10000 THEN 5
    WHEN COALESCE(v_profile.lifetime_xp, 0) + p_xp_earned >= 5000 THEN 4
    WHEN COALESCE(v_profile.lifetime_xp, 0) + p_xp_earned >= 2000 THEN 3
    WHEN COALESCE(v_profile.lifetime_xp, 0) + p_xp_earned >= 500 THEN 2
    ELSE 1
  END;

  UPDATE profiles SET
    lifetime_xp = COALESCE(lifetime_xp, 0) + p_xp_earned,
    weekly_xp = COALESCE(weekly_xp, 0) + p_xp_earned,
    streak = v_new_streak,
    level = v_new_level,
    last_game_date = v_today
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'lifetime_xp', COALESCE(v_profile.lifetime_xp, 0) + p_xp_earned,
    'weekly_xp', COALESCE(v_profile.weekly_xp, 0) + p_xp_earned,
    'streak', v_new_streak,
    'brain_level', v_new_level
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.update_xp_and_streak TO authenticated;

-- 3. Evaluate streaks (cron function)
CREATE OR REPLACE FUNCTION public.evaluate_streaks()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE affected integer;
BEGIN
  UPDATE profiles SET streak = 0, streak_at_risk = false
  WHERE streak > 0 AND last_game_date IS NOT NULL AND last_game_date < (CURRENT_DATE - interval '1 day');
  GET DIAGNOSTICS affected = ROW_COUNT;

  UPDATE profiles SET streak_at_risk = true
  WHERE streak > 0 AND last_game_date = CURRENT_DATE - 1 AND streak_at_risk = false;

  RETURN affected;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.evaluate_streaks() FROM public;
REVOKE EXECUTE ON FUNCTION public.evaluate_streaks() FROM anon;
REVOKE EXECUTE ON FUNCTION public.evaluate_streaks() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.evaluate_streaks() TO service_role;

-- 4. Weekly Leagues table
CREATE TABLE IF NOT EXISTS public.weekly_leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles NOT NULL,
  league_tier text NOT NULL DEFAULT 'Rookie' CHECK (league_tier IN ('Rookie','Starter','Rotation','All-Star','MVP','GOAT')),
  league_group integer NOT NULL DEFAULT 0,
  week_start date NOT NULL,
  weekly_xp integer NOT NULL DEFAULT 0,
  final_rank integer,
  promoted boolean DEFAULT false,
  demoted boolean DEFAULT false,
  UNIQUE(user_id, week_start)
);
ALTER TABLE public.weekly_leagues ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users can read all league data" ON public.weekly_leagues FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert own league data" ON public.weekly_leagues FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can update own league data" ON public.weekly_leagues FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_weekly_leagues_week ON public.weekly_leagues(week_start, league_tier, league_group);
CREATE INDEX IF NOT EXISTS idx_weekly_leagues_user ON public.weekly_leagues(user_id, week_start);

-- 5. Trivia answer tracking (rarity score)
CREATE TABLE IF NOT EXISTS public.trivia_answer_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_date date NOT NULL,
  league text NOT NULL,
  question_index integer NOT NULL,
  total_attempts integer NOT NULL DEFAULT 0,
  correct_attempts integer NOT NULL DEFAULT 0,
  UNIQUE(game_date, league, question_index)
);
ALTER TABLE public.trivia_answer_stats ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can read trivia stats" ON public.trivia_answer_stats FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated can upsert trivia stats" ON public.trivia_answer_stats FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Authenticated can update trivia stats" ON public.trivia_answer_stats FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION public.record_trivia_answer(
  p_game_date date, p_league text, p_question_index integer, p_is_correct boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE v_stats trivia_answer_stats%ROWTYPE;
BEGIN
  INSERT INTO trivia_answer_stats (game_date, league, question_index, total_attempts, correct_attempts)
  VALUES (p_game_date, p_league, p_question_index, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END)
  ON CONFLICT (game_date, league, question_index) DO UPDATE
  SET total_attempts = trivia_answer_stats.total_attempts + 1,
      correct_attempts = trivia_answer_stats.correct_attempts + CASE WHEN p_is_correct THEN 1 ELSE 0 END
  RETURNING * INTO v_stats;

  RETURN jsonb_build_object(
    'total', v_stats.total_attempts,
    'correct', v_stats.correct_attempts,
    'percent_correct', CASE WHEN v_stats.total_attempts > 0 THEN ROUND((v_stats.correct_attempts::numeric / v_stats.total_attempts) * 100) ELSE 0 END
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.record_trivia_answer TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_trivia_answer TO anon;

-- 6. Lobby cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_lobbies()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE deleted_count integer;
BEGIN
  DELETE FROM public.game_lobbies WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_lobbies() FROM public;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_lobbies() FROM anon;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_lobbies() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_lobbies() TO service_role;

-- 7. Player attributes column for Mystery Player game
ALTER TABLE public.players_pool ADD COLUMN IF NOT EXISTS attributes jsonb;
COMMENT ON COLUMN public.players_pool.attributes IS 'Player attributes for Mystery Player guessing game';
CREATE INDEX IF NOT EXISTS idx_players_pool_name_league ON public.players_pool (name, league);

-- Done!
SELECT 'All migrations applied successfully' as status;
