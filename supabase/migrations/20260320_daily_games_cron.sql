-- Daily game auto-generation cron job
-- Runs at midnight ET (05:00 UTC) every night, generating the next day's games.
-- This ensures games are ready immediately when the new day starts.
--
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor).
-- Requires pg_cron and pg_net extensions, which are enabled by default on Supabase.
--
-- To verify the job is scheduled:
--   select * from cron.job;
--
-- To manually trigger immediately (generates tomorrow's games):
--   select net.http_post(
--     url := '<your-supabase-url>/functions/v1/generate-daily-games',
--     headers := '{"Authorization": "Bearer <your-service-role-key>", "Content-Type": "application/json"}',
--     body := '{}'
--   );
--
-- To generate for a specific date (e.g. today, for backfilling):
--   select net.http_post(
--     url := '<your-supabase-url>/functions/v1/generate-daily-games',
--     headers := '{"Authorization": "Bearer <your-service-role-key>", "Content-Type": "application/json"}',
--     body := '{"date": "2026-03-20"}'
--   );

-- Enable required extensions (already on by default in Supabase)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Remove any previously scheduled job with this name
select cron.unschedule('generate-daily-games') where exists (
  select 1 from cron.job where jobname = 'generate-daily-games'
);

-- Schedule: 05:00 UTC = midnight ET (UTC-5 EST) / 1:00 AM ET (UTC-4 EDT).
-- Fires right at midnight in winter and 1 AM in summer — games are always ready by morning.
select cron.schedule(
  'generate-daily-games',
  '0 5 * * *',  -- 05:00 UTC daily (midnight ET)
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_url') || '/functions/v1/generate-daily-games',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key'),
      'Content-Type', 'application/json',
      'x-pg-cron', '1'
    ),
    body := '{}'::jsonb
  );
  $$
);
