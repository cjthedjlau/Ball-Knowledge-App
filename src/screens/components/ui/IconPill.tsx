import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

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
  const dimension = sizes[size];

  return (
    <View
      style={[
        styles.container,
        { width: dimension, height: dimension },
      ]}
    >
      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    backgroundColor: colors.brandAlpha15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
