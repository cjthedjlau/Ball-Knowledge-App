import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { MessageCircle, ChevronRight } from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { getQuestionForDate } from '../../data/qotd-questions';

function getTodayEST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

interface Props {
  onPress: (question: string, questionId: string | null) => void;
}

export default function QuestionOfTheDay({ onPress }: Props) {
  const [question, setQuestion] = useState('');
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    const today = getTodayEST();
    const fallbackQ = getQuestionForDate(today);
    setQuestion(fallbackQ);

    // Try to load from Supabase (may have a curated question)
    void (async () => {
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
    })();
  }, []);

  if (!question) return null;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(question, questionId)}
    >
      <View style={styles.labelRow}>
        <MessageCircle size={16} color={colors.accentCyan} strokeWidth={2.5} />
        <Text style={styles.label}>QUESTION OF THE DAY</Text>
      </View>

      <Text style={styles.question} numberOfLines={3}>
        {question}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.responseCount}>
          {responseCount > 0 ? `${responseCount} ${responseCount === 1 ? 'response' : 'responses'}` : 'Be the first to answer'}
        </Text>
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to answer</Text>
          <ChevronRight size={14} color={colors.accentCyan} strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.accentCyan,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: colors.accentCyan,
  },
  question: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 20,
    color: colors.white,
    lineHeight: 28,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  responseCount: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tapHintText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.accentCyan,
  },
});
