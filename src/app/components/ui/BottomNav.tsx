import React, { useRef, useCallback } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home as HomeIcon, Gamepad2, TrendingUp, User } from 'lucide-react-native';
import { brand, dark, light } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

export type Tab = 'home' | 'games' | 'leaderboard' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  onNavigate: (tab: Tab) => void;
}

const TABS: { id: Tab; Icon: React.ComponentType<any> }[] = [
  { id: 'home', Icon: HomeIcon },
  { id: 'games', Icon: Gamepad2 },
  { id: 'leaderboard', Icon: TrendingUp },
  { id: 'profile', Icon: User },
];

function TabItem({
  id,
  Icon,
  isActive,
  onPress,
  isDark,
}: {
  id: Tab;
  Icon: React.ComponentType<any>;
  isActive: boolean;
  onPress: (tab: Tab) => void;
  isDark: boolean;
}) {
  const scale = useRef(new Animated.Value(isActive ? 1 : 1)).current;
  const activeScale = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;

  const handlePress = useCallback(() => {
    // Pill press bounce
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();

    // Active indicator pop
    Animated.sequence([
      Animated.timing(activeScale, {
        toValue: 0.6,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(activeScale, {
        toValue: 1,
        friction: 5,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();

    onPress(id);
  }, [id, onPress, scale, activeScale]);

  const iconColor = isActive ? brand.primary : (isDark ? dark.textMuted : light.textMuted);

  return (
    <Animated.View style={[styles.tabItemWrap, { transform: [{ scale }] }]}>
      <Pressable
        style={isActive ? [styles.navItemActive, { backgroundColor: brand.primary }] : styles.navItem}
        onPress={handlePress}
      >
        <Animated.View style={{ transform: [{ scale: isActive ? activeScale : scale }] }}>
          <Icon
            color={isActive ? (isDark ? dark.textPrimary : light.card) : iconColor}
            size={24}
            strokeOpacity={isActive ? 1 : 0.6}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  return (
    <View style={[styles.navOuter, { bottom: insets.bottom + 16 }]}>
      <View style={[
        styles.navPill,
        {
          backgroundColor: isDark ? dark.card : light.card,
          borderColor: isDark ? dark.cardBorder : light.cardBorder,
        },
      ]}>
        {TABS.map(({ id, Icon }) => (
          <TabItem
            key={id}
            id={id}
            Icon={Icon}
            isActive={activeTab === id}
            onPress={onNavigate}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navOuter: {
    position: 'absolute',
    bottom: 16, // overridden dynamically with safe area inset
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none' as any,
  },
  navPill: {
    width: '85%',
    height: 72,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: dark.background,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  tabItemWrap: {
    flex: 1,
    alignSelf: 'stretch',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
});
