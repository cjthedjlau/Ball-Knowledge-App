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
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import GhostWatermark from '../../screens/components/ui/GhostWatermark';
import { brand, dark, light, fonts, fontSizes, colors, darkColors, fontFamily, spacing, radius, layout } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { supabase, signInWithGoogle, getRedirectUri } from '../../lib/supabase';
import useZoneEntrance from '../../hooks/useZoneEntrance';
import { useUserAnalytics } from '../../lib/analytics';
// Conditionally load native Apple auth (iOS only)
const AppleAuthentication = Platform.OS === 'ios' ? require('expo-apple-authentication') : null;
const SHOW_APPLE_SIGN_IN = Platform.OS !== 'android'; // Show on iOS (native) and web (OAuth)

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

      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        username,
        lifetime_xp: 0,
        weekly_xp: 0,
        level: 1,
        streak: 0,
        streak_at_risk: false,
        favorite_league: 'NBA',
      }).select().single();
      if (error && error.code !== '23505') {
        // 23505 = unique violation (profile already exists) — that's fine, skip it
        console.error('[Login] Profile creation failed:', error.message);
      } else if (!error) {
        console.log('[Login] Profile created for user:', user.id);
      }
    }
  } catch (err) {
    console.error('[Login] ensureProfile error:', err);
  }
}

// ── Social icon SVGs ──────────────────────────────────────────────────────────

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

function AppleIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000000" />
    </Svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Login({ onLogin }: LoginProps) {
  const { isDark } = useTheme();
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

  async function handleAppleSignIn() {
    setErrorMsg('');
    setSocialLoading(true);

    if (Platform.OS === 'ios' && AppleAuthentication) {
      // Native iOS: use expo-apple-authentication
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [0, 1], // FULL_NAME, EMAIL
        });
        if (credential.identityToken) {
          const { error, data } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: credential.identityToken,
          });
          if (error) {
            setErrorMsg(error.message);
          } else if (data.user) {
            trackLogin('apple', data.user.id);
            await ensureProfile();
            onLogin?.();
          }
        }
      } catch (e: any) {
        if (e.code !== 'ERR_REQUEST_CANCELED') {
          setErrorMsg(e.message || 'Apple Sign In failed');
        }
      }
    } else {
      // Web: use Supabase OAuth redirect (same pattern as Google)
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'apple',
          options: { redirectTo: getRedirectUri() },
        });
        if (error) setErrorMsg(error.message);
        // On web, page redirects — onLogin handled by AuthCallback / App.tsx
      } catch (e: any) {
        setErrorMsg(e.message || 'Apple Sign In failed');
      }
    }

    setSocialLoading(false);
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
    <View style={styles.root}>
      <LinearGradient
        colors={brand.gradient as unknown as string[]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <GhostWatermark text="BK" color="rgba(255,255,255,0.04)" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Logo circle ── */}
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>BK</Text>
            </View>

            {/* ── Headline ── */}
            <Text style={styles.headline}>Welcome{'\n'}Back</Text>
            <Text style={styles.subtitle}>Sign in to continue tracking your knowledge</Text>

            {/* Email / Username */}
            <View style={[styles.inputWrap, emailFocused && styles.inputWrapFocused]}>
              <TextInput
                style={styles.input}
                placeholder="Username or email"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* Password */}
            <View style={[styles.inputWrap, passwordFocused && styles.inputWrapFocused]}>
              <TextInput
                style={[styles.input, { paddingRight: 8 }]}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.4)"
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
                  ? <EyeOff color="rgba(255,255,255,0.5)" size={20} />
                  : <Eye color="rgba(255,255,255,0.5)" size={20} />
                }
              </Pressable>
            </View>

            {/* Forgot Password */}
            <Pressable style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>

            {/* Log In — white pill */}
            <Pressable
              style={[styles.authBtn, loading && styles.authBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={brand.dark} />
                : <Text style={styles.authBtnText}>LOG IN</Text>
              }
            </Pressable>

            {/* Sign Up — white pill */}
            <Pressable
              style={[styles.authBtn, styles.authBtnOutline, loading && styles.authBtnDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={brand.dark} />
                : <Text style={[styles.authBtnText, styles.authBtnOutlineText]}>SIGN UP</Text>
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

            {/* Google Sign In — white pill */}
            {Platform.OS === 'web' ? (
              <Pressable
                style={({ pressed }) => [
                  styles.authBtn,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handleGoogleSignIn}
                disabled={loading || socialLoading}
              >
                {socialLoading ? (
                  <ActivityIndicator color={brand.dark} />
                ) : (
                  <View style={styles.googleRow}>
                    <GoogleIcon />
                    <Text style={styles.authBtnText}>Continue with Google</Text>
                  </View>
                )}
              </Pressable>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.authBtn,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handleGoogleSignIn}
                disabled={loading || socialLoading}
              >
                {socialLoading ? (
                  <ActivityIndicator color={brand.dark} size="small" />
                ) : (
                  <View style={styles.googleRow}>
                    <GoogleIcon />
                    <Text style={styles.authBtnText}>Continue with Google</Text>
                  </View>
                )}
              </Pressable>
            )}

            {/* Apple Sign In — iOS + Web (not Android) */}
            {SHOW_APPLE_SIGN_IN && (
              <Pressable
                style={({ pressed }) => [
                  styles.authBtn,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handleAppleSignIn}
                disabled={loading || socialLoading}
              >
                {socialLoading ? (
                  <ActivityIndicator color={brand.dark} size="small" />
                ) : (
                  <View style={styles.googleRow}>
                    <AppleIcon />
                    <Text style={styles.authBtnText}>Continue with Apple</Text>
                  </View>
                )}
              </Pressable>
            )}

            {/* Guest access */}
            <Pressable
              style={({ pressed }) => [styles.guestBtn, pressed && { opacity: 0.5 }]}
              onPress={handleGuest}
              disabled={loading}
            >
              <Text style={styles.guestBtnText}>Continue as Guest</Text>
              <Text style={styles.guestBtnSubtext}>No stats recorded</Text>
            </Pressable>

            {/* Handle line */}
            <Text style={styles.handleLine}>ballknowledge.app</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['4xl'],
    paddingBottom: spacing['3xl'],
    alignItems: 'center',
  },

  // ── Logo ──
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  logoText: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  // ── Headline ──
  headline: {
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 66,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  },

  // ── Input fields ──
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    height: layout.buttonHeight,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    marginBottom: spacing.md,
  },
  inputWrapFocused: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.xl,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: '#FFFFFF',
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
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  forgotText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },

  // ── Auth buttons — white pill ──
  authBtn: {
    width: '100%',
    height: layout.buttonHeight,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  authBtnOutline: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  authBtnDisabled: {
    opacity: 0.6,
  },
  authBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1,
    color: brand.dark,
  },
  authBtnOutlineText: {
    color: '#FFFFFF',
  },

  // ── Google row ──
  googleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  // ── Feedback messages ──
  errorMsg: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },

  // ── Divider ──
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },

  // ── Guest button ──
  guestBtn: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
  },
  guestBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  guestBtnSubtext: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 4,
  },

  // ── Handle line ──
  handleLine: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
