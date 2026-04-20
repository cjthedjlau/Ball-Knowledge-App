-- Weekly Leagues: promotion/demotion system
-- Tiers (ascending): Rookie → Starter → Rotation → All-Star → MVP → GOAT
-- Groups of ~30 players per tier, top 5 promote, bottom 5 demote each week

CREATE TABLE public.weekly_leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles NOT NULL,
  league_tier text NOT NULL DEFAULT 'Rookie' CHECK (league_tier IN ('Rookie','Starter','Rotation','All-Star','MVP','GOAT')),
  league_group integer NOT NULL DEFAULT 0,  -- which group of ~30 they're in
  week_start date NOT NULL,  -- Monday of the current week
  weekly_xp integer NOT NULL DEFAULT 0,
  final_rank integer,  -- set at end of week
  promoted boolean DEFAULT false,
  demoted boolean DEFAULT false,
  UNIQUE(user_id, week_start)
);

ALTER TABLE public.weekly_leagues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all league data" ON public.weekly_leagues FOR SELECT USING (true);
CREATE POLICY "Users can insert own league data" ON public.weekly_leagues FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own league data" ON public.weekly_leagues FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_weekly_leagues_week ON public.weekly_leagues(week_start, league_tier, league_group);
CREATE INDEX idx_weekly_leagues_user ON public.weekly_leagues(user_id, week_start);
