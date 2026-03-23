import { supabase } from './supabase'

/**
 * Returns today's date string in America/New_York time (YYYY-MM-DD).
 * Daily games reset at midnight ET, so all clients must agree on the same
 * "current date" regardless of the device's local timezone.
 *
 * Uses 'en-CA' locale which natively outputs YYYY-MM-DD, avoiding
 * the unreliable toLocaleString → re-parse approach.
 */
function getTodayEST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

export async function getTodaysDailyGame(league: string) {
  const today = getTodayEST()
  const { data, error } = await supabase
    .from('daily_games')
    .select('*')
    .eq('date', today)
    .eq('league', league)
    .single()
  if (error || !data) return null
  return data
}

export async function getArchiveGame(league: string, date: string) {
  const { data, error } = await supabase
    .from('daily_games')
    .select('*')
    .eq('date', date)
    .eq('league', league)
    .single()
  if (error || !data) return null
  return data
}

export async function getAvailableArchiveDates(league: string) {
  const today = getTodayEST()
  const { data, error } = await supabase
    .from('daily_games')
    .select('date')
    .eq('league', league)
    .lt('date', today)
    .order('date', { ascending: false })
  if (error || !data) return []
  return data.map(d => d.date)
}
