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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { brand, dark, light, colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
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
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
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
    <View style={styles.root}>
      {/* Zone 1 */}
      <View style={[styles.zone1, { backgroundColor: brand.primary, paddingTop: insets.top + spacing.lg }]}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={22} color={dark.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.zone1Title}>NOTIFICATIONS</Text>
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
            {/* Daily Reminder */}
            <View style={[styles.card, {
              backgroundColor: isDark ? dark.card : light.card,
              borderTopColor: isDark ? dark.cardBorder : light.cardBorder,
            }]}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextWrap}>
                  <Text style={[styles.toggleLabel, { color: isDark ? dark.textPrimary : light.textPrimary }]}>Daily Reminder</Text>
                  <Text style={[styles.toggleDesc, { color: isDark ? dark.textSecondary : light.textSecondary }]}>Remind me to play each day</Text>
                </View>
                <Switch
                  value={dailyReminder}
                  onValueChange={toggleDaily}
                  trackColor={{ false: isDark ? dark.surface : light.surface, true: brand.primary }}
                  thumbColor={isDark ? dark.textPrimary : light.card}
                />
              </View>

              {dailyReminder && (
                <View style={styles.timeSection}>
                  <Text style={[styles.timeLabel, { color: isDark ? dark.textSecondary : light.textSecondary }]}>Reminder Time: {formatHour(reminderHour)}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourRow}>
                    {HOURS.map(h => {
                      const isSelected = h === reminderHour;
                      return (
                        <Pressable
                          key={h}
                          onPress={() => selectHour(h)}
                          style={[
                            styles.hourPill,
                            {
                              backgroundColor: isDark ? dark.background : light.surface,
                              borderColor: isDark ? dark.cardBorder : light.cardBorder,
                            },
                            isSelected && { backgroundColor: brand.primary, borderColor: brand.primary },
                          ]}
                        >
                          <Text style={[
                            styles.hourPillText,
                            { color: isDark ? dark.textSecondary : light.textSecondary },
                            isSelected && { color: dark.textPrimary },
                          ]}>
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
            <View style={[styles.card, {
              backgroundColor: isDark ? dark.card : light.card,
              borderTopColor: isDark ? dark.cardBorder : light.cardBorder,
            }]}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextWrap}>
                  <Text style={[styles.toggleLabel, { color: isDark ? dark.textPrimary : light.textPrimary }]}>Streak Alert</Text>
                  <Text style={[styles.toggleDesc, { color: isDark ? dark.textSecondary : light.textSecondary }]}>Warn me when my streak is at risk</Text>
                </View>
                <Switch
                  value={streakAlert}
                  onValueChange={toggleStreak}
                  trackColor={{ false: isDark ? dark.surface : light.surface, true: brand.primary }}
                  thumbColor={isDark ? dark.textPrimary : light.card}
                />
              </View>
            </View>

            {/* New Content */}
            <View style={[styles.card, {
              backgroundColor: isDark ? dark.card : light.card,
              borderTopColor: isDark ? dark.cardBorder : light.cardBorder,
            }]}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextWrap}>
                  <Text style={[styles.toggleLabel, { color: isDark ? dark.textPrimary : light.textPrimary }]}>New Content</Text>
                  <Text style={[styles.toggleDesc, { color: isDark ? dark.textSecondary : light.textSecondary }]}>Notify me when new daily games are available</Text>
                </View>
                <Switch
                  value={newContent}
                  onValueChange={toggleContent}
                  trackColor={{ false: isDark ? dark.surface : light.surface, true: brand.primary }}
                  thumbColor={isDark ? dark.textPrimary : light.card}
                />
              </View>
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
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: 3,
    color: dark.textPrimary,
  },
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 0,
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
    gap: spacing.lg,
  },

  // Cards
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
  },
  toggleDesc: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
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
  },
  hourRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  hourPill: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
  },
  hourPillText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 12,
  },
});
