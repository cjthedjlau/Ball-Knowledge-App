-- Question of the Day tables

-- Daily questions (one per day, seeded or generated)
create table if not exists public.qotd_questions (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  question text not null,
  created_at timestamptz not null default now()
);

-- User responses
create table if not exists public.qotd_responses (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.qotd_questions not null,
  user_id uuid references public.profiles not null,
  body text not null check (char_length(body) <= 280),
  created_at timestamptz not null default now(),
  unique(question_id, user_id)
);

-- RLS
alter table public.qotd_questions enable row level security;
alter table public.qotd_responses enable row level security;

-- Anyone can read questions
create policy "qotd_questions_read" on public.qotd_questions for select using (true);

-- Anyone can read responses
create policy "qotd_responses_read" on public.qotd_responses for select using (true);

-- Authenticated users can insert their own response
create policy "qotd_responses_insert" on public.qotd_responses
  for insert with check (auth.uid() = user_id);
