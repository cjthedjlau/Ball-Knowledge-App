import React, { useState } from 'react';
import {
  Animated,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { supabase, signInWithGoogle } from '../../lib/supabase';
import useZoneEntrance from '../../hooks/useZoneEntrance';
import { useUserAnalytics } from '../../lib/analytics';

interface LoginProps {
  onLogin?: () => void;
}

/** Ensure a profile row exists for the current user. Called after every successful auth. */
async function ensureProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!data) {
      const username =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'Player';

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username,
        lifetime_xp: 0,
        weekly_xp: 0,
        level: 1,
        streak: 0,
        streak_at_risk: false,
        favorite_league: 'NBA',
      });
      if (error) {
        console.error('[Login] Profile creation failed:', error.message);
      } else {
        console.log('[Login] Profile created for user:', user.id);
      }
    }
  } catch (err) {
    console.error('[Login] ensureProfile error:', err);
  }
}

// ── Social icon SVGs ──────────────────────────────────────────────────────────

function AppleIcon() {
  return (
    <Svg width={17} height={20} viewBox="0 0 170 200">
      <Path
        d="M150.4 172.3c-7.8 11.6-16.3 23.1-29.1 23.3-12.8.2-16.9-7.5-31.5-7.5-14.6 0-19.2 7.3-31.3 7.7-12.5.4-22-12.5-29.9-24.1C13 148.6 1.2 107.5 17.3 79.3c8-14 22.3-22.9 37.9-23.1 12.3-.2 24 8.3 31.5 8.3 7.5 0 21.7-10.3 36.5-8.8 6.2.3 23.7 2.5 34.9 19-0.9.6-20.9 12.2-20.7 36.4.2 28.9 25.4 38.5 25.6 38.6-.2.6-4 13.7-13.3 27.2l-0.3-.6zM119.9 20c6-7.3 10-17.3 8.9-27.4-8.6.4-19 5.7-25.2 13-5.5 6.4-10.4 16.7-9.1 26.6 9.6.7 19.4-4.9 25.4-12.2z"
        fill={colors.white}
      />
    </Svg>
  );
}

function GoogleIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </Svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Login({ onLogin }: LoginProps) {
  const { zone1Style, zone2Style } = useZoneEntrance();
  const { trackLogin, trackSignup } = useUserAnalytics();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLogin() {
    setErrorMsg('');
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setErrorMsg(error.message);
    } else {
      if (data.user) trackLogin('email', data.user.id);
      await ensureProfile();
      setLoading(false);
      onLogin?.();
    }
  }

  async function handleGuest() {
    setErrorMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      setLoading(false);
      setErrorMsg(error.message);
    } else {
      await ensureProfile();
      setLoading(false);
      onLogin?.();
    }
  }

  async function handleAppleSignIn() {
    setErrorMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      onLogin?.();
    }
  }

  async function handleGoogleSignIn() {
    setErrorMsg('');
    setSocialLoading(true);
    const result = await signInWithGoogle();
    setSocialLoading(false);
    if (result.error) {
      setErrorMsg(result.error.message);
    } else if (result.data?.session) {
      // Native: in-app browser OAuth completed and session is established
      trackLogin('google', result.data.session.user.id);
      await ensureProfile();
      onLogin?.();
    }
    // On web, the page redirects — onLogin is handled by AuthCallback / App.tsx
  }

  async function handleSignUp() {
    setErrorMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      setErrorMsg(error.message);
    } else {
      trackSignup('email');
      await ensureProfile();
      setLoading(false);
      onLogin?.();
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Zone 1: Header ── */}
        <Animated.View style={[styles.zone1, zone1Style]}>
          <Text style={styles.title}>Welcome Back</Text>
        </Animated.View>

        {/* ── Zone 2: Content Sheet ── */}
        <Animated.View style={[styles.zone2, zone2Style]}>
        <ScrollView
          contentContainerStyle={styles.zone2Content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Email / Username */}
          <Text style={styles.fieldLabel}>Username or Email</Text>
          <View style={[styles.inputWrap, emailFocused && styles.inputWrapFocused]}>
            <TextInput
              style={styles.input}
              placeholder="Enter your username or email"
              placeholderTextColor={darkColors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          {/* Password */}
          <Text style={[styles.fieldLabel, { marginTop: 20 }]}>Password</Text>
          <View style={[styles.inputWrap, passwordFocused && styles.inputWrapFocused]}>
            <TextInput
              style={[styles.input, { paddingRight: 8 }]}
              placeholder="Enter your password"
              placeholderTextColor={darkColors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <Pressable
              onPress={() => setShowPassword(v => !v)}
              style={styles.eyeBtn}
              hitSlop={8}
            >
              {showPassword
                ? <EyeOff color={darkColors.textSecondary} size={20} />
                : <Eye color={darkColors.textSecondary} size={20} />
              }
            </Pressable>
          </View>

          {/* Forgot Password */}
          <Pressable style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          {/* Log In */}
          <Pressable
            style={[styles.authBtn, loading && styles.authBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.authBtnText}>LOG IN</Text>
            }
          </Pressable>

          {/* Sign Up */}
          <Pressable
            style={[styles.authBtn, styles.authBtnSecondary, loading && styles.authBtnDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.authBtnText}>SIGN UP</Text>
            }
          </Pressable>

          {/* Feedback messages */}
          {!!errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign In — full-width button on web, icon circle on native */}
          {Platform.OS === 'web' ? (
            <Pressable
              style={({ pressed }) => [
                styles.googleWebBtn,
                pressed && styles.googleWebBtnPressed,
              ]}
              onPress={handleGoogleSignIn}
              disabled={loading || socialLoading}
            >
              {socialLoading ? (
                <ActivityIndicator color={darkColors.text} />
              ) : (
                <>
                  <GoogleIcon />
                  <Text style={styles.googleWebBtnText}>Continue with Google</Text>
                </>
              )}
            </Pressable>
          ) : (
            <View style={styles.socialRow}>
              {/* TODO: TEMPORARY — Apple Sign In button removed until Apple OAuth credentials are configured.
                  To restore: uncomment the Apple button below and remove this comment.
                  See also: handleAppleSignIn() and AppleIcon() which are still in place. */}
              {/* <Pressable
                style={({ pressed }) => [
                  styles.socialBtn,
                  pressed && styles.socialBtnPressed,
                ]}
                onPress={handleAppleSignIn}
                disabled={loading}
              >
                <AppleIcon />
              </Pressable> */}
              <Pressable
                style={({ pressed }) => [
                  styles.socialBtn,
                  pressed && styles.socialBtnPressed,
                ]}
                onPress={handleGoogleSignIn}
                disabled={loading || socialLoading}
              >
                {socialLoading ? (
                  <ActivityIndicator color={darkColors.textSecondary} size="small" />
                ) : (
                  <GoogleIcon />
                )}
              </Pressable>
            </View>
          )}

          {/* Guest access */}
          <Pressable
            style={({ pressed }) => [styles.guestBtn, pressed && styles.guestBtnPressed]}
            onPress={handleGuest}
            disabled={loading}
          >
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
            <Text style={styles.guestBtnSubtext}>No stats recorded</Text>
          </Pressable>
        </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },

  // ── Zone 1 ──
  zone1: {
    backgroundColor: colors.brand,
    paddingTop: spacing['5xl'],
    paddingBottom: spacing['4xl'] + spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: 1,
    color: colors.white,
  },

  // ── Zone 2 ──
  zone2: {
    flex: 1,
    backgroundColor: darkColors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    marginTop: -32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 20,
  },
  zone2Content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['3xl'],
  },

  // ── Input fields ──
  fieldLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    color: colors.white,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 12,
    height: 56,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderTopWidth: 1,
    borderBottomWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  inputWrapFocused: {
    borderColor: colors.brand,
    borderTopColor: colors.brand,
    borderBottomColor: colors.brand,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.lg,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.white,
  },
  eyeBtn: {
    paddingHorizontal: spacing.lg,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Forgot password ──
  forgotWrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  forgotText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    color: colors.accentCyan,
  },

  // ── Auth buttons ──
  authBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  authBtnSecondary: {
    backgroundColor: darkColors.surfaceElevated,
    borderWidth: 1,
    borderColor: darkColors.border,
  },
  authBtnDisabled: {
    opacity: 0.6,
  },
  authBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
    color: colors.white,
  },

  // ── Feedback messages ──
  errorMsg: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.accentRed,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  // ── Divider ──
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing['2xl'],
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: darkColors.border,
  },
  dividerText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: darkColors.textSecondary,
  },

  // ── Google web button ──
  googleWebBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.white,
    gap: spacing.md,
    marginBottom: spacing['3xl'],
  },
  googleWebBtnPressed: {
    opacity: 0.85,
    transform: [{ translateY: 1 }],
  },
  googleWebBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: darkColors.surface,
  },

  // ── Social buttons ──
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: spacing['3xl'],
  },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: darkColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: darkColors.border,
    borderRightColor: darkColors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  socialBtnPressed: {
    opacity: 0.8,
    transform: [{ translateY: 2 }],
  },

  // ── Guest button ──
  guestBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  guestBtnPressed: {
    opacity: 0.6,
  },
  guestBtnText: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: darkColors.textSecondary,
  },
  guestBtnSubtext: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: darkColors.textSecondary,
    opacity: 0.6,
    marginTop: 4,
  },
});
