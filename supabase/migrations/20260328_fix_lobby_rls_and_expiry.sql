-- ============================================================
-- Fix #9: Tighten RLS for guest players
-- Fix #13: Add lobby expiry cleanup function
-- ============================================================

-- Fix #9: The old policies allowed ANY user to update/delete rows where
-- user_id IS NULL (guest players). Replace with policies that only allow
-- the lobby host to manage guest rows, or the player to manage their own.

drop policy if exists "Players can update own row" on public.lobby_players;
drop policy if exists "Players can leave lobby" on public.lobby_players;

-- Players can update their own row (signed-in users only match on auth.uid())
create policy "Players can update own row"
  on public.lobby_players for update
  using (auth.uid() = user_id);

-- Host can update any player row in their lobby (needed for guest management)
create policy "Host can update lobby players"
  on public.lobby_players for update
  using (
    exists (
      select 1 from public.game_lobbies
      where game_lobbies.id = lobby_players.lobby_id
        and game_lobbies.host_user_id = auth.uid()
    )
  );

-- Players can leave (delete own row, signed-in only)
create policy "Players can leave lobby"
  on public.lobby_players for delete
  using (auth.uid() = user_id);

-- Host can remove any player from their lobby (cascade delete handles this
-- when deleting the lobby, but this covers kicking individual players)
create policy "Host can remove lobby players"
  on public.lobby_players for delete
  using (
    exists (
      select 1 from public.game_lobbies
      where game_lobbies.id = lobby_players.lobby_id
        and game_lobbies.host_user_id = auth.uid()
    )
  );

-- ============================================================
-- Fix #13: Lobby expiry cleanup
-- Periodically delete lobbies that have passed their expires_at timestamp.
-- This can be called via pg_cron or a Supabase Edge Function cron.
-- ============================================================

create or replace function public.cleanup_expired_lobbies()
returns integer
language plpgsql
security definer
as $$
declare
  deleted_count integer;
begin
  delete from public.game_lobbies
  where expires_at < now()
  returning 1 into deleted_count;

  -- Count won't work with RETURNING like that, use GET DIAGNOSTICS
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

-- Grant execute to service_role only (called by cron/edge function, not clients)
revoke execute on function public.cleanup_expired_lobbies() from public;
revoke execute on function public.cleanup_expired_lobbies() from anon;
revoke execute on function public.cleanup_expired_lobbies() from authenticated;
grant execute on function public.cleanup_expired_lobbies() to service_role;

-- If pg_cron is available, schedule cleanup every 30 minutes:
-- select cron.schedule('cleanup-expired-lobbies', '*/30 * * * *', 'select public.cleanup_expired_lobbies()');
