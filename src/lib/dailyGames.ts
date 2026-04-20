import { supabase } from './supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Returns today's date string in America/New_York time (YYYY-MM-DD).
 * Daily games reset at midnight ET, so all clients must agree on the same
 * "current date" regardless of the device's local timezone.
 */
function getTodayEST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

function cacheKey(date: string, league: string): string {
  return `bk_daily_game_${date}_${league}`
}

async function getCached(date: string, league: string) {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(date, league))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

async function setCache(date: string, league: string, data: any) {
  try {
    await AsyncStorage.setItem(cacheKey(date, league), JSON.stringify(data))
  } catch {}
}

export async function getTodaysDailyGame(league: string) {
  const today = getTodayEST()
  try {
    const { data, error } = await supabase
      .from('daily_games')
      .select('*')
      .eq('date', today)
      .eq('league', league)
      .single()
    if (error || !data) {
      // Network or DB error — try cache
      return await getCached(today, league)
    }
    // Cache fresh data for offline use
    await setCache(today, league, data)
    return data
  } catch {
    // Network totally down — try cache
    return await getCached(today, league)
  }
}

export async function getArchiveGame(league: string, date: string) {
  try {
    const { data, error } = await supabase
      .from('daily_games')
      .select('*')
      .eq('date', date)
      .eq('league', league)
      .single()
    if (error || !data) return await getCached(date, league)
    await setCache(date, league, data)
    return data
  } catch {
    return await getCached(date, league)
  }
}

/** Remove cached game data older than 7 days to prevent storage bloat */
export async function cleanStaleCache() {
  try {
    const keys = await AsyncStorage.getAllKeys()
    const gameKeys = keys.filter(k => k.startsWith('bk_daily_game_'))
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 7)
    const cutoffStr = cutoff.toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
    const stale = gameKeys.filter(k => {
      const date = k.split('_')[3] // bk_daily_game_YYYY-MM-DD_LEAGUE
      return date && date < cutoffStr
    })
    if (stale.length > 0) await AsyncStorage.multiRemove(stale)
  } catch {}
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
