import React from 'react';
import { Platform, View } from 'react-native';
import StarryBackground from './StarryBackground';
import { useTheme } from '../hooks/useTheme';

interface Props {
  children: React.ReactNode;
  starCount?: number;
}

const DARK_BG = '#0F0F0F';
const LIGHT_BG = '#F5F5F5';

export default function ScreenBase({ children, starCount }: Props) {
  const { isDark } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? DARK_BG : LIGHT_BG,
        position: 'relative' as const,
        ...(Platform.OS === 'web'
          ? { minHeight: '100vh' as any, width: '100%' as any }
          : {}),
      }}
    >
      <StarryBackground starCount={starCount} />
      <View style={{ flex: 1, zIndex: 1 }}>
        {children}
      </View>
    </View>
  );
}
