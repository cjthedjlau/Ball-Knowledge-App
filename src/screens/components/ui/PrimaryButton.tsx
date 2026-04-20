import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  Animated,
  ActivityIndicator,
  StyleSheet,
  type PressableProps,
} from 'react-native';
import { brand, dark, light, fonts, radius } from '../../../styles/theme';
import { useTheme } from '../../../hooks/useTheme';

interface PrimaryButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  ...rest
}: PrimaryButtonProps) {
  const { isDark } = useTheme();
  const isDisabled = disabled || loading;
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0.4,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: glowOpacity }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
          isDisabled && styles.disabled,
        ]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={dark.textPrimary} size="small" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    backgroundColor: brand.primary,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: brand.dark,
  },
  disabled: {
    opacity: 0.3,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: 1,
    color: dark.textPrimary,
  },
});
