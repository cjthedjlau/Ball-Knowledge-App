/**
 * Seeds daily games for all 4 leagues at once.
 *
 * Run with:
 *   SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-all-leagues.ts
 *
 * Safe to run multiple times — uses upsert so existing rows are updated, not duplicated.
 */

import { createClient } from '@supabase/supabase-js'
import { execSync } from 'child_process'

const SUPABASE_URL = 'https://scloxktkudutupiyqvbx.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required')
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your-key npx ts-node --project scripts/tsconfig.json scripts/seed-all-leagues.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ── Verify connection ────────────────────────────────────────────────────────

const { error: pingError } = await (supabase.from('daily_games').select('date').limit(1))
if (pingError) {
  console.error('Failed to connect to Supabase:', pingError.message)
  process.exit(1)
}

// ── Run each league script in sequence ──────────────────────────────────────

const scripts = ['seed-nba', 'seed-nfl', 'seed-mlb', 'seed-nhl']
const tsnode = 'npx ts-node --project scripts/tsconfig.json'

for (const script of scripts) {
  console.log(`\n▶ Seeding ${script.replace('seed-', '').toUpperCase()}...`)
  try {
    execSync(`${tsnode} scripts/${script}.ts`, {
      env: { ...process.env, SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_KEY },
      stdio: 'inherit',
    })
    console.log(`✓ ${script} done`)
  } catch (e) {
    console.error(`✗ ${script} failed`)
    process.exit(1)
  }
}

console.log('\n✅ All leagues seeded successfully.')
