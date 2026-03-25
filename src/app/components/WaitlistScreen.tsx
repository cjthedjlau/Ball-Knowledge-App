import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Bell, CheckCircle } from 'lucide-react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { supabase } from '../../lib/supabase';

interface Props {
  onDismiss: () => void;
}

export default function WaitlistScreen({ onDismiss }: Props) {
  const [email, setEmail] = useState('');
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setAccountEmail(user.email);
        setEmail(user.email);
      }
    });
  }, []);

  async function handleSubmit() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from('waitlist').insert({
      email: trimmed,
      user_id: user?.id ?? null,
    });
    setLoading(false);
    if (insertError) {
      if (insertError.code === '23505') {
        // Already on waitlist — treat as success
        setSuccess(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.zone1}>
          <Pressable onPress={onDismiss} style={styles.closeBtn} hitSlop={8}>
            <X size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.zone1Title}>YOU'RE ON THE LIST</Text>
        </View>
        <View style={[styles.zone2, styles.successZone]}>
          <CheckCircle size={72} color={colors.brand} strokeWidth={1.5} />
          <Text style={styles.successTitle}>You're in!</Text>
          <Text style={styles.successBody}>
            We'll email you the moment Ball Knowledge drops on the App Store. Thanks for being an early supporter.
          </Text>
          <Pressable style={styles.submitBtn} onPress={onDismiss}>
            <Text style={styles.submitBtnText}>DONE</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Zone 1 */}
        <View style={styles.zone1}>
          <Pressable onPress={onDismiss} style={styles.closeBtn} hitSlop={8}>
            <X size={22} color={colors.white} strokeWidth={2.5} />
          </Pressable>
          <Bell size={28} color={colors.white} strokeWidth={1.5} style={{ marginBottom: spacing.sm }} />
          <Text style={styles.zone1Title}>JOIN THE WAITLIST</Text>
        </View>

        {/* Zone 2 */}
        <ScrollView
          style={styles.zone2}
          contentContainerStyle={styles.zone2Content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Thank you for your interest in Ball Knowledge.</Text>
          <Text style={styles.body}>
            Sign up to be notified when the Ball Knowledge app is live on the App Store.
          </Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>YOUR EMAIL</Text>
            <View style={[styles.inputWrap, emailFocused && styles.inputWrapFocused]}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                placeholder="Enter your email"
                placeholderTextColor={darkColors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                onSubmitEditing={handleSubmit}
              />
            </View>
            {accountEmail && accountEmail !== email.trim().toLowerCase() && (
              <Pressable
                style={styles.useAccountBtn}
                onPress={() => { setEmail(accountEmail); setError(''); }}
              >
                <Text style={styles.useAccountText}>
                  Use account email: {accountEmail}
                </Text>
              </Pressable>
            )}
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.submitBtnText}>NOTIFY ME</Text>
            }
          </Pressable>

          <Pressable onPress={onDismiss} style={styles.skipBtn}>
            <Text style={styles.skipText}>No thanks</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
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
  closeBtn: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  zone1Title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 26,
    letterSpacing: 3,
    color: colors.white,
  },
  zone2: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    zIndex: 1,
  },
  zone2Content: {
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
    gap: spacing.xl,
  },
  successZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
    marginTop: -32,
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 22,
    color: colors.white,
    lineHeight: 30,
  },
  body: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: darkColors.textSecondary,
    lineHeight: 24,
    marginTop: -spacing.sm,
  },
  fieldBlock: {
    gap: spacing.sm,
  },
  fieldLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: darkColors.textSecondary,
  },
  inputWrap: {
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    height: 56,
    borderWidth: 1.5,
    borderColor: darkColors.border,
    justifyContent: 'center',
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
  inputWrapFocused: {
    borderColor: colors.brand,
    borderTopColor: colors.brand,
    borderBottomColor: colors.brand,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
  },
  input: {
    height: '100%',
    paddingHorizontal: spacing.lg,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.white,
  },
  useAccountBtn: {
    alignSelf: 'flex-start',
  },
  useAccountText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.brand,
    textDecorationLine: 'underline',
  },
  errorText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.accentRed,
    marginTop: -spacing.sm,
  },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 1,
    color: colors.white,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: darkColors.textSecondary,
  },
  successTitle: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 36,
    color: colors.white,
    letterSpacing: 1,
  },
  successBody: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: darkColors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
});
