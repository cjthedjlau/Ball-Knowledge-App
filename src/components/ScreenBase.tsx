import React from 'react';
import { Platform, View } from 'react-native';
import StarryBackground from './StarryBackground';
import { useTheme } from '../hooks/useTheme';
import { dark, light } from '../styles/theme';

interface Props {
  children: React.ReactNode;
  starCount?: number;
  backgroundColor?: string;
}

export default function ScreenBase({ children, starCount, backgroundColor }: Props) {
  const { isDark } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor ?? (isDark ? dark.background : light.background),
        position: 'relative' as const,
        ...(Platform.OS === 'web'
          ? { minHeight: '100vh' as any, width: '100%' as any }
          : {}),
      }}
    >
      {!backgroundColor && <StarryBackground starCount={starCount} />}
      <View style={{ flex: 1, zIndex: 1 }}>
        {children}
      </View>
    </View>
  );
}
