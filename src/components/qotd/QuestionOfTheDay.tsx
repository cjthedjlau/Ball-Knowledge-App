import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { MessageCircle, ChevronRight } from 'lucide-react-native';
import { brand, dark, light, fonts, fontSizes, spacing, radius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../lib/supabase';
import { getQuestionForDate } from '../../data/qotd-questions';

function getTodayEST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

interface Props {
  onPress: (question: string, questionId: string | null) => void;
}

export default function QuestionOfTheDay({ onPress }: Props) {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;
  const [question, setQuestion] = useState('');
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    const today = getTodayEST();
    const fallbackQ = getQuestionForDate(today);
    setQuestion(fallbackQ);

    // Try to load from Supabase (may have a curated question)
    void (async () => {
      try {
        const { data: qRow } = await supabase
          .from('qotd_questions')
          .select('id, question')
          .eq('date', today)
          .single();

        if (qRow) {
          setQuestion(qRow.question);
          setQuestionId(qRow.id);

          // Get response count
          const { count } = await supabase
            .from('qotd_responses')
            .select('id', { count: 'exact', head: true })
            .eq('question_id', qRow.id);

          setResponseCount(count ?? 0);
        } else {
          // Insert today's question from the bank
          const { data: inserted, error: insertErr } = await supabase
            .from('qotd_questions')
            .upsert({ date: today, question: fallbackQ }, { onConflict: 'date' })
            .select('id')
            .single();

          if (insertErr) {
            console.warn('[QotD] Failed to insert question:', insertErr.message);
          }
          if (inserted) setQuestionId(inserted.id);
        }
      } catch (err) {
        console.warn('[QotD] Failed to load question from DB:', err);
      }
    })();
  }, []);

  if (!question) return null;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { backgroundColor: t.card, borderColor: t.cardBorder, borderLeftColor: brand.teal }, pressed && styles.cardPressed]}
      onPress={() => onPress(question, questionId)}
    >
      <View style={styles.labelRow}>
        <MessageCircle size={16} color={brand.teal} strokeWidth={2.5} />
        <Text style={[styles.label, { color: brand.teal }]}>QUESTION OF THE DAY</Text>
      </View>

      <Text style={[styles.question, { color: t.textPrimary }]} numberOfLines={3}>
        {question}
      </Text>

      <View style={styles.footer}>
        <Text style={[styles.responseCount, { color: t.textSecondary }]}>
          {responseCount > 0 ? `${responseCount} ${responseCount === 1 ? 'response' : 'responses'}` : 'Be the first to answer'}
        </Text>
        <View style={styles.tapHint}>
          <Text style={[styles.tapHintText, { color: brand.teal }]}>Tap to answer</Text>
          <ChevronRight size={14} color={brand.teal} strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    width: '100%',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.label.fontSize - 3,
    letterSpacing: 2,
  },
  question: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.subhead.fontSize - 2,
    lineHeight: 28,
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  responseCount: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.small.fontSize + 1,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tapHintText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.small.fontSize + 1,
  },
});
