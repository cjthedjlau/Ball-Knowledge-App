import React from 'react';
import { Pressable, View, Text, StyleSheet, type PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, darkColors, fontFamily } from '../../../styles/theme';
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

function Badge({ status }: { status: GameStatus }) {
  switch (status) {
    case 'unplayed':
      return (
        <View style={styles.badgePlay}>
          <Text style={styles.badgePlayText}>Play</Text>
        </View>
      );
    case 'completed':
      return (
        <View style={styles.badgeCheck}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      );
    case 'multiplayer':
      return (
        <View style={styles.badgeMultiplayer}>
          <Text style={styles.badgeMultiplayerText}>Multiplayer</Text>
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
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isNew && styles.cardNew,
        pressed && styles.pressed,
      ]}
      {...rest}
    >
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      {/* Always use vertical layout — readable at all screen sizes */}
      <View style={styles.mobileInner}>
        <Text style={styles.titleMobile} numberOfLines={2}>{title}</Text>

        <View style={styles.iconContainer}>
          <IconPill icon={icon} size="lg" />
        </View>

        <Text style={styles.subtitleMobile} numberOfLines={2}>{subtitle}</Text>

        <View style={styles.badgeContainerMobile}>
          {onArchivePress ? (
            <View style={styles.badgeRow}>
              <Badge status={status} />
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onArchivePress();
                }}
                style={({ pressed: p }) => [
                  styles.badgeArchive,
                  p && styles.badgeArchivePressed,
                ]}
              >
                <Text style={styles.badgeArchiveText}>Archive</Text>
              </Pressable>
            </View>
          ) : (
            <Badge status={status} />
          )}
        </View>
      </View>

      <LinearGradient
        colors={['#FC345C', '#07bccc', '#e601c0', '#f40468']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentLine}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: 20,
    overflow: 'hidden',
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
  cardNew: {
    borderWidth: 2,
    borderColor: colors.brand,
    borderTopWidth: 2,
    borderTopColor: colors.brand,
    borderBottomWidth: 2,
    borderBottomColor: colors.brand,
  },
  newBadge: {
    position: 'absolute',
    top: -1,
    left: 12,
    backgroundColor: colors.brand,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 10,
  },
  newBadgeText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 2,
    color: colors.white,
  },
  pressed: {
    opacity: 0.85,
  },

  // ── Mobile layout ────────────────────────────────────────────────────────────
  mobileInner: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    minHeight: 140,
  },
  titleMobile: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  subtitleMobile: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: darkColors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeContainerMobile: {
    alignItems: 'center',
    marginTop: 4,
  },

  // ── Desktop layout ────────────────────────────────────────────────────────────
  desktopInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  desktopText: {
    flex: 1,
  },
  titleDesktop: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
    color: colors.white,
    marginBottom: 4,
  },
  subtitleDesktop: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: darkColors.textSecondary,
  },
  badgeContainerDesktop: {
    alignItems: 'flex-end',
  },
  badgeRowDesktop: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
  },

  accentLine: {
    height: 2,
    backgroundColor: colors.accentCyan,
  },

  // Badge — unplayed
  badgePlay: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgePlayText: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
    color: colors.white,
  },

  // Badge — completed
  badgeCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.white,
  },

  // Badge row (Play + Archive stacked)
  badgeRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  badgeArchive: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: darkColors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeArchivePressed: {
    opacity: 0.7,
  },
  badgeArchiveText: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: darkColors.textSecondary,
  },

  // Badge — multiplayer
  badgeMultiplayer: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: darkColors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeMultiplayerText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: darkColors.textSecondary,
  },
});
