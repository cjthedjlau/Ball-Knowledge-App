// Seed crossover_grid data for all 4 leagues — 30 days each (120 total grids)
// Run with:
// SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-crossover.ts

import { createClient } from '@supabase/supabase-js'
import NBA_GRIDS from '../src/data/nba-crossover-grids'
import NFL_GRIDS from '../src/data/nfl-crossover-grids'
import MLB_GRIDS from '../src/data/mlb-crossover-grids'
import NHL_GRIDS from '../src/data/nhl-crossover-grids'

const SUPABASE_URL = 'https://scloxktkudutupiyqvbx.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required')
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-crossover.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function seed() {
  const startDate = new Date()

  let success = 0
  let failed = 0

  for (let day = 0; day < 30; day++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day)
    const dateStr = date.toISOString().split('T')[0]

    const grids = [
      NBA_GRIDS[day],
      NFL_GRIDS[day],
      MLB_GRIDS[day],
      NHL_GRIDS[day],
    ]

    for (const grid of grids) {
      if (!grid) {
        console.error(`⚠ Missing grid for day ${day} ${grid?.league ?? 'unknown'}`)
        failed++
        continue
      }

      // Upsert into daily_games — crossover_grid column stores the full grid as jsonb
      const { error } = await supabase
        .from('daily_games')
        .upsert(
          {
            date: dateStr,
            league: grid.league,
            crossover_grid: grid,
          },
          { onConflict: 'date,league' }
        )

      if (error) {
        console.error(`✗ ${dateStr} ${grid.league}: ${error.message}`)
        failed++
      } else {
        console.log(`✓ ${dateStr} ${grid.league}`)
        success++
      }
    }
  }

  console.log(`\nDone. ${success} seeded, ${failed} failed.`)
}

seed().catch(console.error)
