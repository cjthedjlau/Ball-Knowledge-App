import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { brand, fonts } from '../../../styles/theme';

interface Props {
  text: string;
}

export default function HighlightPill({ text }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(252,52,92,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(252,52,92,0.18)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: brand.primary,
    lineHeight: 15.4,
  },
});
