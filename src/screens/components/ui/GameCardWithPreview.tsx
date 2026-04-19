import React, { useRef, useState, useCallback, useEffect, useId } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { brand, dark, light, fonts, radius, colors } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';
import IconPill from './IconPill';

// ── Singleton coordinator: only one preview at a time ──
type Listener = (activeId: string | null) => void;
const listeners = new Set<Listener>();
let currentActiveId: string | null = null;

function setActivePreview(id: string | null) {
  currentActiveId = id;
  listeners.forEach((fn) => fn(id));
}

function usePreviewCoordinator(myId: string) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handler: Listener = (activeId) => {
      setIsActive(activeId === myId);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, [myId]);

  const activate = useCallback(() => {
    setActivePreview(myId);
  }, [myId]);

  const deactivate = useCallback(() => {
    if (currentActiveId === myId) {
      setActivePreview(null);
    }
  }, [myId]);

  return { isActive, activate, deactivate };
}

type GameStatus = 'unplayed' | 'completed' | 'multiplayer';

interface GameCardWithPreviewProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  status: GameStatus;
  onArchivePress?: () => void;
  isNew?: boolean;
  PreviewComponent: React.ComponentType<{ isDark: boolean }>;
}

const isWeb = Platform.OS === 'web';

// Detect true hover capability — mobile browsers report Platform.OS === 'web'
// but don't have a hover-capable pointer (mouse). This prevents scroll-triggered previews.
const canHover = isWeb && typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;

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
          <Text style={badgeStyles.checkmark}>{'✓'}</Text>
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

// Normal card height and expanded preview height
const CARD_MIN_HEIGHT = 140;
const PREVIEW_HEIGHT = 180;

export default function GameCardWithPreview({
  title,
  subtitle,
  icon,
  onPress,
  status,
  onArchivePress,
  isNew,
  PreviewComponent,
}: GameCardWithPreviewProps) {
  const { isDark } = useTheme();
  const instanceId = useId();
  const { isActive: isPreviewing, activate, deactivate } = usePreviewCoordinator(instanceId);
  const heightAnim = useRef(new Animated.Value(CARD_MIN_HEIGHT)).current;
  const previewOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animate height and opacity transitions
  useEffect(() => {
    if (isPreviewing) {
      // Expand: fade out content, grow height, fade in preview
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.spring(heightAnim, {
          toValue: PREVIEW_HEIGHT,
          stiffness: 300,
          damping: 25,
          useNativeDriver: false,
        }),
        Animated.timing(previewOpacity, {
          toValue: 1,
          duration: 250,
          delay: 100,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
        dismissTimer.current = null;
      }
      // Collapse: fade out preview, shrink height, fade in content
      Animated.parallel([
        Animated.timing(previewOpacity, {
          toValue: 0,
          duration: 120,
          useNativeDriver: false,
        }),
        Animated.spring(heightAnim, {
          toValue: CARD_MIN_HEIGHT,
          stiffness: 300,
          damping: 25,
          useNativeDriver: false,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 200,
          delay: 80,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isPreviewing, heightAnim, previewOpacity, contentOpacity]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }
    };
  }, []);

  const handlePress = useCallback(() => {
    if (canHover) {
      onPress();
      return;
    }

    // Mobile / touch: first tap shows preview, second tap opens game
    if (isPreviewing) {
      deactivate();
      onPress();
    } else {
      activate();
      dismissTimer.current = setTimeout(() => {
        deactivate();
      }, 5000);
    }
  }, [isPreviewing, onPress, activate, deactivate]);

  const handleMouseEnter = useCallback(() => {
    if (canHover) {
      activate();
    }
  }, [activate]);

  const handleMouseLeave = useCallback(() => {
    if (canHover) {
      deactivate();
    }
  }, [deactivate]);

  const webHoverProps = canHover
    ? {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      }
    : {};

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isDark ? dark.card : light.card,
          borderColor: isPreviewing
            ? brand.primary
            : isDark ? dark.cardBorder : light.cardBorder,
          ...(isDark
            ? {}
            : {
                shadowColor: '#000',
                shadowOpacity: isPreviewing ? 0.12 : 0.06,
                shadowRadius: isPreviewing ? 16 : 8,
                shadowOffset: { width: 0, height: isPreviewing ? 4 : 2 },
                elevation: isPreviewing ? 6 : 2,
              }),
        },
        isNew && !isPreviewing && {
          borderColor: brand.primary,
          borderWidth: 2,
        },
        pressed && !isPreviewing && styles.pressed,
      ]}
      {...webHoverProps}
    >
      <Animated.View style={[styles.innerContainer, { minHeight: heightAnim }]}>
        {/* Normal content — fades out when previewing */}
        <Animated.View style={[styles.contentLayer, { opacity: contentOpacity }]} pointerEvents={isPreviewing ? 'none' : 'auto'}>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
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
        </Animated.View>

        {/* Preview content — fades in when previewing */}
        <Animated.View
          style={[
            styles.previewLayer,
            { opacity: previewOpacity },
          ]}
          pointerEvents={isPreviewing ? 'auto' : 'none'}
        >
          <PreviewComponent isDark={isDark} />
        </Animated.View>
      </Animated.View>

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
  innerContainer: {
    position: 'relative',
    padding: 16,
  },
  contentLayer: {
    alignItems: 'center',
  },
  previewLayer: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBadge: {
    position: 'absolute',
    top: -16,
    left: -4,
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
