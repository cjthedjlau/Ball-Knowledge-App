-- ============================================================
-- Guest player session tokens
-- Allows unauthenticated players to toggle ready and leave lobbies
-- without requiring a Supabase auth session.
--
-- Each lobby_players row gets a random session_token on insert.
-- Guest operations (ready toggle, leave) go through RPC functions
-- that verify the token, bypassing RLS safely.
-- ============================================================

-- 1. Add session_token column (auto-generated on insert)
alter table public.lobby_players
  add column if not exists session_token uuid not null default gen_random_uuid();

-- 2. RPC: Guest toggle ready
create or replace function public.guest_toggle_ready(
  p_player_id uuid,
  p_session_token uuid,
  p_is_ready boolean
)
returns void
language plpgsql
security definer
as $$
begin
  update public.lobby_players
  set is_ready = p_is_ready
  where id = p_player_id
    and user_id is null
    and session_token = p_session_token;

  if not found then
    raise exception 'Player not found or session token mismatch';
  end if;
end;
$$;

-- 3. RPC: Guest leave lobby
create or replace function public.guest_leave_lobby(
  p_player_id uuid,
  p_session_token uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_is_host boolean;
  v_lobby_id uuid;
begin
  select is_host, lobby_id into v_is_host, v_lobby_id
  from public.lobby_players
  where id = p_player_id
    and user_id is null
    and session_token = p_session_token;

  if not found then
    raise exception 'Player not found or session token mismatch';
  end if;

  if v_is_host then
    -- Host leaving deletes the entire lobby (cascade removes all players)
    delete from public.game_lobbies where id = v_lobby_id;
  else
    delete from public.lobby_players where id = p_player_id;
  end if;
end;
$$;

-- 4. Grant execute to both anon and authenticated roles
grant execute on function public.guest_toggle_ready(uuid, uuid, boolean) to anon;
grant execute on function public.guest_toggle_ready(uuid, uuid, boolean) to authenticated;
grant execute on function public.guest_leave_lobby(uuid, uuid) to anon;
grant execute on function public.guest_leave_lobby(uuid, uuid) to authenticated;
