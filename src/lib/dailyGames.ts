// NOTE: The Edge Function cron schedule for generate-daily-games has been disabled.
// To re-disable if it gets re-scheduled, run in Supabase SQL Editor:
//   select cron.unschedule('generate-daily-games');
// Daily games are now seeded manually via: npx ts-node scripts/seed-daily-games.ts

import { supabase } from './supabase'

export async function getTodaysDailyGame(league: string) {
  const today = new Date().toISOString().split('T')[0]
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
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('daily_games')
    .select('date')
    .eq('league', league)
    .lt('date', today)
    .order('date', { ascending: false })
  if (error || !data) return []
  return data.map(d => d.date)
}
