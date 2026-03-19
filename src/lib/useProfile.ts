import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { getLevelFromXP, getXPToNextLevel, LEVELS } from './xp';

interface ProfileData {
  username: string;
  lifetime_xp: number;
  weekly_xp: number;
  level: number;
  streak: number;
  streak_at_risk: boolean;
  favorite_league: string;
}

type LevelInfo = typeof LEVELS[number];

interface UseProfileReturn {
  profile: ProfileData | null;
  levelInfo: LevelInfo | null;
  nextLevelInfo: LevelInfo | null;
  xpToNextLevel: number | null;
  xpProgressPercent: number;
  loading: boolean;
  refetch: () => void;
}

export default function useProfile(refreshTrigger?: number): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) {
        setLoading(false);
        return;
      }

      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Safety net: auto-create profile row if missing
      if ((!data || error) && !cancelled) {
        const defaultUsername = user.email?.split('@')[0] ?? 'Player';
        await supabase.from('profiles').upsert({
          id: user.id,
          username: defaultUsername,
          lifetime_xp: 0,
          weekly_xp: 0,
          level: 1,
          streak: 0,
          streak_at_risk: false,
          favorite_league: 'NBA',
        });
        // Re-fetch after creation
        const refetched = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        data = refetched.data;
        error = refetched.error;
      }

      if (!cancelled) {
        if (!error && data) {
          setProfile({
            username: data.username ?? 'SportsFan',
            lifetime_xp: data.lifetime_xp ?? 0,
            weekly_xp: data.weekly_xp ?? 0,
            level: data.level ?? 1,
            streak: data.streak ?? 0,
            streak_at_risk: data.streak_at_risk ?? false,
            favorite_league: data.favorite_league ?? 'NBA',
          });
        }
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tick, refreshTrigger]);

  const xp = profile?.lifetime_xp ?? 0;
  const levelInfo = profile ? getLevelFromXP(xp) : null;
  const nextLevelInfo = levelInfo
    ? (LEVELS.find(l => l.level === levelInfo.level + 1) ?? null)
    : null;
  const xpToNextLevel = profile ? getXPToNextLevel(xp) : null;

  let xpProgressPercent = 0;
  if (levelInfo && nextLevelInfo) {
    const range = nextLevelInfo.xpRequired - levelInfo.xpRequired;
    const progress = xp - levelInfo.xpRequired;
    xpProgressPercent = range > 0 ? Math.min((progress / range) * 100, 100) : 100;
  } else if (levelInfo && !nextLevelInfo) {
    xpProgressPercent = 100; // max level
  }

  return {
    profile,
    levelInfo,
    nextLevelInfo,
    xpToNextLevel,
    xpProgressPercent,
    loading,
    refetch,
  };
}
