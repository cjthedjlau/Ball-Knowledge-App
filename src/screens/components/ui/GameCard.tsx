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
  ...rest
}: GameCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      {...rest}
    >
      <View style={styles.row}>
        <IconPill icon={icon} size="lg" />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        </View>
        {onArchivePress ? (
          <View style={styles.badgeRow}>
            <Badge status={status} />
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onArchivePress();
              }}
              style={({ pressed }) => [
                styles.badgeArchive,
                pressed && styles.badgeArchivePressed,
              ]}
            >
              <Text style={styles.badgeArchiveText}>Archive</Text>
            </Pressable>
          </View>
        ) : (
          <Badge status={status} />
        )}
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
  pressed: {
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.black,
    fontWeight: '900',
    fontSize: 19,
    letterSpacing: 1,
    color: colors.white,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: darkColors.textSecondary,
    marginTop: 2,
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

  // Badge row (Play + Archive side by side)
  badgeRow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
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
