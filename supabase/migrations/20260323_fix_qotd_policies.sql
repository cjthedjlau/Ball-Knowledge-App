-- ============================================================
-- Fix: Add missing RLS policies that prevent QotD submissions
-- ============================================================

-- 1. Allow authenticated users to insert questions
--    (the client auto-inserts from the question bank when no row exists for today)
drop policy if exists "qotd_questions_insert" on public.qotd_questions;
create policy "qotd_questions_insert"
  on public.qotd_questions for insert
  with check (auth.uid() is not null);

-- 2. Allow users to update their own responses (required for upsert)
drop policy if exists "qotd_responses_update" on public.qotd_responses;
create policy "qotd_responses_update"
  on public.qotd_responses for update
  using (auth.uid() = user_id);
