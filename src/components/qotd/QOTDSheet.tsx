import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { supabase } from '../../lib/supabase';

interface Props {
  question: string;
  questionId: string | null;
  onClose: () => void;
}

interface ResponseEntry {
  id: string;
  body: string;
  username: string;
  created_at: string;
  is_mine: boolean;
}

export default function QOTDSheet({ question, questionId, onClose }: Props) {
  const [responses, setResponses] = useState<ResponseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadResponses = useCallback(async () => {
    if (!questionId) { setLoading(false); return; }

    const { data: { user } } = await supabase.auth.getUser();
    const uid = user?.id ?? null;
    setCurrentUserId(uid);

    const { data } = await supabase
      .from('qotd_responses')
      .select('id, body, user_id, created_at')
      .eq('question_id', questionId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      // Fetch usernames for all responders
      const userIds = [...new Set(data.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .in('id', userIds);

      const nameMap = new Map<string, string>();
      profiles?.forEach(p => nameMap.set(p.id, p.display_name || p.username || 'Anonymous'));

      const entries: ResponseEntry[] = data.map(r => ({
        id: r.id,
        body: r.body,
        username: nameMap.get(r.user_id) ?? 'Anonymous',
        created_at: r.created_at,
        is_mine: r.user_id === uid,
      }));

      setResponses(entries);
      setHasAnswered(entries.some(e => e.is_mine));
    }
    setLoading(false);
  }, [questionId]);

  useEffect(() => {
    void loadResponses();
  }, [loadResponses]);

  const handleSubmit = async () => {
    if (!answer.trim() || !questionId || !currentUserId) return;
    setSubmitting(true);

    const { error } = await supabase
      .from('qotd_responses')
      .upsert({
        question_id: questionId,
        user_id: currentUserId,
        body: answer.trim(),
      }, { onConflict: 'question_id,user_id' });

    setSubmitting(false);

    if (error) {
      console.warn('[QotD] Submit failed:', error.message);
      return;
    }

    setAnswer('');
    setHasAnswered(true);
    void loadResponses();
  };

  function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={8} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.white} strokeWidth={2.5} />
        </Pressable>
        <View style={styles.headerCenter}>
          <MessageCircle size={18} color={colors.brand} strokeWidth={2.5} />
          <Text style={styles.headerTitle}>Question of the Day</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Question card */}
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{question}</Text>
            <Text style={styles.responsesSummary}>
              {responses.length} {responses.length === 1 ? 'response' : 'responses'}
            </Text>
          </View>

          {/* Answer input */}
          {!hasAnswered ? (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>YOUR ANSWER</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Share your take..."
                  placeholderTextColor={darkColors.textSecondary}
                  multiline
                  maxLength={280}
                  autoFocus
                />
              </View>
              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>
                  {answer.length}/280
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.submitBtn,
                    (!answer.trim() || submitting) && styles.submitBtnDisabled,
                    pressed && answer.trim() && styles.submitBtnPressed,
                  ]}
                  onPress={handleSubmit}
                  disabled={!answer.trim() || submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Send size={16} color={colors.white} strokeWidth={2.5} />
                      <Text style={styles.submitBtnText}>SUBMIT</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.answeredBadge}>
              <Text style={styles.answeredText}>You've answered today's question</Text>
            </View>
          )}

          {/* Responses */}
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={colors.brand} />
            </View>
          ) : responses.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No responses yet. Be the first!</Text>
            </View>
          ) : (
            <View style={styles.responsesList}>
              <Text style={styles.responsesTitle}>RESPONSES</Text>
              {responses.map((r) => (
                <View
                  key={r.id}
                  style={[styles.responseCard, r.is_mine && styles.responseCardMine]}
                >
                  <View style={styles.responseHeader}>
                    <Text style={[styles.responseName, r.is_mine && styles.responseNameMine]}>
                      {r.is_mine ? 'You' : r.username}
                    </Text>
                    <Text style={styles.responseTime}>{timeAgo(r.created_at)}</Text>
                  </View>
                  <Text style={styles.responseBody}>{r.body}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 17,
    color: colors.white,
  },

  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
    maxWidth: 640,
    alignSelf: 'center' as const,
    width: '100%',
  },

  // Question card
  questionCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.brand,
  },
  questionText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 24,
    color: colors.white,
    lineHeight: 32,
    marginBottom: 12,
  },
  responsesSummary: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: darkColors.textSecondary,
  },

  // Input
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: colors.brand,
    marginBottom: 8,
  },
  inputRow: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: darkColors.border,
    minHeight: 100,
    padding: 16,
  },
  input: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.white,
    lineHeight: 24,
    textAlignVertical: 'top',
    minHeight: 68,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  charCount: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: darkColors.textSecondary,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    color: colors.white,
  },

  // Answered state
  answeredBadge: {
    backgroundColor: 'rgba(252,52,92,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(252,52,92,0.2)',
  },
  answeredText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.brand,
  },

  // Loading / empty
  loadingWrap: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyWrap: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: darkColors.textSecondary,
  },

  // Responses list
  responsesList: {
    gap: 12,
  },
  responsesTitle: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: darkColors.textSecondary,
    marginBottom: 4,
  },
  responseCard: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  responseCardMine: {
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseName: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.white,
  },
  responseNameMine: {
    color: colors.brand,
  },
  responseTime: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: darkColors.textSecondary,
  },
  responseBody: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: darkColors.text,
    lineHeight: 22,
  },
});
