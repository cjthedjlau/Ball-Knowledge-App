import React from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import { Film } from 'lucide-react-native';
import { brand, fonts, colors } from '../../styles/theme';
import { shouldShowAds } from '../../lib/adConfig';

interface RewardedAdButtonProps {
  label: string;
  onPress: () => void;
  isReady: boolean;
}

/**
 * A styled button for rewarded ad placements.
 * Only renders on native when ads are enabled and an ad is loaded.
 */
export default function RewardedAdButton({ label, onPress, isReady }: RewardedAdButtonProps) {
  if (Platform.OS === 'web' || !shouldShowAds() || !isReady) return null;

  return (
    <Pressable style={styles.btn} onPress={onPress}>
      <Film size={16} color={brand.primary} strokeWidth={2} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: brand.primary + '33',
    backgroundColor: brand.primary + '0A',
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 14,
    color: brand.primary,
  },
});
