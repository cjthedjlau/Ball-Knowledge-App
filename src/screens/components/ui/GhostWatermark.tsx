import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { brand, fonts } from '../../../styles/theme';

interface Props {
  text: string;
  color?: string;
}

export default function GhostWatermark({ text, color }: Props) {
  return (
    <Text
      style={[styles.watermark, color ? { color } : undefined]}
      pointerEvents="none"
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  watermark: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    fontFamily: fonts.display,
    fontSize: 200,
    color: 'rgba(255,255,255,0.04)',
    zIndex: 0,
  },
});
