import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { brand, dark, light, fonts } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

interface Props {
  accentText: string;
  accentColor?: string;
  title: string;
  detail?: string;
  showTopBorder?: boolean;
  showBottomBorder?: boolean;
}

export default function TimelineRow({ accentText, accentColor, title, detail, showTopBorder, showBottomBorder }: Props) {
  const { isDark } = useTheme();
  const dividerColor = isDark ? dark.divider : light.divider;
  const titleColor = isDark ? dark.textPrimary : light.textPrimary;
  const detailColor = isDark ? dark.textSecondary : light.textSecondary;

  return (
    <View style={[
      styles.row,
      showTopBorder && { borderTopWidth: 1, borderTopColor: dividerColor },
      showBottomBorder && { borderBottomWidth: 1, borderBottomColor: dividerColor },
    ]}>
      <Text style={[styles.accent, { color: accentColor || brand.primary }]}>{accentText}</Text>
      <View style={styles.right}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        {detail ? <Text style={[styles.detail, { color: detailColor }]}>{detail}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  accent: {
    fontFamily: fonts.display,
    fontSize: 26,
    minWidth: 56,
  },
  right: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  detail: {
    fontFamily: fonts.body,
    fontSize: 11,
    marginTop: 2,
  },
});
