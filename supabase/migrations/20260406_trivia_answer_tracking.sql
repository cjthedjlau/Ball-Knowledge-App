-- Trivia answer tracking for rarity score system
-- Tracks how many players attempt each question and how many get it right

CREATE TABLE public.trivia_answer_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_date date NOT NULL,
  league text NOT NULL,
  question_index integer NOT NULL,  -- 0, 1, or 2 (3 questions per game)
  total_attempts integer NOT NULL DEFAULT 0,
  correct_attempts integer NOT NULL DEFAULT 0,
  UNIQUE(game_date, league, question_index)
);

ALTER TABLE public.trivia_answer_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read trivia stats" ON public.trivia_answer_stats FOR SELECT USING (true);
CREATE POLICY "Authenticated can upsert trivia stats" ON public.trivia_answer_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update trivia stats" ON public.trivia_answer_stats FOR UPDATE USING (true);

-- RPC to atomically increment answer counts
CREATE OR REPLACE FUNCTION public.record_trivia_answer(
  p_game_date date,
  p_league text,
  p_question_index integer,
  p_is_correct boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stats trivia_answer_stats%ROWTYPE;
BEGIN
  INSERT INTO trivia_answer_stats (game_date, league, question_index, total_attempts, correct_attempts)
  VALUES (p_game_date, p_league, p_question_index, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END)
  ON CONFLICT (game_date, league, question_index) DO UPDATE
  SET total_attempts = trivia_answer_stats.total_attempts + 1,
      correct_attempts = trivia_answer_stats.correct_attempts + CASE WHEN p_is_correct THEN 1 ELSE 0 END
  RETURNING * INTO v_stats;

  RETURN jsonb_build_object(
    'total', v_stats.total_attempts,
    'correct', v_stats.correct_attempts,
    'percent_correct', CASE WHEN v_stats.total_attempts > 0 THEN ROUND((v_stats.correct_attempts::numeric / v_stats.total_attempts) * 100) ELSE 0 END
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_trivia_answer TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_trivia_answer TO anon;
