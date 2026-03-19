import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { supabase } from '../../lib/supabase';

interface Props {
  onBack: () => void;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM → 11 PM

function formatHour(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour12}:00 ${period}`;
}

export default function NotificationsScreen({ onBack }: Props) {
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakAlert, setStreakAlert] = useState(true);
  const [newContent, setNewContent] = useState(true);
  const [reminderHour, setReminderHour] = useState(18); // 6 PM default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) { setLoading(false); return; }
      const { data } = await supabase
        .from('profiles')
        .select('notify_daily_reminder, notify_streak_alert, notify_new_content, last_play_hour')
        .eq('id', user.id)
        .single();
      if (!cancelled && data) {
        setDailyReminder(data.notify_daily_reminder ?? true);
        setStreakAlert(data.notify_streak_alert ?? true);
        setNewContent(data.notify_new_content ?? true);
        setReminderHour(data.last_play_hour ?? 18);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function persist(field: string, value: boolean | number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').upsert({ id: user.id, [field]: value });
  }

  function toggleDaily(val: boolean) {
    setDailyReminder(val);
    void persist('notify_daily_reminder', val);
  }

  function toggleStreak(val: boolean) {
    setStreakAlert(val);
    void persist('notify_streak_alert', val);
  }

  function toggleContent(val: boolean) {
    setNewContent(val);
    void persist('notify_new_content', val);
  }

  function selectHour(h: number) {
    setReminderHour(h);
    void persist('last_play_hour', h);
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Zone 1 */}
      <View style={styles.zone1}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.zone1Title}>NOTIFICATIONS</Text>
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
            {/* Daily Reminder */}
            <View style={styles.card}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextWrap}>
                  <Text style={styles.toggleLabel}>Daily Reminder</Text>
                  <Text style={styles.toggleDesc}>Remind me to play each day</Text>
                </View>
                <Switch
                  value={dailyReminder}
                  onValueChange={toggleDaily}
                  trackColor={{ false: darkColors.surfaceElevated, true: colors.brand }}
                  thumbColor={colors.white}
                />
              </View>

              {dailyReminder && (
                <View style={styles.timeSection}>
                  <Text style={styles.timeLabel}>Reminder Time: {formatHour(reminderHour)}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourRow}>
                    {HOURS.map(h => {
                      const isSelected = h === reminderHour;
                      return (
                        <Pressable
                          key={h}
                          onPress={() => selectHour(h)}
                          style={[styles.hourPill, isSelected && styles.hourPillSelected]}
                        >
                          <Text style={[styles.hourPillText, isSelected && styles.hourPillTextSelected]}>
                            {formatHour(h)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Streak Alert */}
            <View style={styles.card}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextWrap}>
                  <Text style={styles.toggleLabel}>Streak Alert</Text>
                  <Text style={styles.toggleDesc}>Warn me when my streak is at risk</Text>
                </View>
                <Switch
                  value={streakAlert}
                  onValueChange={toggleStreak}
                  trackColor={{ false: darkColors.surfaceElevated, true: colors.brand }}
                  thumbColor={colors.white}
                />
              </View>
            </View>

            {/* New Content */}
            <View style={styles.card}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextWrap}>
                  <Text style={styles.toggleLabel}>New Content</Text>
                  <Text style={styles.toggleDesc}>Notify me when new daily games are available</Text>
                </View>
                <Switch
                  value={newContent}
                  onValueChange={toggleContent}
                  trackColor={{ false: darkColors.surfaceElevated, true: colors.brand }}
                  thumbColor={colors.white}
                />
              </View>
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
    gap: spacing.lg,
  },

  // Cards
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextWrap: {
    flex: 1,
    marginRight: spacing.md,
  },
  toggleLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.text,
  },
  toggleDesc: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: darkColors.textSecondary,
    marginTop: 2,
  },

  // Time picker
  timeSection: {
    gap: spacing.sm,
  },
  timeLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  hourRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  hourPill: {
    backgroundColor: darkColors.background,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  hourPillSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  hourPillText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
    color: darkColors.textSecondary,
  },
  hourPillTextSelected: {
    color: colors.white,
  },
});
