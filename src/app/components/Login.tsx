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
    <Svg width={24} height={24} viewBox="0 0 814.18 1000">
      <Path
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.2-81-105.6-207.3-105.6-327.2 0-192.8 125.3-295.2 248.7-295.2 65.5 0 120.1 43 161.3 43 39.2 0 100.5-45.6 175.4-45.6 28.3 0 130.2 2.6 197.8 99.4zm-234.7-182.6c31.2-36.9 53.4-88.1 53.4-139.3 0-7.1-.6-14.3-1.9-20.1-50.9 1.9-110.8 33.8-147.1 75.8-28.3 32.5-56.6 83.7-56.6 135.6 0 7.8.6 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.6 0 103-30.5 140.7-71.5z"
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
