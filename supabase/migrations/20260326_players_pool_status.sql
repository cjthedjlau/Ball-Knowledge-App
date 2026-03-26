-- Add status column to players_pool to distinguish active vs retired players.
-- Default 'active' so all existing rows are treated as active.
-- Daily game generation will filter by status = 'active' to exclude retired players.

alter table public.players_pool
  add column if not exists status text not null default 'active';

-- Add a check constraint for valid values
alter table public.players_pool
  add constraint players_pool_status_check
  check (status in ('active', 'retired', 'legend'));

comment on column public.players_pool.status is 'active | retired | legend — only active players are used for daily mystery player, showdown, and rank 5';
