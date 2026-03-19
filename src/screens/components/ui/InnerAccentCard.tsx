import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily } from '../../../styles/theme';

interface RightRow {
  label: string;
  value: string;
}

interface InnerAccentCardProps {
  leftIcon: ReactNode;
  leftLabel: string;
  rightRows: RightRow[];
}

export default function InnerAccentCard({
  leftIcon,
  leftLabel,
  rightRows,
}: InnerAccentCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={styles.iconWrap}>{leftIcon}</View>
        <Text style={styles.leftLabel}>{leftLabel}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.rightSection}>
        {rightRows.map((row, i) => (
          <View key={i} style={i > 0 ? styles.rightRow : undefined}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.accentCyan,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  leftSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
  },
  iconWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: 'rgba(255,255,255,0.80)',
    marginTop: 4,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.30)',
  },
  rightSection: {
    flex: 1,
    paddingLeft: 16,
  },
  rightRow: {
    marginTop: 8,
  },
  rowLabel: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 15,
    color: 'rgba(255,255,255,0.80)',
  },
  rowValue: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
    color: colors.white,
    marginTop: 2,
  },
});
