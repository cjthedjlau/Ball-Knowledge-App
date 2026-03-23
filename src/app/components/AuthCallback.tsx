import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, darkColors, fontFamily, spacing } from '../../styles/theme';

interface AuthCallbackProps {
  error?: string | null;
}

/**
 * Shown briefly while the app processes an OAuth redirect on web.
 * App.tsx detects the hash fragment, lets Supabase pick up the session,
 * then navigates away once the auth state change fires.
 */
export default function AuthCallback({ error }: AuthCallbackProps) {
  return (
    <View style={styles.container}>
      {error ? (
        <>
          <Text style={styles.title}>Sign-in failed</Text>
          <Text style={styles.message}>{error}</Text>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={styles.message}>Signing you in…</Text>
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
    backgroundColor: darkColors.background,
    padding: spacing.lg,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 20,
    color: colors.brand,
    marginBottom: spacing.md,
  },
  message: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: darkColors.textSecondary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
