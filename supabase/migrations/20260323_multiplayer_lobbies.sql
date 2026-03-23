-- ============================================================
-- Multiplayer lobby system for Imposter, Wavelength, Draft
-- ============================================================

create table public.game_lobbies (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  game_type text not null check (game_type in ('imposter', 'wavelength', 'draft')),
  host_user_id uuid references public.profiles not null,
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'finished')),
  settings jsonb not null default '{}',
  game_state jsonb not null default '{}',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '2 hours')
);

create table public.lobby_players (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid references public.game_lobbies on delete cascade not null,
  user_id uuid references auth.users,
  display_name text not null,
  player_index integer not null,
  is_host boolean not null default false,
  is_ready boolean not null default false,
  joined_at timestamptz not null default now(),
  unique(lobby_id, player_index)
);

create index idx_game_lobbies_code on public.game_lobbies(code);
create index idx_lobby_players_lobby on public.lobby_players(lobby_id);

-- RLS
alter table public.game_lobbies enable row level security;
alter table public.lobby_players enable row level security;

-- Anyone can read lobbies (needed to join by code)
create policy "Anyone can read lobbies"
  on public.game_lobbies for select
  using (true);

-- Signed-in users can create lobbies
create policy "Signed-in users can create lobbies"
  on public.game_lobbies for insert
  with check (auth.uid() = host_user_id);

-- Host can update their own lobbies
create policy "Host can update own lobby"
  on public.game_lobbies for update
  using (auth.uid() = host_user_id);

-- Host can delete their own lobbies
create policy "Host can delete own lobby"
  on public.game_lobbies for delete
  using (auth.uid() = host_user_id);

-- Anyone can read lobby players
create policy "Anyone can read lobby players"
  on public.lobby_players for select
  using (true);

-- Anyone can join a lobby (insert themselves)
create policy "Anyone can join lobby"
  on public.lobby_players for insert
  with check (true);

-- Players can update their own row (ready toggle)
create policy "Players can update own row"
  on public.lobby_players for update
  using (auth.uid() = user_id or user_id is null);

-- Players can leave (delete own row)
create policy "Players can leave lobby"
  on public.lobby_players for delete
  using (auth.uid() = user_id or user_id is null);
