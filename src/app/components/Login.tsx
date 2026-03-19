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
import { supabase } from '../../lib/supabase';
import useZoneEntrance from '../../hooks/useZoneEntrance';

interface LoginProps {
  onLogin?: () => void;
}

// ── Social icon SVGs ──────────────────────────────────────────────────────────

function AppleIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d="M17.05 20.28c-.96.95-2.04 1.44-3.23 1.44-1.2 0-2.18-.41-2.95-.41-.77 0-1.87.41-3.05.41-2.13 0-4.04-1.21-5.13-3.12-2.21-3.85-.57-9.56 1.57-12.64 1.07-1.53 2.62-2.48 4.31-2.52 1.29-.02 2.5.87 3.29.87.79 0 2.23-1.07 3.79-.91 1.63.17 2.87.76 3.65 1.9-3.15 1.86-2.65 5.86.51 7.15-.81 1.94-1.84 3.86-3.26 5.23zm-3.35-15.68c-.04-2.15 1.77-3.95 3.84-4.14.23 2.47-2.11 4.58-3.84 4.14z"
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleLogin() {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErrorMsg('Invalid email or password');
    } else {
      onLogin?.();
    }
  }

  async function handleSignUp() {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Account created! You can now log in.');
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
          {!!successMsg && <Text style={styles.successMsg}>{successMsg}</Text>}

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <Pressable
              style={({ pressed }) => [
                styles.socialBtn,
                pressed && styles.socialBtnPressed,
              ]}
            >
              <AppleIcon />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.socialBtn,
                pressed && styles.socialBtnPressed,
              ]}
            >
              <GoogleIcon />
            </Pressable>
          </View>
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
  successMsg: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.accentGreen,
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
});
