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
import { SafeAreaView } from 'react-native-safe-area-context';
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
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import ListRow from '../../screens/components/ui/ListRow';
import LeagueSwitcher from '../../screens/components/ui/LeagueSwitcher';
import PrimaryButton from '../../screens/components/ui/PrimaryButton';
import { type Tab } from './ui/BottomNav';
import { useTheme } from '../../hooks/useTheme';
import { useUserAnalytics } from '../../lib/analytics';

interface Props {
  onBack: () => void;
  onNavigate: (tab: Tab | 'logout') => void;
}

export default function SettingsScreen({ onBack, onNavigate }: Props) {
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

  // TODO: implement delete account via Edge Function before re-exposing this UI

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Zone 1 */}
      <View style={styles.zone1}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.zone1Title}>SETTINGS</Text>
      </View>

      {/* Zone 2 */}
      <ScrollView
        style={styles.zone2}
        contentContainerStyle={styles.zone2Content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color={colors.brand} style={{ marginTop: spacing['3xl'] }} />
        ) : (
          <>
            {/* Account Section */}
            <Text style={styles.sectionHeader}>ACCOUNT</Text>

            <View style={styles.card}>
              {editingUsername ? (
                <View style={styles.usernameEditRow}>
                  <TextInput
                    style={styles.usernameInput}
                    value={username}
                    onChangeText={(t) => { setUsername(t); setUsernameSaved(false); }}
                    placeholder="Username"
                    placeholderTextColor={darkColors.textSecondary}
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
            <Text style={[styles.sectionHeader, { marginTop: spacing['2xl'] }]}>APP</Text>

            <View style={styles.card}>
              <Text style={styles.settingLabel}>DEFAULT LEAGUE</Text>
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
              <View style={styles.bugCard}>
                <Text style={styles.bugLabel}>DESCRIBE THE ISSUE</Text>
                <TextInput
                  style={styles.bugInput}
                  value={bugDescription}
                  onChangeText={setBugDescription}
                  placeholder="What happened? Steps to reproduce…"
                  placeholderTextColor={darkColors.textSecondary}
                  multiline
                  maxLength={1000}
                  autoFocus
                  textAlignVertical="top"
                />
                <Text style={styles.bugCharCount}>{bugDescription.length}/1000</Text>
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

            {/* Danger Zone */}
            <Text style={[styles.sectionHeader, { marginTop: spacing['2xl'] }]}>DANGER ZONE</Text>

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
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  zone1: {
    backgroundColor: colors.brand,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'] + spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    fontSize: 28,
    letterSpacing: 3,
    color: colors.white,
  },
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
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
    color: darkColors.textSecondary,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000',
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
    color: darkColors.textSecondary,
  },
  usernameEditRow: {
    gap: spacing.md,
  },
  usernameInput: {
    backgroundColor: darkColors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkColors.border,
    height: 48,
    paddingHorizontal: spacing.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: darkColors.text,
  },
  savedText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.accentGreen,
    textAlign: 'center',
  },
  bugCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  bugLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: darkColors.textSecondary,
  },
  bugInput: {
    backgroundColor: darkColors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkColors.border,
    minHeight: 100,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: darkColors.text,
    lineHeight: 22,
  },
  bugCharCount: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: darkColors.textSecondary,
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
    backgroundColor: colors.brand,
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
