-- Weekly XP reset cron job
-- Resets weekly_xp to 0 for all users every Monday at 05:00 UTC (midnight ET).
-- This keeps the weekly leaderboard competitive and distinct from lifetime rankings.
--
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor).
-- Requires pg_cron extension (enabled by default on Supabase).
--
-- To verify the job is scheduled:
--   select * from cron.job where jobname = 'reset-weekly-xp';
--
-- To manually trigger a reset immediately (e.g. for testing):
--   update profiles set weekly_xp = 0;

create extension if not exists pg_cron;

-- Remove any previously scheduled job with this name
select cron.unschedule('reset-weekly-xp') where exists (
  select 1 from cron.job where jobname = 'reset-weekly-xp'
);

-- Schedule: every Monday at 05:00 UTC (midnight ET / 1:00 AM EDT)
select cron.schedule(
  'reset-weekly-xp',
  '0 5 * * 1',  -- 05:00 UTC every Monday
  $$
  update profiles set weekly_xp = 0;
  $$
);
