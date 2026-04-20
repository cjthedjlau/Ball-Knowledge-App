-- Add 'hot-take-showdown' as an allowed game_type for multiplayer lobbies
ALTER TABLE public.game_lobbies DROP CONSTRAINT IF EXISTS game_lobbies_game_type_check;
ALTER TABLE public.game_lobbies ADD CONSTRAINT game_lobbies_game_type_check
  CHECK (game_type IN ('imposter', 'wavelength', 'draft', 'hot-take-showdown'));
