import React from 'react';
import { View, StyleSheet } from 'react-native';
import { brand, dark, light, radius } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

const sizes = {
  sm: 40,
  md: 48,
  lg: 56,
} as const;

interface IconPillProps {
  icon: React.ReactNode;
  size?: keyof typeof sizes;
}

export default function IconPill({ icon, size = 'md' }: IconPillProps) {
  const { isDark } = useTheme();
  const dimension = sizes[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          backgroundColor: isDark ? dark.tagBg : light.tagBg,
        },
      ]}
    >
      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
