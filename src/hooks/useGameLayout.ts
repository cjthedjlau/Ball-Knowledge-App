/**
 * useGameLayout — single source of truth for game screen layout values.
 *
 * Every game screen should use these values instead of hardcoding padding.
 * This prevents the recurring bugs:
 *   - Nav bar covering buttons (insufficient bottom padding)
 *   - Dark gaps above coral header (missing top inset)
 *   - Inconsistent spacing across screens
 *
 * Usage:
 *   const { topPadding, bottomPadding, statusBarFill } = useGameLayout();
 *   <View style={{ paddingTop: topPadding }}>  // zone1
 *   <ScrollView contentContainerStyle={{ paddingBottom: bottomPadding }}>  // zone2
 */

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { brand } from '../styles/theme';

export function useGameLayout() {
  const insets = useSafeAreaInsets();

  return {
    /** paddingTop for zone1 — clears the notch/status bar */
    topPadding: insets.top + 16,

    /** paddingBottom for ScrollView contentContainerStyle — clears the nav bar */
    bottomPadding: insets.bottom + 120,

    /** Height of the status bar fill (for absolute-positioned coral bar) */
    statusBarHeight: insets.top,

    /** Style for the coral status bar fill View */
    statusBarFillStyle: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: insets.top,
      backgroundColor: brand.primary,
      zIndex: 0,
    },

    /** Raw insets for custom calculations */
    insets,
  };
}
