import { supabase } from './supabase'

// Returns today's date as YYYY-MM-DD in America/New_York (EST/EDT).
// All daily game resets happen at midnight Eastern time.
export function getTodayEST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

// Save a completed game result
export async function saveGameResult(
  league: string,
  gameType: 'mystery-player' | 'showdown' | 'blind-rank-5' | 'trivia' | 'power-play',
  score: number,
  xpEarned: number
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const today = getTodayEST()
  const { data, error } = await supabase
    .from('user_game_results')
    .upsert({
      user_id: user.id,
      date: today,
      league,
      game_type: gameType,
      completed: true,
      score,
      xp_earned: xpEarned
    }, { onConflict: 'user_id,date,league,game_type' })
  if (error) {
    console.error('Failed to save game result:', error.message)
    return null
  }
  return data
}

// Get today's completed games for the current user
export async function getTodaysCompletedGames() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const today = getTodayEST()
  const { data, error } = await supabase
    .from('user_game_results')
    .select('game_type, league, score, xp_earned')
    .eq('user_id', user.id)
    .eq('date', today)
  return error ? [] : data
}

// Check if a specific game is already completed today
export async function isGameCompletedToday(
  league: string,
  gameType: string
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const today = getTodayEST()
  const { data } = await supabase
    .from('user_game_results')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', today)
    .eq('league', league)
    .eq('game_type', gameType)
    .single()
  return !!data
}

// Get today's result for a specific game (score + xp) or null if not played
export async function getGameResultToday(
  league: string,
  gameType: string
): Promise<{ score: number; xp: number } | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const today = getTodayEST()
  const { data } = await supabase
    .from('user_game_results')
    .select('score, xp_earned')
    .eq('user_id', user.id)
    .eq('date', today)
    .eq('league', league)
    .eq('game_type', gameType)
    .single()
  if (!data) return null
  return { score: data.score, xp: data.xp_earned }
}
