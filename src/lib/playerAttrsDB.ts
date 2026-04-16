/**
 * Database-backed player attributes for the Mystery Player guessing game.
 *
 * Fetches attributes from the Supabase `players_pool` table (JSONB `attributes` column)
 * with an in-memory cache matching the pattern in playersPool.ts.
 * Falls back to the hardcoded playerAttrs.ts if the DB fetch fails.
 */

import { supabase } from './supabase';
import {
  NBA_ATTRS,
  NFL_ATTRS,
  MLB_ATTRS,
  NHL_ATTRS,
  type NBAAttrs,
  type NFLAttrs,
  type MLBAttrs,
  type NHLAttrs,
  type PlayerAttrs,
} from './playerAttrs';

// ── Types (re-exported so consumers don't need to import from playerAttrs) ──

export type { NBAAttrs, NFLAttrs, MLBAttrs, NHLAttrs, PlayerAttrs };

type League = 'NBA' | 'NFL' | 'MLB' | 'NHL';

type LeagueAttrsMap = {
  NBA: Record<string, NBAAttrs>;
  NFL: Record<string, NFLAttrs>;
  MLB: Record<string, MLBAttrs>;
  NHL: Record<string, NHLAttrs>;
};

// ── Cache (same TTL pattern as playersPool.ts) ──────────────────────────────

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Partial<Record<League, CacheEntry<Record<string, PlayerAttrs>>>> = {};

// ── Hardcoded fallback map ──────────────────────────────────────────────────

const HARDCODED: LeagueAttrsMap = {
  NBA: NBA_ATTRS,
  NFL: NFL_ATTRS,
  MLB: MLB_ATTRS,
  NHL: NHL_ATTRS,
};

// ── Fetch from DB ───────────────────────────────────────────────────────────

async function fetchAttrsFromDB(league: League): Promise<Record<string, PlayerAttrs> | null> {
  try {
    const { data, error } = await supabase
      .from('players_pool')
      .select('name, attributes')
      .eq('league', league)
      .not('attributes', 'is', null);

    if (error || !data || data.length === 0) {
      return null;
    }

    const map: Record<string, PlayerAttrs> = {};
    for (const row of data) {
      if (row.name && row.attributes) {
        map[row.name] = row.attributes as PlayerAttrs;
      }
    }

    return Object.keys(map).length > 0 ? map : null;
  } catch {
    return null;
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns the full attribute map for a league.
 * Tries Supabase first (with cache), falls back to hardcoded data.
 */
export async function getLeagueAttrs(league: League): Promise<Record<string, PlayerAttrs>> {
  // Check cache
  const entry = cache[league];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }

  // Try DB
  const dbAttrs = await fetchAttrsFromDB(league);
  if (dbAttrs) {
    cache[league] = { data: dbAttrs, timestamp: Date.now() };
    return dbAttrs;
  }

  // Fallback to hardcoded
  const fallback = HARDCODED[league] as Record<string, PlayerAttrs>;
  cache[league] = { data: fallback, timestamp: Date.now() };
  return fallback;
}

/**
 * Returns attributes for a single player.
 * Drop-in replacement for the old `getPlayerAttrs(name, league)` pattern.
 */
export async function getPlayerAttrs(name: string, league: League): Promise<PlayerAttrs | null> {
  const map = await getLeagueAttrs(league);
  return map[name] ?? null;
}

/**
 * Returns the attribute map for the league, keyed by player name.
 * Convenience aliases that match the old constant names for easy migration.
 */
export async function getNBAAttrs(): Promise<Record<string, NBAAttrs>> {
  return (await getLeagueAttrs('NBA')) as Record<string, NBAAttrs>;
}

export async function getNFLAttrs(): Promise<Record<string, NFLAttrs>> {
  return (await getLeagueAttrs('NFL')) as Record<string, NFLAttrs>;
}

export async function getMLBAttrs(): Promise<Record<string, MLBAttrs>> {
  return (await getLeagueAttrs('MLB')) as Record<string, MLBAttrs>;
}

export async function getNHLAttrs(): Promise<Record<string, NHLAttrs>> {
  return (await getLeagueAttrs('NHL')) as Record<string, NHLAttrs>;
}
