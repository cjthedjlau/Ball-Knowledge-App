import { supabase } from './supabase';

export type Player = {
  id: string;
  name: string;
  team: string;
  league: string;
  position: string;
  season: string;
  tier: 'normal' | 'ball_knowledge' | 'legend';
  status: 'active' | 'retired' | 'legend';
};

// Cache to avoid repeat queries in the same session
const cache: Record<string, Player[]> = {};

async function fetchPlayers(league: string): Promise<Player[]> {
  if (cache[league]) return cache[league];

  const { data, error } = await supabase
    .from('players_pool')
    .select('id, name, team, league, position, tier, season')
    .eq('league', league);

  if (error || !data) {
    console.error('Failed to fetch players:', error?.message);
    return [];
  }

  // Default status to 'active' — status column will be added via migration later
  cache[league] = (data as any[]).map(p => ({ ...p, status: p.status ?? 'active' })) as Player[];
  return cache[league];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** Active players only — for Mystery Player autocomplete, Custom Mystery, Daily games */
export async function getActivePlayers(league: string): Promise<Player[]> {
  const players = await fetchPlayers(league);
  return players.filter(p => (p.tier === 'normal' || p.tier === 'ball_knowledge') && p.status === 'active');
}

/** Normal tier only — for Trivia, Blind Showdown, Blind Rank 5 seed suggestions */
export async function getNormalPlayers(league: string): Promise<Player[]> {
  const players = await fetchPlayers(league);
  return players.filter(p => p.tier === 'normal');
}

/** Legends only — for Imposter and Who Am I */
export async function getLegendPlayers(league: string): Promise<Player[]> {
  const players = await fetchPlayers(league);
  return players.filter(p => p.tier === 'legend');
}

/** Combined normal + legends — for Who Am I and Imposter (mix of current stars + legends) */
export async function getGamePlayers(league: string): Promise<Player[]> {
  const players = await fetchPlayers(league);
  return players.filter(p => p.tier === 'normal' || p.tier === 'legend');
}

/** Random N players from active pool */
export async function getRandomPlayers(league: string, count: number): Promise<Player[]> {
  const players = await getActivePlayers(league);
  return shuffle(players).slice(0, count);
}

/** Single random player from game pool */
export async function getRandomPlayer(league: string): Promise<Player | null> {
  const players = await getGamePlayers(league);
  return shuffle(players)[0] ?? null;
}
