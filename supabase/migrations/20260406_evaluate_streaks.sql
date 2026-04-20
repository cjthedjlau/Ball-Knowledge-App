-- Evaluate streaks: reset streaks for users who missed more than 1 day.
-- Designed to run as a cron job at midnight ET via pg_cron or an Edge Function.

CREATE OR REPLACE FUNCTION public.evaluate_streaks()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected integer;
BEGIN
  -- Reset streak to 0 for users whose last_game_date is more than 1 day ago
  UPDATE profiles
  SET
    streak = 0,
    streak_at_risk = false
  WHERE streak > 0
    AND last_game_date IS NOT NULL
    AND last_game_date < (CURRENT_DATE - interval '1 day');

  GET DIAGNOSTICS affected = ROW_COUNT;

  -- Flag streaks as at-risk for users who played yesterday but not today
  UPDATE profiles
  SET streak_at_risk = true
  WHERE streak > 0
    AND last_game_date = CURRENT_DATE - 1
    AND streak_at_risk = false;

  RETURN affected;
END;
$$;

-- Only callable by service_role (cron/edge function)
REVOKE EXECUTE ON FUNCTION public.evaluate_streaks() FROM public;
REVOKE EXECUTE ON FUNCTION public.evaluate_streaks() FROM anon;
REVOKE EXECUTE ON FUNCTION public.evaluate_streaks() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.evaluate_streaks() TO service_role;

-- If pg_cron is available, schedule at midnight ET (5:00 UTC during EDT, 4:00 UTC during EST):
-- SELECT cron.schedule('evaluate-streaks', '0 5 * * *', 'SELECT public.evaluate_streaks()');
