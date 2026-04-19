import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ── Types ────────────────────────────────────────────────────────────────────

export type LeagueTier = 'Rookie' | 'Starter' | 'Rotation' | 'All-Star' | 'MVP' | 'GOAT';

export const LEAGUE_TIERS: LeagueTier[] = ['Rookie', 'Starter', 'Rotation', 'All-Star', 'MVP', 'GOAT'];

export const LEAGUE_TIER_COLORS: Record<LeagueTier, string> = {
  Rookie:     '#6B7280',
  Starter:    '#07BCCC',
  Rotation:   '#3B82F6',
  'All-Star': '#8B5CF6',
  MVP:        '#F59E0B',
  GOAT:       '#FC345C',
};

const GROUP_SIZE = 30;
const PROMOTE_COUNT = 5;
const DEMOTE_COUNT = 5;

export interface LeagueMember {
  id: string;
  user_id: string;
  username: string;
  weekly_xp: number;
  promoted: boolean;
  demoted: boolean;
}

export interface WeeklyLeagueState {
  tier: LeagueTier;
  group: number;
  weekStart: string;
  weeklyXp: number;
  rank: number;
  totalMembers: number;
  members: LeagueMember[];
  isPromoting: boolean;
  isDemoting: boolean;
  loading: boolean;
  error: string | null;
  addXp: (amount: number) => Promise<void>;
  refresh: () => Promise<void>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the Monday of the current week as YYYY-MM-DD */
function getCurrentWeekMonday(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

/** Determine which tier a user should be in based on last week's result */
function getNextTier(currentTier: LeagueTier, promoted: boolean, demoted: boolean): LeagueTier {
  const idx = LEAGUE_TIERS.indexOf(currentTier);
  if (promoted && idx < LEAGUE_TIERS.length - 1) return LEAGUE_TIERS[idx + 1];
  if (demoted && idx > 0) return LEAGUE_TIERS[idx - 1];
  return currentTier;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useWeeklyLeague(): WeeklyLeagueState {
  const [tier, setTier] = useState<LeagueTier>('Rookie');
  const [group, setGroup] = useState(0);
  const [weekStart, setWeekStart] = useState(getCurrentWeekMonday());
  const [weeklyXp, setWeeklyXp] = useState(0);
  const [rank, setRank] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [members, setMembers] = useState<LeagueMember[]>([]);
  const [isPromoting, setIsPromoting] = useState(false);
  const [isDemoting, setIsDemoting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeague = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const currentWeek = getCurrentWeekMonday();
      setWeekStart(currentWeek);

      // Check if user has a league entry for this week
      const { data: existing } = await supabase
        .from('weekly_leagues')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', currentWeek)
        .maybeSingle();

      if (existing) {
        // Already enrolled this week
        setTier(existing.league_tier as LeagueTier);
        setGroup(existing.league_group);
        setWeeklyXp(existing.weekly_xp);
      } else {
        // Need to create an entry — check last week for promotion/demotion
        const lastMonday = new Date(currentWeek);
        lastMonday.setDate(lastMonday.getDate() - 7);
        const lastWeekStr = lastMonday.toISOString().split('T')[0];

        const { data: lastWeek } = await supabase
          .from('weekly_leagues')
          .select('*')
          .eq('user_id', user.id)
          .eq('week_start', lastWeekStr)
          .maybeSingle();

        let newTier: LeagueTier = 'Rookie';
        if (lastWeek) {
          newTier = getNextTier(
            lastWeek.league_tier as LeagueTier,
            lastWeek.promoted ?? false,
            lastWeek.demoted ?? false,
          );
        }

        // Assign to a group: find the last group number for this tier/week
        // and place user in the current group, or start a new one if it's full
        const { count } = await supabase
          .from('weekly_leagues')
          .select('*', { count: 'exact', head: true })
          .eq('week_start', currentWeek)
          .eq('league_tier', newTier)
          .eq('league_group', 0);

        // Find the highest group number
        const { data: maxGroupRow } = await supabase
          .from('weekly_leagues')
          .select('league_group')
          .eq('week_start', currentWeek)
          .eq('league_tier', newTier)
          .order('league_group', { ascending: false })
          .limit(1)
          .maybeSingle();

        let assignGroup = maxGroupRow?.league_group ?? 0;

        // Count members in the current highest group
        const { count: groupCount } = await supabase
          .from('weekly_leagues')
          .select('*', { count: 'exact', head: true })
          .eq('week_start', currentWeek)
          .eq('league_tier', newTier)
          .eq('league_group', assignGroup);

        if ((groupCount ?? 0) >= GROUP_SIZE) {
          assignGroup += 1;
        }

        // Insert the new entry
        const { error: insertError } = await supabase
          .from('weekly_leagues')
          .insert({
            user_id: user.id,
            league_tier: newTier,
            league_group: assignGroup,
            week_start: currentWeek,
            weekly_xp: 0,
          });

        if (insertError) {
          // Might be a race condition / duplicate — try re-fetching
          const { data: refetch } = await supabase
            .from('weekly_leagues')
            .select('*')
            .eq('user_id', user.id)
            .eq('week_start', currentWeek)
            .maybeSingle();

          if (refetch) {
            setTier(refetch.league_tier as LeagueTier);
            setGroup(refetch.league_group);
            setWeeklyXp(refetch.weekly_xp);
          } else {
            setError('Could not join league');
            setLoading(false);
            return;
          }
        } else {
          setTier(newTier);
          setGroup(assignGroup);
          setWeeklyXp(0);
        }
      }

      // Now fetch all group members for display
      const currentTier = existing?.league_tier ?? tier;
      const currentGroup = existing?.league_group ?? group;

      const { data: groupMembers } = await supabase
        .from('weekly_leagues')
        .select('id, user_id, weekly_xp, promoted, demoted')
        .eq('week_start', currentWeek)
        .eq('league_tier', existing?.league_tier ?? tier)
        .eq('league_group', existing?.league_group ?? group)
        .order('weekly_xp', { ascending: false });

      if (groupMembers && groupMembers.length > 0) {
        // Fetch usernames for all members
        const userIds = groupMembers.map(m => m.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, username')
          .in('id', userIds);

        const profileMap = new Map<string, string>();
        (profiles ?? []).forEach((p: any) => {
          profileMap.set(p.id, p.display_name || p.username || 'SportsFan');
        });

        const mapped: LeagueMember[] = groupMembers.map(m => ({
          id: m.id,
          user_id: m.user_id,
          username: profileMap.get(m.user_id) ?? 'SportsFan',
          weekly_xp: m.weekly_xp,
          promoted: m.promoted ?? false,
          demoted: m.demoted ?? false,
        }));

        setMembers(mapped);
        setTotalMembers(mapped.length);

        // Find current user's rank
        const userRank = mapped.findIndex(m => m.user_id === user.id) + 1;
        setRank(userRank);

        // Determine promotion/demotion status
        setIsPromoting(userRank > 0 && userRank <= PROMOTE_COUNT);
        setIsDemoting(userRank > 0 && userRank > mapped.length - DEMOTE_COUNT);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeague();
  }, [loadLeague]);

  /** Call after earning XP to update the weekly league entry */
  const addXp = useCallback(async (amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentWeek = getCurrentWeekMonday();

      // Use rpc or a simple update — increment weekly_xp
      const { data: current } = await supabase
        .from('weekly_leagues')
        .select('weekly_xp')
        .eq('user_id', user.id)
        .eq('week_start', currentWeek)
        .maybeSingle();

      if (current) {
        const newXp = (current.weekly_xp ?? 0) + amount;
        await supabase
          .from('weekly_leagues')
          .update({ weekly_xp: newXp })
          .eq('user_id', user.id)
          .eq('week_start', currentWeek);

        setWeeklyXp(newXp);
      }
    } catch (err) {
      console.warn('[useWeeklyLeague] addXp error:', err);
    }
  }, []);

  return {
    tier,
    group,
    weekStart,
    weeklyXp,
    rank,
    totalMembers,
    members,
    isPromoting,
    isDemoting,
    loading,
    error,
    addXp,
    refresh: loadLeague,
  };
}
