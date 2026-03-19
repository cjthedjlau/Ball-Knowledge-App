import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily } from '../styles/theme';

function getMsUntilMidnightEST(): number {
  const now = new Date();
  // Build "now" as a wall-clock time in America/New_York
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const estNow = new Date(estString);
  // Next midnight in that local context
  const nextMidnight = new Date(estNow);
  nextMidnight.setHours(24, 0, 0, 0);
  // Map back to real UTC ms
  const diffMs = nextMidnight.getTime() - estNow.getTime();
  return Math.max(0, diffMs);
}

function format(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MidnightCountdown({ style }: { style?: object }) {
  const [ms, setMs] = useState(getMsUntilMidnightEST);

  useEffect(() => {
    const tick = setInterval(() => setMs(getMsUntilMidnightEST()), 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>NEW GAMES IN</Text>
      <Text style={styles.time}>{format(ms)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(252,52,92,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(252,52,92,0.2)',
    borderRadius: 12,
    marginTop: 16,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    fontSize: 11,
    color: colors.midGray,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  time: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 28,
    color: colors.brand,
    letterSpacing: 2,
  },
});
