import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  BarChart2,
  Trophy,
  Heart,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import useZoneEntrance from '../../hooks/useZoneEntrance';
import useProfile from '../../lib/useProfile';
import AnimatedCard from '../../components/AnimatedCard';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import ListRow from '../../screens/components/ui/ListRow';
import BottomNav, { type Tab } from './ui/BottomNav';

type ProfileScreen = 'my-stats' | 'favorite-teams' | 'achievements' | 'notifications' | 'settings';

interface ProfileProps {
  onNavigate: (tab: Tab | 'logout' | ProfileScreen) => void;
}

// ── XP progress bar ──

function XpBar({ value, total }: { value: number; total: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const fraction = total > 0 ? Math.min(value / total, 1) : 0;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: fraction,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value, total]);

  const fillWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={xpStyles.track}>
      <Animated.View style={[xpStyles.fill, { width: fillWidth }]} />
    </View>
  );
}

const xpStyles = StyleSheet.create({
  track: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },
  fill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.brand,
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

const AVATAR_SIZE = 100;

export default function Profile({ onNavigate }: ProfileProps) {
  const insets = useSafeAreaInsets();
  const [activeLeague, setActiveLeague] = useState('NBA');
  const [signingOut, setSigningOut] = useState(false);
  const { profile, levelInfo, nextLevelInfo, xpProgressPercent, loading } = useProfile();
  const { zone1Style, zone2Style } = useZoneEntrance();

  // ── Real stats from user_game_results ──
  const [gamesPlayed, setGamesPlayed] = useState<number | null>(null);
  const [winRate, setWinRate] = useState<number | null>(null);
  const [bestStreak, setBestStreak] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      setStatsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) { setStatsLoading(false); return; }

      const { data: results } = await supabase
        .from('user_game_results')
        .select('score, league')
        .eq('user_id', user.id)
        .eq('league', activeLeague);

      if (!cancelled && results) {
        const total = results.length;
        const wins = results.filter((r: { score: number }) => r.score > 0).length;
        setGamesPlayed(total);
        setWinRate(total > 0 ? Math.round((wins / total) * 100) : 0);
      } else if (!cancelled) {
        setGamesPlayed(0);
        setWinRate(0);
      }

      setBestStreak(profile?.streak ?? 0);
      if (!cancelled) setStatsLoading(false);
    }
    fetchStats();
    return () => { cancelled = true; };
  }, [activeLeague, profile]);

  const usernameDisplay = profile?.username ?? 'SportsFan';
  const lifetimeXpDisplay = profile ? `${profile.lifetime_xp.toLocaleString()} XP` : '0 XP';
  const levelLabel = levelInfo
    ? `LEVEL ${levelInfo.level} — ${levelInfo.name.toUpperCase()}`
    : 'LEVEL 1 — ROOKIE';
  const xpProgressLabel = (levelInfo && nextLevelInfo)
    ? `${(profile?.lifetime_xp ?? 0).toLocaleString()} / ${nextLevelInfo.xpRequired.toLocaleString()}`
    : (profile?.lifetime_xp ?? 0).toLocaleString();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Zone 1: Header ── */}
      <Animated.View style={[styles.zone1, zone1Style]}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.avatarAnchor}>
          <View style={styles.avatarGlow}>
            <View style={styles.avatarBorderOuter}>
              <View style={styles.avatarBorderInner}>
                <View style={styles.avatarCircle}>
                  <User color={colors.white} size={40} strokeWidth={1.5} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* ── Zone 2: Content ── */}
      <Animated.View style={[{ flex: 1 }, zone2Style]}>
      <ScrollView
        style={styles.zone2}
        contentContainerStyle={[styles.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* User info */}
        <View style={styles.userInfo}>
          {loading ? (
            <ActivityIndicator color={colors.brand} style={{ marginBottom: 8 }} />
          ) : (
            <>
              <Text style={styles.username}>{usernameDisplay}</Text>
              <Text style={styles.xpValue}>{lifetimeXpDisplay}</Text>
            </>
          )}
        </View>

        {/* Level progress bar */}
        <View style={styles.xpSection}>
          <View style={styles.xpLabelRow}>
            <Text style={styles.xpLabel}>{levelLabel}</Text>
            <Text style={styles.xpProgress}>{xpProgressLabel}</Text>
          </View>
          <XpBar value={xpProgressPercent} total={100} />
        </View>

        {/* League switcher */}
        <View style={styles.leagueSection}>
          <LeagueSwitcher
            selected={activeLeague}
            onChange={setActiveLeague}
          />
        </View>

        {/* Stat strip */}
        <AnimatedCard delay={0}>
          <View style={styles.statStrip}>
            <View style={[styles.statItem, styles.statItemBorder]}>
              <Text style={styles.statLabel}>GAMES</Text>
              <Text style={styles.statValue}>
                {statsLoading ? '—' : (gamesPlayed ?? 0).toLocaleString()}
              </Text>
            </View>
            <View style={[styles.statItem, styles.statItemBorder]}>
              <Text style={styles.statLabel}>WIN RATE</Text>
              <Text style={styles.statValue}>
                {statsLoading ? '—' : `${winRate ?? 0}%`}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>BEST STREAK</Text>
              <Text style={styles.statValue}>
                {statsLoading ? '—' : (bestStreak ?? 0).toString()}
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Menu rows */}
        <View style={styles.menuSection}>
          <AnimatedCard delay={80}>
            <ListRow
              icon={<BarChart2 color={colors.brand} size={20} strokeWidth={2} />}
              label="My Stats"
              onPress={() => onNavigate('my-stats')}
            />
          </AnimatedCard>
          <AnimatedCard delay={160}>
            <ListRow
              icon={<Trophy color={colors.brand} size={20} strokeWidth={2} />}
              label="Achievements"
              onPress={() => onNavigate('achievements')}
            />
          </AnimatedCard>
          <AnimatedCard delay={240}>
            <ListRow
              icon={<Heart color={colors.brand} size={20} strokeWidth={2} />}
              label="Favorite Teams"
              onPress={() => onNavigate('favorite-teams')}
            />
          </AnimatedCard>
          <AnimatedCard delay={320}>
            <ListRow
              icon={<Bell color={colors.brand} size={20} strokeWidth={2} />}
              label="Notifications"
              onPress={() => onNavigate('notifications')}
            />
          </AnimatedCard>
          <AnimatedCard delay={400}>
            <ListRow
              icon={<Settings color={colors.brand} size={20} strokeWidth={2} />}
              label="Settings"
              onPress={() => onNavigate('settings')}
            />
          </AnimatedCard>
          <AnimatedCard delay={480}>
            <View style={styles.logoutSpacer} />
            <ListRow
              icon={signingOut
                ? <ActivityIndicator size="small" color={colors.brand} />
                : <LogOut color={colors.brand} size={20} strokeWidth={2} />
              }
              label="Log Out"
              onPress={async () => {
                if (signingOut) return;
                setSigningOut(true);
                await supabase.auth.signOut();
                setSigningOut(false);
                onNavigate('logout');
              }}
              danger
            />
          </AnimatedCard>
        </View>
      </ScrollView>
      </Animated.View>

      <BottomNav activeTab="profile" onNavigate={onNavigate as (tab: Tab) => void} />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // ── Zone 1 ──
  zone1: {
    backgroundColor: colors.brand,
    paddingTop: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    minHeight: 260,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: 1,
    color: colors.white,
    marginBottom: spacing.xl,
  },

  avatarAnchor: {
    alignItems: 'center',
  },
  avatarGlow: {
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 16,
    borderRadius: (AVATAR_SIZE + 4) / 2,
  },
  avatarBorderOuter: {
    width: AVATAR_SIZE + 4,
    height: AVATAR_SIZE + 4,
    borderRadius: (AVATAR_SIZE + 4) / 2,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: colors.brand,
    borderBottomColor: colors.accentCyan,
    borderLeftColor: colors.brand,
    borderRightColor: colors.accentCyan,
    borderWidth: 3,
  },
  avatarBorderInner: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: darkColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatarCircle: {
    width: AVATAR_SIZE - 8,
    height: AVATAR_SIZE - 8,
    borderRadius: (AVATAR_SIZE - 8) / 2,
    backgroundColor: darkColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Zone 2 ──
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    marginTop: 0,
  },
  zone2Content: {
    paddingTop: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: 0,
  },

  userInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  username: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 22,
    color: colors.white,
    marginBottom: 4,
  },
  xpValue: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.brand,
    letterSpacing: 0.5,
  },

  xpSection: {
    marginBottom: spacing['2xl'],
  },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: darkColors.textSecondary,
  },
  xpProgress: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: darkColors.textSecondary,
  },

  leagueSection: {
    marginBottom: spacing['2xl'],
  },

  statStrip: {
    flexDirection: 'row',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    marginBottom: spacing['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: darkColors.border,
  },
  statLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1.5,
    color: darkColors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 20,
    color: colors.brand,
    letterSpacing: 0.5,
  },

  menuSection: {
    borderRadius: 16,
    overflow: 'hidden',
    gap: 2,
  },
  logoutSpacer: {
    height: spacing.md,
  },
});
