import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { brand, dark, light, fonts, colors } from '../styles/theme';
import { useTheme } from '../hooks/useTheme';

interface OfflineScreenProps {
  onRetry?: () => void;
  message?: string;
}

/**
 * Full-screen offline state shown when a screen can't load data.
 * Includes a retry button that re-attempts the fetch.
 */
export default function OfflineScreen({ onRetry, message }: OfflineScreenProps) {
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? dark.background : light.background }]}>
      <View style={styles.iconCircle}>
        <WifiOff color={brand.primary} size={32} strokeWidth={2} />
      </View>
      <Text style={[styles.title, { color: isDark ? dark.textPrimary : light.textPrimary }]}>
        No Connection
      </Text>
      <Text style={[styles.body, { color: isDark ? dark.textSecondary : light.textSecondary }]}>
        {message || 'Connect to the internet to load today\'s games.'}
      </Text>
      {onRetry && (
        <Pressable style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: brand.primary + '14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 8,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryBtn: {
    backgroundColor: brand.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 16,
    color: colors.white,
  },
});
