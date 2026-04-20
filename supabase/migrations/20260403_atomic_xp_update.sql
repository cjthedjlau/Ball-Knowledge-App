-- Atomic XP update to prevent read-modify-write race conditions
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
  -- Lock the row to prevent concurrent updates
  SELECT * INTO v_profile
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found for user %', p_user_id;
  END IF;

  -- Calculate streak
  IF v_profile.last_game_date = v_today THEN
    -- Already played today, don't change streak
    v_new_streak := v_profile.streak;
  ELSIF v_profile.last_game_date = v_today - 1 THEN
    -- Consecutive day
    v_new_streak := COALESCE(v_profile.streak, 0) + 1;
  ELSE
    -- Streak broken (or first game)
    v_new_streak := 1;
  END IF;

  -- Calculate level from new lifetime XP
  v_new_level := CASE
    WHEN COALESCE(v_profile.lifetime_xp, 0) + p_xp_earned >= 10000 THEN 5
    WHEN COALESCE(v_profile.lifetime_xp, 0) + p_xp_earned >= 5000 THEN 4
    WHEN COALESCE(v_profile.lifetime_xp, 0) + p_xp_earned >= 2000 THEN 3
    WHEN COALESCE(v_profile.lifetime_xp, 0) + p_xp_earned >= 500 THEN 2
    ELSE 1
  END;

  -- Atomic update
  UPDATE profiles
  SET
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

-- Grant to authenticated users
GRANT EXECUTE ON FUNCTION public.update_xp_and_streak TO authenticated;
