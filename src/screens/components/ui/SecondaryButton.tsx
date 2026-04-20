import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  Animated,
  StyleSheet,
  type PressableProps,
} from 'react-native';
import { brand, dark, light, fonts, radius } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

interface SecondaryButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function SecondaryButton({
  label,
  onPress,
  disabled = false,
  ...rest
}: SecondaryButtonProps) {
  const { isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          {
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : light.cardBorder,
          },
          pressed && {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
          },
          disabled && styles.disabled,
        ]}
        {...rest}
      >
        <Text
          style={[
            styles.label,
            { color: isDark ? dark.textPrimary : light.textPrimary },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: 1,
  },
});
