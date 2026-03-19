// Migrate playersPool.ts → Supabase players_pool table.
// Imports ALL_PLAYERS directly from src/lib/playersPool.ts — single source of truth.
//
// Run with:
// SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-players-pool.ts

import { createClient } from '@supabase/supabase-js'
import { ALL_PLAYERS } from '../src/lib/playersPool'

const SUPABASE_URL = 'https://scloxktkudutupiyqvbx.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required')
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-players-pool.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ---------------------------------------------------------------------------
// Seed function
// ---------------------------------------------------------------------------

async function seed() {
  console.log(`Seeding ${ALL_PLAYERS.length} players...`)

  const batchSize = 50
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < ALL_PLAYERS.length; i += batchSize) {
    const batch = ALL_PLAYERS.slice(i, i + batchSize)

    const rows = batch.map(p => ({
      name: p.name,
      team: p.team,
      league: p.league,
      position: p.position,
      tier: p.tier,
      season: p.season,
      weight: null,
      college: null,
      stats: {},
    }))

    const { error } = await supabase
      .from('players_pool')
      .upsert(rows, { onConflict: 'name,league' })

    if (error) {
      console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, error.message)
      failCount += batch.length
    } else {
      successCount += batch.length
      console.log(`Batch ${Math.floor(i / batchSize) + 1} done — ${Math.min(i + batchSize, ALL_PLAYERS.length)}/${ALL_PLAYERS.length}`)
    }
  }

  console.log(`\nDone. ✓ ${successCount} seeded, ✗ ${failCount} failed.`)
}

seed()
