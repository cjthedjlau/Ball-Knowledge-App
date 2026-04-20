import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { brand, dark, light, fonts, radius } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

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
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? dark.card : light.card,
          borderColor: isDark ? dark.cardBorder : light.cardBorder,
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
      <View style={styles.leftSection}>
        <View style={styles.iconWrap}>{leftIcon}</View>
        <Text
          style={[
            styles.leftLabel,
            { color: isDark ? dark.textSecondary : light.textSecondary },
          ]}
        >
          {leftLabel}
        </Text>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: isDark ? dark.divider : light.divider },
        ]}
      />

      <View style={styles.rightSection}>
        {rightRows.map((row, i) => (
          <View key={i} style={i > 0 ? styles.rightRow : undefined}>
            <Text
              style={[
                styles.rowLabel,
                { color: isDark ? dark.textSecondary : light.textSecondary },
              ]}
            >
              {row.label}
            </Text>
            <Text
              style={[
                styles.rowValue,
                { color: isDark ? dark.textPrimary : light.textPrimary },
              ]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: radius.primary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
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
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 15,
    marginTop: 4,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
  },
  rightSection: {
    flex: 1,
    paddingLeft: 16,
  },
  rightRow: {
    marginTop: 8,
  },
  rowLabel: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 15,
  },
  rowValue: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
    marginTop: 2,
  },
});
