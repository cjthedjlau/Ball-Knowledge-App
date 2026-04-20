import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { brand, dark, light, fonts, radius } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

interface AchievementBadgeProps {
  icon: ReactNode;
  label: string;
  unlocked: boolean;
  accentColor?: string;
}

export default function AchievementBadge({ icon, label, unlocked, accentColor }: AchievementBadgeProps) {
  const { isDark } = useTheme();

  const unlockedStyle = accentColor
    ? { backgroundColor: accentColor }
    : { backgroundColor: brand.primary };

  return (
    <View
      style={[
        styles.tile,
        unlocked
          ? unlockedStyle
          : {
              backgroundColor: isDark ? dark.card : light.card,
              borderWidth: 1,
              borderColor: isDark ? dark.cardBorder : light.cardBorder,
              opacity: 0.4,
              ...(isDark
                ? {}
                : {
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  }),
            },
      ]}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <Text
        style={[
          styles.label,
          { color: unlocked ? dark.textPrimary : (isDark ? dark.textPrimary : light.textPrimary) },
        ]}
      >
        {label}
      </Text>

      {!unlocked && (
        <View style={styles.padlock}>
          <Lock color={isDark ? dark.textSecondary : light.textSecondary} size={16} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 96,
    height: 96,
    borderRadius: radius.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  iconWrap: {
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
    textAlign: 'center',
  },
  padlock: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
});
