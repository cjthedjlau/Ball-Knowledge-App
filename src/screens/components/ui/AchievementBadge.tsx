import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { colors, darkColors, fontFamily } from '../../../styles/theme';

interface AchievementBadgeProps {
  icon: ReactNode;
  label: string;
  unlocked: boolean;
  accentColor?: string;
}

export default function AchievementBadge({ icon, label, unlocked, accentColor }: AchievementBadgeProps) {
  const unlockedStyle = accentColor
    ? { backgroundColor: accentColor, shadowColor: accentColor }
    : {};

  return (
    <View style={[styles.tile, unlocked ? [styles.tileUnlocked, unlockedStyle] : styles.tileLocked]}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.label}>{label}</Text>

      {!unlocked && (
        <View style={styles.padlock}>
          <Lock color={colors.white} size={16} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 96,
    height: 96,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tileUnlocked: {
    backgroundColor: colors.brand,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  tileLocked: {
    backgroundColor: darkColors.surfaceElevated,
    opacity: 0.4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  iconWrap: {
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
    color: colors.white,
    textAlign: 'center',
  },
  padlock: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
});
