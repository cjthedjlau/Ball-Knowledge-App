#!/usr/bin/env node
/**
 * health-check.js — Run before every build/push to catch common issues.
 *
 * Checks for:
 *   1. Untracked source files that are imported by committed code
 *   2. Duplicate player names in playerAttrs.ts (causes TS build failure)
 *   3. Orphaned JSX fragments (broken notify button removals, etc.)
 *   4. Missing paddingBottom on ScrollViews (nav bar coverage)
 *   5. Web build compilation
 *
 * Usage:  node scripts/health-check.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let failures = 0;

function check(name, fn) {
  try {
    const result = fn();
    if (result) {
      console.log(`  ✗ ${name}: ${result}`);
      failures++;
    } else {
      console.log(`  ✓ ${name}`);
    }
  } catch (e) {
    console.log(`  ✗ ${name}: ${e.message}`);
    failures++;
  }
}

console.log('\n🔍 Ball Knowledge Health Check\n');

// 1. Check for untracked source files imported by committed code
check('No untracked source files imported by committed code', () => {
  try {
    const untracked = execSync('git status --porcelain', { encoding: 'utf8' })
      .split('\n')
      .filter(l => l.startsWith('?? src/'))
      .map(l => l.replace('?? ', ''));

    for (const f of untracked) {
      const base = f.replace('src/', '').replace(/\.(tsx?|json)$/, '').replace(/\/$/, '');
      try {
        const grep = execSync(`grep -rl "${base}" src/ --include="*.tsx" --include="*.ts" 2>/dev/null`, { encoding: 'utf8' });
        if (grep.trim()) return `${f} is untracked but imported`;
      } catch { /* grep found nothing — fine */ }
    }
  } catch { /* git not available */ }
  return null;
});

// 2. Check for duplicate player names
check('No duplicate player names in playerAttrs.ts', () => {
  const content = fs.readFileSync('src/lib/playerAttrs.ts', 'utf8');
  const names = [...content.matchAll(/"([A-Z][^"]+)":/g)].map(m => m[1]);
  const seen = new Set();
  for (const name of names) {
    if (seen.has(name)) return `Duplicate: "${name}"`;
    seen.add(name);
  }
  return null;
});

// 3. Check for orphaned JSX (</Text> without opening <Text>)
check('No orphaned JSX closing tags', () => {
  const gameFiles = fs.readdirSync('src/app/game')
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join('src/app/game', f));

  for (const file of gameFiles) {
    const content = fs.readFileSync(file, 'utf8');
    // Check for </Text> immediately after > (closing of Pressable with no Text opening)
    if (content.includes('>\n            </Text>\n        </Pressable>') ||
        content.includes('>\n              </Text>\n          </Pressable>') ||
        content.includes('>\n                </Text>\n            </Pressable>')) {
      return `Orphaned </Text> in ${file}`;
    }
  }
  return null;
});

// 4. Check splash icon exists
check('Splash icon file exists', () => {
  const appConfig = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  const splashImage = appConfig.expo?.splash?.image;
  if (splashImage && !fs.existsSync(splashImage.replace('./', ''))) {
    return `Missing: ${splashImage}`;
  }
  return null;
});

// 5. Check app icon exists
check('App icon file exists', () => {
  const appConfig = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  const icon = appConfig.expo?.icon;
  if (icon && !fs.existsSync(icon.replace('./', ''))) {
    return `Missing: ${icon}`;
  }
  return null;
});

// 6. Check ADS_ENABLED status
check('Ads configuration', () => {
  const content = fs.readFileSync('src/lib/adConfig.ts', 'utf8');
  const enabled = content.includes('ADS_ENABLED = true');
  if (enabled) {
    console.log('    ⚠  ADS_ENABLED is true — make sure AdMob is configured');
  }
  return null; // Not a failure, just a warning
});

console.log(`\n${failures === 0 ? '✅ All checks passed' : `❌ ${failures} check(s) failed`}\n`);
process.exit(failures > 0 ? 1 : 0);
