import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { brand, dark, light, fonts, colors, darkColors, fontFamily, spacing } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';

interface AuthCallbackProps {
  error?: string | null;
}

/**
 * Shown briefly while the app processes an OAuth redirect on web.
 * App.tsx detects the hash fragment, lets Supabase pick up the session,
 * then navigates away once the auth state change fires.
 */
export default function AuthCallback({ error }: AuthCallbackProps) {
  const { isDark } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: isDark ? dark.background : light.background }]}>
      {error ? (
        <>
          <Text style={[styles.title, { color: brand.primary }]}>Sign-in failed</Text>
          <Text style={[styles.message, { color: isDark ? dark.textSecondary : light.textSecondary }]}>{error}</Text>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={brand.primary} />
          <Text style={[styles.message, { color: isDark ? dark.textSecondary : light.textSecondary }]}>Signing you in…</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '700',
    fontSize: 20,
    marginBottom: spacing.md,
  },
  message: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
