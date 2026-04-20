import { supabase } from './supabase';

// ─── XP Constants ─────────────────────────────────────────────────────────────

export const XP_VALUES = {
  // Daily games - base
  MYSTERY_PLAYER_BASE: 500,
  SHOWDOWN_BASE: 500,
  BLIND_RANK_5_BASE: 500,
  TRIVIA_BASE: 500,
  // Daily games - performance bonus
  MYSTERY_PLAYER_PER_GUESS_REMAINING: 100, // max 600
  SHOWDOWN_CORRECT_PICK: 250,
  BLIND_RANK_5_PER_CORRECT_PLACEMENT: 100, // max 500
  TRIVIA_PER_CORRECT_ANSWER: 200, // max 1000
  // Multiplayer - diminishing per round
  MULTIPLAYER_ROUNDS: [300, 250, 200, 150, 100],
  // Streak bonus
  STREAK_BONUS_PER_GAME: 100,
};

export const LEVELS = [
  { level: 1,  name: 'Rookie',          xpRequired: 0 },       // Start here
  { level: 2,  name: 'Benchwarmer',     xpRequired: 10000 },   // ~3 days
  { level: 3,  name: 'Starter',         xpRequired: 25000 },   // ~1 week
  { level: 4,  name: 'Rotation Player', xpRequired: 50000 },   // ~2 weeks
  { level: 5,  name: 'Fan',             xpRequired: 85000 },   // ~3 weeks
  { level: 6,  name: 'Superfan',        xpRequired: 130000 },  // ~1 month
  { level: 7,  name: 'Scout',           xpRequired: 200000 },  // ~6 weeks
  { level: 8,  name: 'Analyst',         xpRequired: 300000 },  // ~2 months
  { level: 9,  name: 'Expert',          xpRequired: 425000 },  // ~3 months
  { level: 10, name: 'All-Star',        xpRequired: 600000 },  // ~4 months
  { level: 11, name: 'MVP',             xpRequired: 825000 },  // ~6 months
  { level: 12, name: 'Hall of Famer',   xpRequired: 1100000 }, // ~8 months
  { level: 13, name: 'Legend',           xpRequired: 1500000 }, // ~1 year
  { level: 14, name: 'GOAT',            xpRequired: 2000000 }, // ~1.5 years
  { level: 15, name: 'Ball Knowledge',  xpRequired: 2750000 }, // ~2 years
];

// ─── Level helpers ────────────────────────────────────────────────────────────

export function getLevelFromXP(xp: number): typeof LEVELS[number] {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  return current;
}

export function getXPToNextLevel(xp: number): number | null {
  const currentLevel = getLevelFromXP(xp);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  if (!nextLevel) return null;
  return nextLevel.xpRequired - xp;
}

// ─── XP Calculations ──────────────────────────────────────────────────────────

type GameType = 'mystery-player' | 'showdown' | 'blind-rank-5' | 'trivia';

interface Performance {
  guessesRemaining?: number;
  correctPick?: boolean;
  correctPlacements?: number;
  correctAnswers?: number;
}

export function calculateDailyGameXP(gameType: GameType, performance: Performance): number {
  switch (gameType) {
    case 'mystery-player': {
      const base = XP_VALUES.MYSTERY_PLAYER_BASE;
      const bonus = (performance.guessesRemaining ?? 0) * XP_VALUES.MYSTERY_PLAYER_PER_GUESS_REMAINING;
      return base + bonus;
    }
    case 'showdown': {
      const base = XP_VALUES.SHOWDOWN_BASE;
      const bonus = performance.correctPick ? XP_VALUES.SHOWDOWN_CORRECT_PICK : 0;
      return base + bonus;
    }
    case 'blind-rank-5': {
      const base = XP_VALUES.BLIND_RANK_5_BASE;
      const bonus = (performance.correctPlacements ?? 0) * XP_VALUES.BLIND_RANK_5_PER_CORRECT_PLACEMENT;
      return base + bonus;
    }
    case 'trivia': {
      const base = XP_VALUES.TRIVIA_BASE;
      const bonus = (performance.correctAnswers ?? 0) * XP_VALUES.TRIVIA_PER_CORRECT_ANSWER;
      return base + bonus;
    }
    default:
      return 0;
  }
}

export function calculateMultiplayerXP(roundsPlayed: number): number {
  return XP_VALUES.MULTIPLAYER_ROUNDS
    .slice(0, roundsPlayed)
    .reduce((sum, xp) => sum + xp, 0);
}

// ─── Supabase persistence ─────────────────────────────────────────────────────

export async function saveGameResult(
  userId: string,
  gameType: string,
  xpEarned: number,
  score: number,
): Promise<void> {
  const { error: sessionError } = await supabase.from('game_sessions').insert({
    user_id: userId,
    game_type: gameType,
    xp_earned: xpEarned,
    score,
  });
  if (sessionError) {
    console.error('[XP] Failed to save game session:', sessionError.message);
  }
}

export async function updateUserXPAndStreak(
  userId: string,
  xpEarned: number,
  isDailyGame: boolean = false,
): Promise<{ lifetime_xp: number; weekly_xp: number; streak: number; brain_level: number } | null> {
  const { data, error } = await supabase.rpc('update_xp_and_streak', {
    p_user_id: userId,
    p_xp_earned: xpEarned,
    p_is_daily: isDailyGame,
  });

  if (error) {
    console.error('[XP] Failed to update XP:', error.message);
    return null;
  }

  return data as { lifetime_xp: number; weekly_xp: number; streak: number; brain_level: number };
}

/**
 * Recalculate lifetime_xp by summing all xp_earned from game_sessions.
 * Use this to recover XP that was lost due to profile resets.
 * Only updates if the recalculated total is higher than the current value.
 */
export async function recalculateLifetimeXP(userId: string): Promise<number | null> {
  // Sum all xp_earned from game_sessions for this user
  const { data: sessions, error: sessionsError } = await supabase
    .from('game_sessions')
    .select('xp_earned')
    .eq('user_id', userId);

  if (sessionsError || !sessions) {
    console.error('[XP] Failed to fetch game_sessions for recalculation:', sessionsError?.message);
    return null;
  }

  const totalXP = sessions.reduce((sum, s) => sum + (s.xp_earned ?? 0), 0);

  if (totalXP <= 0) {
    console.log('[XP] No XP found in game_sessions for user:', userId);
    return null;
  }

  // Only update if recalculated total is higher than current profile value
  const { data: profile } = await supabase
    .from('profiles')
    .select('lifetime_xp')
    .eq('id', userId)
    .single();

  const currentXP = profile?.lifetime_xp ?? 0;

  if (totalXP > currentXP) {
    const newLevel = getLevelFromXP(totalXP).level;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ lifetime_xp: totalXP, level: newLevel })
      .eq('id', userId);

    if (updateError) {
      console.error('[XP] Failed to update recalculated XP:', updateError.message);
      return null;
    }
    console.log(`[XP] Recalculated XP for user ${userId}: ${currentXP} → ${totalXP}`);
    return totalXP;
  }

  return currentXP;
}

export async function checkAndUpdateStreakAtRisk(userId: string): Promise<void> {
  const now = new Date();
  const utcHour = now.getUTCHours();

  // Only flag at-risk between midnight UTC (0) and noon UTC (12)
  if (utcHour < 0 || utcHour >= 12) return;

  const todayUTC = now.toISOString().slice(0, 10);

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('last_game_date, streak')
    .eq('id', userId)
    .single();

  if (error || !profile) return;

  // If they haven't played today and have a streak to protect, flag it
  if (profile.last_game_date !== todayUTC && (profile.streak ?? 0) > 0) {
    await supabase
      .from('profiles')
      .update({ streak_at_risk: true })
      .eq('id', userId);
  }
}
