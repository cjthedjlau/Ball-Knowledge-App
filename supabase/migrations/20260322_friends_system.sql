-- Add invite_code and friend_ids to profiles
alter table public.profiles
  add column if not exists invite_code text unique,
  add column if not exists friend_ids uuid[] not null default '{}';

-- Index for fast invite code lookups
create index if not exists idx_profiles_invite_code on public.profiles (invite_code) where invite_code is not null;

-- RPC function to add friends bidirectionally
create or replace function public.add_friend(user_a uuid, user_b uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Check if already friends
  if user_b = any(
    select unnest(friend_ids) from public.profiles where id = user_a
  ) then
    raise exception 'already friends';
  end if;

  -- Add user_b to user_a's friend list
  update public.profiles
  set friend_ids = array_append(friend_ids, user_b)
  where id = user_a;

  -- Add user_a to user_b's friend list
  update public.profiles
  set friend_ids = array_append(friend_ids, user_a)
  where id = user_b;
end;
$$;
