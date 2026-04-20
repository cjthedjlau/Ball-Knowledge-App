-- Create friendships table for the friend code system
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_a, user_b)
);

-- Indexes for fast lookups in both directions
create index if not exists idx_friendships_user_a on public.friendships(user_a);
create index if not exists idx_friendships_user_b on public.friendships(user_b);

-- Enable RLS
alter table public.friendships enable row level security;

-- Users can read friendships they are part of
create policy "Users can read own friendships"
  on public.friendships for select
  using (auth.uid() = user_a or auth.uid() = user_b);

-- Users can insert friendships where they are user_a
create policy "Users can create friendships"
  on public.friendships for insert
  with check (auth.uid() = user_a);

-- Users can delete friendships they are part of
create policy "Users can delete own friendships"
  on public.friendships for delete
  using (auth.uid() = user_a or auth.uid() = user_b);
