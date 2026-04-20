import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { getLevelFromXP, getXPToNextLevel, LEVELS, recalculateLifetimeXP } from './xp';

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

  // Re-fetch profile when auth state changes to SIGNED_IN
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        refetch();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

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

      // Safety net: auto-create profile row if missing (insert only — never overwrite existing data)
      if ((!data || error) && !cancelled) {
        console.log('[useProfile] No profile found for user, creating one...', error?.message);
        const defaultUsername =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Player';

        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          username: defaultUsername,
          lifetime_xp: 0,
          weekly_xp: 0,
          level: 1,
          streak: 0,
          streak_at_risk: false,
          favorite_league: 'NBA',
        }).select().single();

        if (insertError && insertError.code !== '23505') {
          // 23505 = unique violation (profile already exists) — that's fine, skip it
          console.error('[useProfile] Insert failed:', insertError.message, insertError.details, insertError.hint);
          // Try a simpler insert with just the required columns
          const { error: simpleError } = await supabase.from('profiles').insert({
            id: user.id,
            username: defaultUsername,
          }).select().single();
          if (simpleError && simpleError.code !== '23505') {
            console.error('[useProfile] Simple insert also failed:', simpleError.message);
          }
        }

        // Re-fetch after creation
        const refetched = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        data = refetched.data;
        error = refetched.error;
        if (error) {
          console.error('[useProfile] Re-fetch after create failed:', error.message);
        }
      }

      if (!cancelled) {
        if (!error && data) {
          const lifetimeXP = data.lifetime_xp ?? data.xp ?? 0;

          // Check if streak should be shown as broken (missed more than 1 day)
          let displayStreak = data.streak ?? 0;
          let streakAtRisk = data.streak_at_risk ?? false;
          if (data.last_game_date && displayStreak > 0) {
            const lastPlayed = new Date(data.last_game_date + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((today.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays > 1) {
              // Streak is broken — user missed more than 1 day
              displayStreak = 0;
              streakAtRisk = false;
            } else if (diffDays === 1) {
              // Haven't played today yet but streak is still alive
              streakAtRisk = true;
            }
          }

          setProfile({
            username: data.username || data.display_name || 'SportsFan',
            lifetime_xp: lifetimeXP,
            weekly_xp: data.weekly_xp ?? 0,
            level: data.level ?? data.brain_level ?? 1,
            streak: displayStreak,
            streak_at_risk: streakAtRisk,
            favorite_league: data.favorite_league ?? 'NBA',
          });

          // Auto-recover XP if profile shows 0 but user has game history
          if (lifetimeXP === 0 && user.id) {
            recalculateLifetimeXP(user.id).then(recalculated => {
              if (recalculated && recalculated > 0 && !cancelled) {
                setProfile(prev => prev ? { ...prev, lifetime_xp: recalculated, level: getLevelFromXP(recalculated).level } : prev);
              }
            });
          }
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
