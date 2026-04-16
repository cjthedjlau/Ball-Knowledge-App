/**
 * Seed Supabase players_pool from playerAttrs.ts (the single source of truth).
 *
 * Reads NBA_ATTRS, NFL_ATTRS, MLB_ATTRS, NHL_ATTRS and upserts every player
 * into the `players_pool` table with:
 *   - name, team, league, position, tier, season
 *   - attributes JSONB column (full attribute object for Guesser game)
 *
 * Run with:
 *   SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-from-attrs.ts
 */

import { createClient } from '@supabase/supabase-js'
import {
  NBA_ATTRS,
  NFL_ATTRS,
  MLB_ATTRS,
  NHL_ATTRS,
  type NBAAttrs,
  type NFLAttrs,
  type MLBAttrs,
  type NHLAttrs,
} from '../src/lib/playerAttrs'

const SUPABASE_URL = 'https://scloxktkudutupiyqvbx.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required')
  console.error(
    'Usage: SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-from-attrs.ts',
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ── Helpers ──────────────────────────────────────────────────────────────────

/** NBA uses 3-letter abbreviations; expand to full name for the pool table */
const NBA_TEAM_FULL: Record<string, string> = {
  ATL: 'Atlanta Hawks',      BOS: 'Boston Celtics',       BKN: 'Brooklyn Nets',
  CHA: 'Charlotte Hornets',  CHI: 'Chicago Bulls',        CLE: 'Cleveland Cavaliers',
  DAL: 'Dallas Mavericks',   DEN: 'Denver Nuggets',       DET: 'Detroit Pistons',
  GSW: 'Golden State Warriors', HOU: 'Houston Rockets',   IND: 'Indiana Pacers',
  LAC: 'LA Clippers',        LAL: 'Los Angeles Lakers',   MEM: 'Memphis Grizzlies',
  MIA: 'Miami Heat',         MIL: 'Milwaukee Bucks',      MIN: 'Minnesota Timberwolves',
  NOP: 'New Orleans Pelicans', NYK: 'New York Knicks',    OKC: 'Oklahoma City Thunder',
  ORL: 'Orlando Magic',      PHI: 'Philadelphia 76ers',   PHX: 'Phoenix Suns',
  POR: 'Portland Trail Blazers', SAC: 'Sacramento Kings',  SAS: 'San Antonio Spurs',
  TOR: 'Toronto Raptors',    UTA: 'Utah Jazz',            WAS: 'Washington Wizards',
}

interface PoolRow {
  name: string
  team: string
  league: string
  position: string
  tier: 'normal' | 'ball_knowledge'
  season: string
  attributes: Record<string, unknown>
}

function nbaRows(): PoolRow[] {
  return Object.entries(NBA_ATTRS).map(([name, a]) => ({
    name,
    team: NBA_TEAM_FULL[a.team] ?? a.team,
    league: 'NBA',
    position: a.position,
    tier: 'normal',
    season: '2025-26',
    attributes: { ...a },
  }))
}

function nflRows(): PoolRow[] {
  return Object.entries(NFL_ATTRS).map(([name, a]) => ({
    name,
    team: a.team,
    league: 'NFL',
    position: a.position,
    tier: 'normal',
    season: '2025-26',
    attributes: { ...a },
  }))
}

function mlbRows(): PoolRow[] {
  return Object.entries(MLB_ATTRS).map(([name, a]) => ({
    name,
    team: a.team,
    league: 'MLB',
    position: a.position,
    tier: 'normal',
    season: '2025-26',
    attributes: { ...a },
  }))
}

function nhlRows(): PoolRow[] {
  return Object.entries(NHL_ATTRS).map(([name, a]) => ({
    name,
    team: a.team,
    league: 'NHL',
    position: a.position,
    tier: 'normal',
    season: '2025-26',
    attributes: { ...a },
  }))
}

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  const allRows = [...nbaRows(), ...nflRows(), ...mlbRows(), ...nhlRows()]

  console.log(`\nSeeding ${allRows.length} players into players_pool...\n`)
  console.log(`  NBA: ${nbaRows().length}`)
  console.log(`  NFL: ${nflRows().length}`)
  console.log(`  MLB: ${mlbRows().length}`)
  console.log(`  NHL: ${nhlRows().length}`)
  console.log()

  const batchSize = 50
  let successCount = 0
  let failCount = 0
  const errors: string[] = []

  for (let i = 0; i < allRows.length; i += batchSize) {
    const batch = allRows.slice(i, i + batchSize)

    const { error } = await supabase
      .from('players_pool')
      .upsert(batch, { onConflict: 'name,league' })

    if (error) {
      console.error(`  ✗ Batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`)
      errors.push(error.message)
      failCount += batch.length
    } else {
      successCount += batch.length
      process.stdout.write(`  ✓ ${Math.min(i + batchSize, allRows.length)}/${allRows.length}\r`)
    }
  }

  console.log(`\n\nDone.`)
  console.log(`  ✓ ${successCount} upserted`)
  if (failCount > 0) {
    console.log(`  ✗ ${failCount} failed`)
    console.log(`\nErrors:`)
    errors.forEach(e => console.log(`  - ${e}`))
  }
}

seed().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
