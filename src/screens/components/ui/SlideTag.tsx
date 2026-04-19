import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { brand, dark, light, fonts } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

type Variant = 'red' | 'light' | 'white' | 'teal';

interface Props {
  label: string;
  variant: Variant;
}

function getVariantColors(variant: Variant) {
  switch (variant) {
    case 'red':
      return { text: brand.primary, border: 'rgba(252,52,92,0.3)' };
    case 'light':
      return { text: brand.light, border: 'rgba(255,113,145,0.4)' };
    case 'white':
      return { text: 'rgba(255,255,255,0.6)', border: 'rgba(255,255,255,0.2)' };
    case 'teal':
      return { text: brand.teal, border: 'rgba(7,188,204,0.35)' };
  }
}

export default function SlideTag({ label, variant }: Props) {
  const colors = getVariantColors(variant);
  return (
    <View style={[styles.pill, { borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
