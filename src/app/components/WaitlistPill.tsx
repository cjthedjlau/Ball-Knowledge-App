import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { colors, fontFamily, spacing } from '../../styles/theme';

interface Props {
  onPress: () => void;
}

export default function WaitlistPill({ onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
      onPress={onPress}
    >
      <Bell size={13} color={colors.white} strokeWidth={2.5} />
      <Text style={styles.label}>Join Waitlist</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    bottom: 84,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.brand,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 200,
  },
  pillPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  label: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.white,
  },
});
