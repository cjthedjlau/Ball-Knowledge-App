import React from 'react';
import { Pressable, View, Text, StyleSheet, type PressableProps } from 'react-native';
import { brand, dark, light, fonts, radius, colors } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';
import IconPill from './IconPill';

type GameStatus = 'unplayed' | 'completed' | 'multiplayer';

interface GameCardProps extends Omit<PressableProps, 'children'> {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  status: GameStatus;
  onArchivePress?: () => void;
  isNew?: boolean;
}

function Badge({ status, isDark }: { status: GameStatus; isDark: boolean }) {
  switch (status) {
    case 'unplayed':
      return (
        <View style={badgeStyles.badgePlay}>
          <Text style={badgeStyles.badgePlayText}>Play</Text>
        </View>
      );
    case 'completed':
      return (
        <View style={badgeStyles.badgeCheck}>
          <Text style={badgeStyles.checkmark}>✓</Text>
        </View>
      );
    case 'multiplayer':
      return (
        <View
          style={[
            badgeStyles.badgeMultiplayer,
            {
              borderColor: isDark ? dark.cardBorder : light.cardBorder,
              backgroundColor: isDark ? dark.surface : light.surface,
            },
          ]}
        >
          <Text
            style={[
              badgeStyles.badgeMultiplayerText,
              { color: isDark ? dark.textSecondary : light.textSecondary },
            ]}
          >
            Multiplayer
          </Text>
        </View>
      );
  }
}

export default function GameCard({
  title,
  subtitle,
  icon,
  onPress,
  status,
  onArchivePress,
  isNew,
  ...rest
}: GameCardProps) {
  const { isDark } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
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
        isNew && {
          borderColor: brand.primary,
          borderWidth: 2,
        },
        pressed && styles.pressed,
      ]}
      {...rest}
    >
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      <View style={styles.mobileInner}>
        <Text
          style={[
            styles.titleMobile,
            { color: isDark ? dark.textPrimary : light.textPrimary },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>

        <View style={styles.iconContainer}>
          <IconPill icon={icon} size="lg" />
        </View>

        <Text
          style={[
            styles.subtitleMobile,
            { color: isDark ? dark.textSecondary : light.textSecondary },
          ]}
          numberOfLines={2}
        >
          {subtitle}
        </Text>

        <View style={styles.badgeContainerMobile}>
          {onArchivePress ? (
            <View style={styles.badgeRow}>
              <Badge status={status} isDark={isDark} />
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onArchivePress();
                }}
                hitSlop={8}
                style={({ pressed: p }) => [
                  styles.badgeArchive,
                  {
                    borderColor: isDark ? dark.cardBorder : light.cardBorder,
                    backgroundColor: isDark ? dark.surface : light.surface,
                  },
                  p && styles.badgeArchivePressed,
                ]}
              >
                <Text
                  style={[
                    styles.badgeArchiveText,
                    { color: isDark ? dark.textSecondary : light.textSecondary },
                  ]}
                >
                  Archive
                </Text>
              </Pressable>
            </View>
          ) : (
            <Badge status={status} isDark={isDark} />
          )}
        </View>
      </View>

      <View
        style={[
          styles.accentLine,
          { backgroundColor: brand.primary },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: radius.primary,
    overflow: 'hidden',
    borderWidth: 1,
  },
  newBadge: {
    position: 'absolute',
    top: 0,
    left: 12,
    backgroundColor: brand.primary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 10,
  },
  newBadgeText: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 2,
    color: dark.textPrimary,
  },
  pressed: {
    opacity: 0.85,
  },
  mobileInner: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    minHeight: 140,
  },
  titleMobile: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  subtitleMobile: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeContainerMobile: {
    alignItems: 'center',
    marginTop: 4,
  },
  accentLine: {
    height: 2,
  },
  badgeRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  badgeArchive: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeArchivePressed: {
    opacity: 0.7,
  },
  badgeArchiveText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

const badgeStyles = StyleSheet.create({
  badgePlay: {
    backgroundColor: brand.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgePlayText: {
    fontFamily: fonts.display,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
    color: dark.textPrimary,
  },
  badgeCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 16,
    color: dark.textPrimary,
  },
  badgeMultiplayer: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeMultiplayerText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
});
