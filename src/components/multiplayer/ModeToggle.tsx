import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, darkColors, fontFamily, radius, layout } from '../../styles/theme'

interface ModeToggleProps {
  mode: 'local' | 'online'
  onModeChange: (mode: 'local' | 'online') => void
  disabled?: boolean
}

export function ModeToggle({ mode, onModeChange, disabled = false }: ModeToggleProps) {
  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <TouchableOpacity
        style={[styles.segment, mode === 'local' && styles.segmentActive]}
        onPress={() => onModeChange('local')}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.segmentText,
            mode === 'local' ? styles.segmentTextActive : styles.segmentTextInactive,
          ]}
        >
          Play Locally
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.segment, mode === 'online' && styles.segmentActive]}
        onPress={() => onModeChange('online')}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.segmentText,
            mode === 'online' ? styles.segmentTextActive : styles.segmentTextInactive,
          ]}
        >
          Play Online
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: darkColors.surfaceElevated,
    borderRadius: radius.secondary,
    padding: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  segment: {
    flex: 1,
    height: layout.minTapTarget - 4, // 40pt inner height (44pt total with 2pt padding)
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.chip,
    backgroundColor: darkColors.surface,
  },
  segmentActive: {
    backgroundColor: colors.brand,
  },
  segmentText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  segmentTextActive: {
    color: colors.white,
  },
  segmentTextInactive: {
    color: darkColors.textSecondary,
  },
})
