import React, { useState, useEffect } from 'react';
import {
  Animated,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, UserPlus, Users, Link } from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { shareInviteLink, addFriendByCode, getOrCreateInviteCode } from '../../lib/friends';
import BottomNav, { type Tab } from './ui/BottomNav';
import useZoneEntrance from '../../hooks/useZoneEntrance';
import AnimatedCard from '../../components/AnimatedCard';

type LeaderboardTab = 'weekly' | 'alltime' | 'friends';

interface LeaderboardEntry {
  id: string;
  username: string;
  xp: number;
  streak: number;
  level: number;
}

interface LeaderboardProps {
  onNavigate: (tab: Tab) => void;
  initialInviteCode?: string | null;
  onInviteCodeConsumed?: () => void;
}

const TABS: { id: LeaderboardTab; label: string }[] = [
  { id: 'weekly',  label: 'Weekly'   },
  { id: 'alltime', label: 'All Time' },
  { id: 'friends', label: 'Friends'  },
];

const PODIUM_META = [
  { rank: 2, emoji: '🥈', borderColor: '#C0C0C0', platformHeight: 48,  isFirst: false },
  { rank: 1, emoji: '🏆', borderColor: '#F59E0B', platformHeight: 72,  isFirst: true  },
  { rank: 3, emoji: '🥉', borderColor: '#CD7F32', platformHeight: 36,  isFirst: false },
];

function formatXP(n: number): string {
  return n.toLocaleString() + ' XP';
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Leaderboard({ onNavigate, initialInviteCode, onInviteCodeConsumed }: LeaderboardProps) {
  const insets = useSafeAreaInsets();
  const { zone1Style, zone2Style } = useZoneEntrance();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>(initialInviteCode ? 'friends' : 'weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Auto-add friend when arriving via invite link
  useEffect(() => {
    if (!initialInviteCode) return;
    let cancelled = false;

    (async () => {
      const result = await addFriendByCode(initialInviteCode);
      if (cancelled) return;
      onInviteCodeConsumed?.();
      if (result.success) {
        Alert.alert('Friend Added!', 'You can now compete on the friends leaderboard.');
        // Refresh friends list
        setActiveTab('weekly');
        setTimeout(() => setActiveTab('friends'), 100);
      } else {
        Alert.alert('Invite Code', result.error ?? 'Could not add friend');
      }
    })();

    return () => { cancelled = true; };
  }, [initialInviteCode]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);

      const { data: { user } } = await supabase.auth.getUser();
      if (!cancelled) setCurrentUserId(user?.id ?? null);

      // Helper: map a profile row to a LeaderboardEntry
      const mapRow = (row: any, tab: LeaderboardTab): LeaderboardEntry => ({
        id: row.id,
        username: row.username || row.display_name || 'SportsFan',
        xp: tab === 'weekly' ? (row.weekly_xp ?? row.xp ?? 0) : (row.lifetime_xp ?? row.xp ?? 0),
        streak: row.streak ?? 0,
        level: row.level ?? row.brain_level ?? 1,
      });

      // Friends tab: try to load friend_ids from the user's profile
      if (activeTab === 'friends') {
        if (!user) {
          if (!cancelled) { setEntries([]); setLoading(false); }
          return;
        }
        // Query for friends — uses friend_ids array on profile if available
        const { data: profile } = await supabase
          .from('profiles')
          .select('friend_ids')
          .eq('id', user.id)
          .single();

        const friendIds: string[] = (profile as any)?.friend_ids ?? [];
        if (friendIds.length === 0) {
          if (!cancelled) { setEntries([]); setLoading(false); }
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', [...friendIds, user.id])
          .order('lifetime_xp', { ascending: false })
          .limit(20);

        if (!cancelled) {
          if (fetchError || !data) {
            console.warn('[Leaderboard] Friends fetch error:', fetchError?.message);
            setEntries([]);
          } else {
            setEntries(data.map(row => mapRow(row, 'alltime')));
          }
          setLoading(false);
        }
        return;
      }

      // Weekly / All-Time tabs
      // Use select('*') to work regardless of which columns exist in the DB
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order(activeTab === 'weekly' ? 'weekly_xp' : 'lifetime_xp', { ascending: false })
        .limit(10);

      if (!cancelled) {
        if (fetchError) {
          console.warn('[Leaderboard] Fetch error:', fetchError.message, fetchError.details);
          // Fallback: try ordering by 'xp' column (original schema name)
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('profiles')
            .select('*')
            .order('xp', { ascending: false })
            .limit(10);

          if (fallbackError || !fallbackData || fallbackData.length === 0) {
            console.warn('[Leaderboard] Fallback also failed:', fallbackError?.message);
            // Last resort: just get all profiles without ordering
            const { data: lastResort } = await supabase
              .from('profiles')
              .select('*')
              .limit(10);

            if (lastResort && lastResort.length > 0) {
              setEntries(lastResort.map(row => mapRow(row, activeTab)));
            } else {
              setError(true);
            }
          } else {
            setEntries(fallbackData.map(row => mapRow(row, activeTab)));
          }
        } else if (!data || data.length === 0) {
          // No profiles at all — show empty state, not error
          setEntries([]);
        } else {
          setEntries(data.map(row => mapRow(row, activeTab)));
        }
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeTab]);

  // Derive podium slots (top 3) and rank list (4-10)
  const podiumEntries = entries.slice(0, 3);
  const rankEntries = entries.slice(3);

  // Top streak holder for banner
  const topStreaker = entries.length > 0
    ? entries.reduce((best, e) => e.streak > best.streak ? e : best, entries[0])
    : null;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Zone 1: Header + Podium ── */}
      <Animated.View style={[styles.zone1, zone1Style]}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Leaderboard</Text>
        </View>
        <Text style={styles.subtitle}>
          {activeTab === 'weekly' ? 'Top Players This Week' : activeTab === 'alltime' ? 'All-Time Rankings' : 'Compete With Friends'}
        </Text>

        {/* Tab switcher */}
        <View style={styles.tabSwitcher}>
          {TABS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <Pressable
                key={id}
                style={[styles.tabPill, isActive && styles.tabPillActive]}
                onPress={() => setActiveTab(id)}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Podium (hidden on friends tab) */}
        {activeTab !== 'friends' && (
          <View style={styles.podium}>
            {PODIUM_META.map((meta) => {
              // rank 1→index 0, rank 2→index 1, rank 3→index 2
              const entry = podiumEntries[meta.rank - 1];
              return (
                <PodiumSlot
                  key={meta.rank}
                  rank={meta.rank}
                  emoji={meta.emoji}
                  borderColor={meta.borderColor}
                  platformHeight={meta.platformHeight}
                  isFirst={meta.isFirst}
                  name={entry?.username ?? '—'}
                  xpLabel={entry ? formatXP(entry.xp) : '—'}
                  xpColor={meta.isFirst ? '#F59E0B' : darkColors.text}
                />
              );
            })}
          </View>
        )}
      </Animated.View>

      {/* ── Zone 2: Rank list ── */}
      <Animated.View style={[{ flex: 1 }, zone2Style]}>
      <ScrollView
        style={styles.zone2}
        contentContainerStyle={[styles.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.brand} size="large" />
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>Could not load leaderboard</Text>
          </View>
        ) : activeTab === 'friends' && entries.length === 0 ? (
          <FriendsEmptyState onFriendAdded={() => setActiveTab('friends')} />
        ) : activeTab !== 'friends' && entries.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={[styles.errorText, { marginBottom: 8 }]}>No players yet</Text>
            <Text style={[styles.errorText, { fontSize: 13 }]}>Play some games to get on the board!</Text>
          </View>
        ) : (
          <>
            {/* Streak banner */}
            {topStreaker && topStreaker.streak > 0 && (
              <AnimatedCard delay={0}>
                <View style={styles.streakBanner}>
                  <View style={styles.streakIconWrap}>
                    <Flame color={colors.brand} size={18} fill={colors.brand} />
                  </View>
                  <Text style={styles.streakText}>
                    <Text style={styles.streakName}>{topStreaker.username}</Text>
                    {' '}is on a{' '}
                    <Text style={styles.streakCount}>{topStreaker.streak}-day streak!</Text>
                  </Text>
                </View>
              </AnimatedCard>
            )}

            {/* Friends tab: flat list (no podium distinction) */}
            {activeTab === 'friends' ? (
              <>
              <FriendsActions onFriendAdded={() => setActiveTab('friends')} />
              <View style={styles.rankList}>
                {entries.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <AnimatedCard key={entry.id} delay={100 + index * 60}>
                      {index > 0 && <View style={styles.divider} />}
                      <LeaderboardRow
                        rank={rank}
                        entry={entry}
                        xpLabel={formatXP(entry.xp)}
                        isCurrentUser={entry.id === currentUserId}
                      />
                    </AnimatedCard>
                  );
                })}
              </View>
              </>
            ) : (
              /* Rank rows (positions 4–10) for weekly/alltime */
              <View style={styles.rankList}>
                {rankEntries.map((entry, index) => {
                  const rank = index + 4;
                  return (
                    <AnimatedCard key={entry.id} delay={100 + index * 60}>
                      {index > 0 && <View style={styles.divider} />}
                      <LeaderboardRow
                        rank={rank}
                        entry={entry}
                        xpLabel={formatXP(entry.xp)}
                        isCurrentUser={entry.id === currentUserId}
                      />
                    </AnimatedCard>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
      </Animated.View>

      <BottomNav activeTab="leaderboard" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PodiumSlot({
  rank,
  emoji,
  borderColor,
  platformHeight,
  isFirst,
  name,
  xpLabel,
  xpColor,
}: {
  rank: number;
  emoji: string;
  borderColor: string;
  platformHeight: number;
  isFirst: boolean;
  name: string;
  xpLabel: string;
  xpColor: string;
}) {
  const rankLabel = rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd';

  return (
    <View style={[styles.podiumSlot, isFirst && styles.podiumSlotFirst]}>
      <View style={styles.podiumAvatarWrap}>
        {isFirst && <Text style={styles.crownEmoji}>👑</Text>}
        <View
          style={[
            styles.podiumAvatar,
            { borderColor },
            isFirst && styles.podiumAvatarFirst,
          ]}
        >
          <Text style={isFirst ? styles.podiumEmojiLarge : styles.podiumEmoji}>
            {emoji}
          </Text>
        </View>
        <View style={[styles.rankBadge, { backgroundColor: borderColor }]}>
          <Text style={[styles.rankBadgeText, { color: isFirst ? '#78350F' : '#1A1A1A' }]}>
            {rankLabel}
          </Text>
        </View>
      </View>
      <Text style={styles.podiumName} numberOfLines={1}>{name}</Text>
      <Text style={[styles.podiumXp, { color: xpColor }]}>{xpLabel}</Text>
      <View
        style={[
          styles.platform,
          { height: platformHeight, borderColor },
          isFirst && styles.platformFirst,
        ]}
      />
    </View>
  );
}

function LeaderboardRow({
  rank,
  entry,
  xpLabel,
  isCurrentUser,
}: {
  rank: number;
  entry: LeaderboardEntry;
  xpLabel: string;
  isCurrentUser: boolean;
}) {
  const streakLabel = entry.streak > 0 ? `🔥 ${entry.streak}-day streak` : `Rank #${rank}`;

  if (isCurrentUser) {
    return (
      <View style={styles.userRow}>
        <View style={styles.userRowGlow} />
        <View style={styles.rankNumWrapUser}>
          <Text style={styles.rankNumUser}>{rank}</Text>
        </View>
        <View style={styles.emojiAvatar}>
          <Text style={styles.emojiText}>🏀</Text>
        </View>
        <View style={styles.rowInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.rowName}>{entry.username}</Text>
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>You</Text>
            </View>
          </View>
          <Text style={styles.userRankLabel}>{streakLabel}</Text>
        </View>
        <Text style={styles.rowXp}>{xpLabel}</Text>
      </View>
    );
  }

  return (
    <View style={styles.rankRow}>
      <View style={styles.rankNumWrap}>
        <Text style={styles.rankNum}>{rank}</Text>
      </View>
      <View style={styles.emojiAvatar}>
        <Text style={styles.emojiText}>🏀</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{entry.username}</Text>
        <Text style={styles.rowRankLabel}>{streakLabel}</Text>
      </View>
      <Text style={styles.rowXp}>{xpLabel}</Text>
    </View>
  );
}

function FriendsActions({ onFriendAdded }: { onFriendAdded: () => void }) {
  const [codeInput, setCodeInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [myCode, setMyCode] = useState<string | null>(null);

  useEffect(() => {
    void getOrCreateInviteCode().then(setMyCode);
  }, []);

  const handleAddByCode = async () => {
    if (!codeInput.trim()) return;
    setAdding(true);
    const result = await addFriendByCode(codeInput);
    setAdding(false);
    if (result.success) {
      Alert.alert('Friend Added!', 'You can now compete on the friends leaderboard.');
      setCodeInput('');
      onFriendAdded();
    } else {
      Alert.alert('Could not add', result.error ?? 'Try again');
    }
  };

  return (
    <View style={styles.friendsActions}>
      {/* Share invite link */}
      <Pressable
        style={({ pressed }) => [styles.inviteBtn, pressed && styles.inviteBtnPressed]}
        onPress={() => void shareInviteLink()}
      >
        <Link color={colors.white} size={18} strokeWidth={2.5} />
        <Text style={styles.inviteBtnText}>SHARE INVITE LINK</Text>
      </Pressable>

      {/* My code display */}
      {myCode && (
        <View style={styles.myCodeRow}>
          <Text style={styles.myCodeLabel}>Your code:</Text>
          <View style={styles.myCodeBadge}>
            <Text style={styles.myCodeText}>{myCode}</Text>
          </View>
        </View>
      )}

      {/* Divider */}
      <View style={styles.orDivider}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>or enter a friend's code</Text>
        <View style={styles.orLine} />
      </View>

      {/* Code input */}
      <View style={styles.codeInputRow}>
        <TextInput
          style={styles.codeInput}
          value={codeInput}
          onChangeText={setCodeInput}
          placeholder="Enter code"
          placeholderTextColor={darkColors.textSecondary}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={8}
        />
        <Pressable
          style={({ pressed }) => [
            styles.addCodeBtn,
            (!codeInput.trim() || adding) && styles.addCodeBtnDisabled,
            pressed && codeInput.trim() && styles.addCodeBtnPressed,
          ]}
          onPress={handleAddByCode}
          disabled={!codeInput.trim() || adding}
        >
          <UserPlus color={colors.white} size={16} strokeWidth={2.5} />
          <Text style={styles.addCodeBtnText}>ADD</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FriendsEmptyState({ onFriendAdded }: { onFriendAdded: () => void }) {
  return (
    <View style={styles.friendsEmpty}>
      <View style={styles.friendsIconCircle}>
        <Users color={darkColors.textSecondary} size={32} strokeWidth={1.5} />
      </View>
      <Text style={styles.friendsEmptyTitle}>No Friends Yet</Text>
      <Text style={styles.friendsEmptySub}>
        Invite your friends to Ball Knowledge and compete head-to-head on the leaderboard.
      </Text>
      <FriendsActions onFriendAdded={onFriendAdded} />
    </View>
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
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: 0,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  titleRow: {
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: 1,
    color: colors.white,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.70)',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  // Tab switcher
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderRadius: 999,
    padding: 4,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  tabPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tabPillActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  tabLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.80)',
  },
  tabLabelActive: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.brand,
  },

  // Podium
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  podiumSlot: {
    flex: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  podiumSlotFirst: {
    flex: 1.2,
  },
  podiumAvatarWrap: {
    alignItems: 'center',
    marginBottom: 6,
  },
  crownEmoji: {
    fontSize: 20,
    marginBottom: -4,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  podiumAvatarFirst: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 12,
  },
  podiumEmoji: {
    fontSize: 22,
  },
  podiumEmojiLarge: {
    fontSize: 22,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 2,
  },
  rankBadgeText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  podiumName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    color: colors.white,
    marginTop: 12,
    marginBottom: 2,
    textAlign: 'center',
  },
  podiumXp: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 9,
    marginBottom: 6,
  },
  platform: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.08)',
    borderRightColor: 'rgba(255,255,255,0.08)',
  },
  platformFirst: {
    backgroundColor: 'rgba(245,158,11,0.20)',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },

  // ── Zone 2 ──
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    marginTop: -32,
  },
  zone2Content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['3xl'],
    paddingBottom: 0,
  },

  // Loading / error states
  centerState: {
    alignItems: 'center',
    paddingTop: 48,
  },
  errorText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: '#9A9A9A',
  },

  // Streak banner
  streakBanner: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  streakIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brandAlpha15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: darkColors.text,
    lineHeight: 19,
  },
  streakName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.white,
  },
  streakCount: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.brand,
  },

  // Rank list
  rankList: {
    gap: 0,
  },
  divider: {
    height: 1,
    backgroundColor: darkColors.border,
    marginHorizontal: 4,
    opacity: 0.5,
    borderStyle: 'dashed' as any,
  },

  // Standard rank row
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
    gap: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  rankNumWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  emojiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(252,52,92,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.white,
    marginBottom: 1,
  },
  rowRankLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: darkColors.textSecondary,
  },
  rowXp: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.brand,
  },

  // User (self) row
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(252,52,92,0.08)',
    borderRadius: 12,
    padding: spacing.md,
    gap: 12,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
    borderTopWidth: 1,
    borderTopColor: 'rgba(252,52,92,0.12)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(252,52,92,0.12)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(252,52,92,0.12)',
    overflow: 'hidden',
  },
  userRowGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 40,
    backgroundColor: 'rgba(252,52,92,0.08)',
  },
  rankNumWrapUser: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumUser: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.brand,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 1,
  },
  userRankLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: 'rgba(252,52,92,0.70)',
  },
  youBadge: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  youBadgeText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
    color: colors.white,
  },

  // Friends empty state
  friendsEmpty: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  friendsIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: darkColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  friendsEmptyTitle: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
  },
  friendsEmptySub: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 280,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: spacing.sm,
  },
  inviteBtnPressed: {
    opacity: 0.85,
  },
  inviteBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
    color: colors.white,
  },

  // Friends actions (invite + code entry)
  friendsActions: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  myCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  myCodeLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  myCodeBadge: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  myCodeText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 3,
    color: colors.white,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: darkColors.border,
  },
  orText: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: darkColors.textSecondary,
  },
  codeInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  codeInput: {
    flex: 1,
    height: 48,
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 3,
    color: colors.white,
    borderWidth: 1,
    borderColor: darkColors.border,
    textAlign: 'center',
  },
  addCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 48,
  },
  addCodeBtnDisabled: {
    opacity: 0.4,
  },
  addCodeBtnPressed: {
    opacity: 0.85,
  },
  addCodeBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    color: colors.white,
  },
});
