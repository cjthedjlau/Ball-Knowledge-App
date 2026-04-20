-- Add JSONB attributes column to players_pool for the Mystery Player guessing game.
-- This replaces the hardcoded playerAttrs.ts data so attributes can be updated
-- without rebuilding the app.
--
-- The attributes column stores league-specific data:
--   NBA/NFL: { height, jersey, team, position, conference, college, age }
--   MLB:     { bat, throwing, country, team, position, division, age }
--   NHL:     { height, jersey, team, position, conference, country, age }

alter table public.players_pool
  add column if not exists attributes jsonb;

comment on column public.players_pool.attributes is
  'Player attributes for the Mystery Player guessing game (height, jersey, team, position, conference/division, college/country, age). Shape varies by league.';

-- Index for quick lookup by name + league when fetching attributes
create index if not exists idx_players_pool_name_league
  on public.players_pool (name, league);
