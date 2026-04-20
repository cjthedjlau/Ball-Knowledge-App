import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Globe,
  Trash2,
  LogOut,
  Sun,
  Moon,
  Bug,
  Send,
  Bell,
  BellOff,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { brand, dark, light, colors, darkColors, fonts, fontFamily, spacing } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import ListRow from '../../screens/components/ui/ListRow';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import { type Tab } from './ui/BottomNav';
import SlideTag from '../../screens/components/ui/SlideTag';
import { useTheme } from '../../hooks/useTheme';
import { useUserAnalytics } from '../../lib/analytics';

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab | 'logout') => void;
}

export default function SettingsScreen({ onBack, onNavigate }: Props) {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [favoriteLeague, setFavoriteLeague] = useState('NBA');
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [reportingBug, setReportingBug] = useState(false);
  const [bugDescription, setBugDescription] = useState('');
  const [sendingReport, setSendingReport] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const { trackLogout } = useUserAnalytics();
  const [notifNFL, setNotifNFL] = useState(true);
  const [notifNBA, setNotifNBA] = useState(true);
  const [notifMLB, setNotifMLB] = useState(true);
  const [notifNHL, setNotifNHL] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) { setLoading(false); return; }
      const { data } = await supabase
        .from('profiles')
        .select('username, favorite_league')
        .eq('id', user.id)
        .single();
      if (!cancelled && data) {
        setUsername(data.username ?? '');
        setFavoriteLeague(data.favorite_league ?? 'NBA');
      }
      // Load notification preferences
      try {
        const prefs = await AsyncStorage.getItem('bk_notif_prefs');
        if (prefs && !cancelled) {
          const parsed = JSON.parse(prefs);
          setNotifNFL(parsed.NFL ?? true);
          setNotifNBA(parsed.NBA ?? true);
          setNotifMLB(parsed.MLB ?? true);
          setNotifNHL(parsed.NHL ?? true);
          setDailyReminder(parsed.daily ?? true);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleSaveUsername() {
    if (!username.trim()) return;
    if (username.trim().length < 3) {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters.');
      return;
    }
    if (username.trim().length > 20) {
      Alert.alert('Invalid Username', 'Username must be 20 characters or less.');
      return;
    }
    setSavingUsername(true);
    setUsernameSaved(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').upsert({ id: user.id, username: username.trim() });
      setUsernameSaved(true);
      setEditingUsername(false);
    }
    setSavingUsername(false);
  }

  async function handleChangeEmail() {
    Alert.prompt(
      'Change Email',
      'Enter your new email address:',
      async (newEmail) => {
        if (!newEmail?.trim()) return;
        const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Success', 'Check your new email for a confirmation link.');
        }
      },
      'plain-text',
    );
  }

  async function handleChangePassword() {
    Alert.prompt(
      'Change Password',
      'Enter your new password (min 6 characters):',
      async (newPassword) => {
        if (!newPassword || newPassword.length < 6) {
          Alert.alert('Error', 'Password must be at least 6 characters.');
          return;
        }
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Success', 'Password updated successfully.');
        }
      },
      'secure-text',
    );
  }

  async function handleLeagueChange(league: string) {
    setFavoriteLeague(league);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').upsert({ id: user.id, favorite_league: league });
    }
  }

  async function handleClearCache() {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith('mystery-player-state-'));
    if (cacheKeys.length === 0) {
      Alert.alert('Cache Clear', 'No cached game data found.');
      return;
    }
    await AsyncStorage.multiRemove(cacheKeys);
    Alert.alert('Cache Clear', `Cleared ${cacheKeys.length} cached game state(s).`);
  }

  async function handleSendBugReport() {
    const desc = bugDescription.trim();
    if (!desc) {
      Alert.alert('Empty Report', 'Please describe the bug before sending.');
      return;
    }
    setSendingReport(true);
    const { data: { user } } = await supabase.auth.getUser();
    const meta = [
      `Platform: ${Platform.OS}`,
      `User ID: ${user?.id ?? 'guest'}`,
      `Date: ${new Date().toISOString()}`,
    ].join('\n');
    const subject = encodeURIComponent('Bug Report — Ball Knowledge');
    const body = encodeURIComponent(`${desc}\n\n---\n${meta}`);
    const mailUrl = `mailto:ballknowingdevelopers@gmail.com?subject=${subject}&body=${body}`;
    const supported = await Linking.canOpenURL(mailUrl);
    setSendingReport(false);
    if (supported) {
      await Linking.openURL(mailUrl);
      setBugDescription('');
      setReportingBug(false);
    } else {
      Alert.alert(
        'No Email App',
        'Could not open a mail app. Please email ballknowingdevelopers@gmail.com directly.',
      );
    }
  }

  async function handleLogOut() {
    if (signingOut) return;
    setSigningOut(true);
    trackLogout();
    await supabase.auth.signOut();
    setSigningOut(false);
    onNavigate('logout');
  }

  async function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your data (XP, streaks, game history, leaderboard rankings). This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;

              // Delete user data from all tables
              await supabase.from('game_sessions').delete().eq('user_id', user.id);
              await supabase.from('user_game_results').delete().eq('user_id', user.id);
              await supabase.from('weekly_leagues').delete().eq('user_id', user.id);
              await supabase.from('lobby_players').delete().eq('user_id', user.id);
              await supabase.from('qotd_responses').delete().eq('user_id', user.id);
              await supabase.from('friendships').delete().or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);
              await supabase.from('profiles').delete().eq('id', user.id);

              // Clear local storage
              await AsyncStorage.clear();

              // Sign out
              await supabase.auth.signOut();
              onNavigate('logout');
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Failed to delete account. Please try again.');
            }
          },
        },
      ],
    );
  }

  return (
    <View style={styles.root}>
      {/* Zone 1 */}
      <View style={[styles.zone1, { backgroundColor: brand.primary, paddingTop: insets.top + spacing.lg }]}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={dark.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.zone1Title}>SETTINGS</Text>
      </View>

      {/* Zone 2 */}
      <ScrollView
        style={[styles.zone2, { borderTopColor: isDark ? dark.cardBorder : light.cardBorder }]}
        contentContainerStyle={[styles.zone2Content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color={colors.brand} style={{ marginTop: spacing['3xl'] }} />
        ) : (
          <>
            {/* Account Section */}
            <SlideTag label="Account" variant="red" />

            <View style={[styles.card, {
              backgroundColor: isDark ? dark.card : light.card,
              borderTopColor: isDark ? dark.cardBorder : light.cardBorder,
            }]}>
              {editingUsername ? (
                <View style={styles.usernameEditRow}>
                  <TextInput
                    style={[styles.usernameInput, {
                      backgroundColor: isDark ? dark.background : light.inputBg,
                      borderColor: isDark ? dark.cardBorder : light.cardBorder,
                      color: isDark ? dark.textPrimary : light.textPrimary,
                    }]}
                    value={username}
                    onChangeText={(t) => { setUsername(t); setUsernameSaved(false); }}
                    placeholder="Username"
                    placeholderTextColor={isDark ? dark.textSecondary : light.textSecondary}
                    maxLength={20}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSaveUsername}
                  />
                  <PrimaryButton
                    label={savingUsername ? '...' : 'SAVE'}
                    onPress={handleSaveUsername}
                    loading={savingUsername}
                  />
                </View>
              ) : (
                <ListRow
                  icon={<User color={colors.brand} size={20} strokeWidth={2} />}
                  label="Edit Username"
                  value={username || 'Not set'}
                  onPress={() => setEditingUsername(true)}
                />
              )}
              {usernameSaved && (
                <Text style={styles.savedText}>Username saved!</Text>
              )}
            </View>

            <View style={styles.menuGroup}>
              <ListRow
                icon={<Mail color={colors.brand} size={20} strokeWidth={2} />}
                label="Change Email"
                onPress={handleChangeEmail}
              />
              <ListRow
                icon={<Lock color={colors.brand} size={20} strokeWidth={2} />}
                label="Change Password"
                onPress={handleChangePassword}
              />
            </View>

            {/* App Section */}
            <View style={{ marginTop: spacing['2xl'] }}>
              <SlideTag label="App" variant="red" />
            </View>

            <View style={[styles.card, {
              backgroundColor: isDark ? dark.card : light.card,
              borderTopColor: isDark ? dark.cardBorder : light.cardBorder,
            }]}>
              <Text style={[styles.settingLabel, { color: isDark ? dark.textSecondary : light.textSecondary }]}>DEFAULT LEAGUE</Text>
              <LeagueSwitcher selected={favoriteLeague} onChange={handleLeagueChange} />
            </View>

            <View style={styles.menuGroup}>
              <ListRow
                icon={isDark
                  ? <Moon color={colors.brand} size={20} strokeWidth={2} />
                  : <Sun color={colors.brand} size={20} strokeWidth={2} />
                }
                label="Appearance"
                value={isDark ? 'Dark' : 'Light'}
                onPress={toggleTheme}
              />
              <ListRow
                icon={<Trash2 color={colors.brand} size={20} strokeWidth={2} />}
                label="Clear Game Cache"
                onPress={handleClearCache}
              />
              <ListRow
                icon={<Bug color={colors.brand} size={20} strokeWidth={2} />}
                label="Report a Bug"
                onPress={() => { setReportingBug(v => !v); setBugDescription(''); }}
              />
            </View>

            {reportingBug && (
              <View style={[styles.bugCard, {
                backgroundColor: isDark ? dark.card : light.card,
                borderTopColor: isDark ? dark.cardBorder : light.cardBorder,
              }]}>
                <Text style={[styles.bugLabel, { color: isDark ? dark.textSecondary : light.textSecondary }]}>DESCRIBE THE ISSUE</Text>
                <TextInput
                  style={[styles.bugInput, {
                    backgroundColor: isDark ? dark.background : light.inputBg,
                    borderColor: isDark ? dark.cardBorder : light.cardBorder,
                    color: isDark ? dark.textPrimary : light.textPrimary,
                  }]}
                  value={bugDescription}
                  onChangeText={setBugDescription}
                  placeholder="What happened? Steps to reproduce…"
                  placeholderTextColor={isDark ? dark.textSecondary : light.textSecondary}
                  multiline
                  maxLength={1000}
                  autoFocus
                  textAlignVertical="top"
                />
                <Text style={[styles.bugCharCount, { color: isDark ? dark.textSecondary : light.textSecondary }]}>{bugDescription.length}/1000</Text>
                <Pressable
                  style={[styles.bugSendBtn, sendingReport && styles.bugSendBtnDisabled]}
                  onPress={handleSendBugReport}
                  disabled={sendingReport}
                >
                  {sendingReport ? (
                    <ActivityIndicator color={colors.white} size="small" />
                  ) : (
                    <>
                      <Send color={colors.white} size={16} strokeWidth={2} />
                      <Text style={styles.bugSendBtnText}>SEND REPORT</Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}

            {/* Notification Preferences */}
            <View style={{ marginTop: spacing['2xl'] }}>
              <SlideTag label="Notifications" variant="red" />
            </View>

            <View style={styles.menuGroup}>
              <ListRow
                icon={dailyReminder
                  ? <Bell color={colors.brand} size={20} strokeWidth={2} />
                  : <BellOff color={isDark ? dark.textSecondary : light.textSecondary} size={20} strokeWidth={2} />
                }
                label="Daily Reminder"
                value={dailyReminder ? 'On' : 'Off'}
                onPress={() => {
                  const next = !dailyReminder;
                  setDailyReminder(next);
                  AsyncStorage.setItem('bk_notif_prefs', JSON.stringify({ NFL: notifNFL, NBA: notifNBA, MLB: notifMLB, NHL: notifNHL, daily: next }));
                }}
              />
              {(['NFL', 'NBA', 'MLB', 'NHL'] as const).map(league => {
                const isOn = league === 'NFL' ? notifNFL : league === 'NBA' ? notifNBA : league === 'MLB' ? notifMLB : notifNHL;
                const setFn = league === 'NFL' ? setNotifNFL : league === 'NBA' ? setNotifNBA : league === 'MLB' ? setNotifMLB : setNotifNHL;
                return (
                  <ListRow
                    key={league}
                    icon={isOn
                      ? <Bell color={colors.brand} size={20} strokeWidth={2} />
                      : <BellOff color={isDark ? dark.textSecondary : light.textSecondary} size={20} strokeWidth={2} />
                    }
                    label={`${league} Updates`}
                    value={isOn ? 'On' : 'Off'}
                    onPress={() => {
                      const next = !isOn;
                      setFn(next);
                      const prefs = { NFL: notifNFL, NBA: notifNBA, MLB: notifMLB, NHL: notifNHL, daily: dailyReminder };
                      prefs[league] = next;
                      AsyncStorage.setItem('bk_notif_prefs', JSON.stringify(prefs));
                    }}
                  />
                );
              })}
            </View>

            {/* Privacy */}
            <View style={styles.menuGroup}>
              <ListRow
                icon={<Globe color={colors.brand} size={20} strokeWidth={2} />}
                label="Privacy Policy"
                onPress={() => Linking.openURL('https://ballknowledgeapp.com/privacy')}
              />
              <ListRow
                icon={<Globe color={colors.brand} size={20} strokeWidth={2} />}
                label="Terms of Service"
                onPress={() => Linking.openURL('https://ballknowledgeapp.com/terms')}
              />
            </View>

            {/* Danger Zone */}
            <View style={{ marginTop: spacing['2xl'] }}>
              <SlideTag label="Danger Zone" variant="red" />
            </View>

            <View style={styles.menuGroup}>
              <ListRow
                icon={signingOut
                  ? <ActivityIndicator size="small" color={colors.brand} />
                  : <LogOut color={colors.brand} size={20} strokeWidth={2} />
                }
                label="Log Out"
                onPress={handleLogOut}
                danger
              />
              <ListRow
                icon={<Trash2 color={colors.brand} size={20} strokeWidth={2} />}
                label="Delete Account"
                onPress={handleDeleteAccount}
                danger
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  zone1: {
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'] + spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    zIndex: 2,
  },
  backBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  zone1Title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: 3,
    color: dark.textPrimary,
  },
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    shadowColor: dark.background,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1,
  },
  zone2Content: {
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
    gap: spacing.md,
  },
  sectionHeader: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  card: {
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: dark.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  menuGroup: {
    borderRadius: 16,
    overflow: 'hidden',
    gap: 2,
  },
  settingLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
  },
  usernameEditRow: {
    gap: spacing.md,
  },
  usernameInput: {
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: spacing.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
  },
  savedText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.accentGreen,
    textAlign: 'center',
  },
  bugCard: {
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  bugLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
  },
  bugInput: {
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 100,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 22,
  },
  bugCharCount: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    textAlign: 'right',
    marginTop: -spacing.sm,
  },
  bugSendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: 12,
    backgroundColor: brand.primary,
  },
  bugSendBtnDisabled: {
    opacity: 0.6,
  },
  bugSendBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    color: colors.white,
  },
});
