import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../../../styles/theme';

interface Props {
  source: string;
  quote: string;
}

export default function QuoteBox({ source, quote }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.source}>{source.toUpperCase()}</Text>
      <Text style={styles.quote}>{quote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  source: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 6,
  },
  quote: {
    fontFamily: fonts.body,
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 18.85,
  },
});
