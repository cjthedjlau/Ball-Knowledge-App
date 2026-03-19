/**
 * Ball Knowledge Design Tokens
 *
 * Single source of truth for all visual constants.
 * Never use raw hex values in component files — import from here.
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const colors = {
  // Brand
  brand: '#FC345C',
  brandDark: '#C4163E',
  brandLight: '#FEE2EA',
  brandMid: '#FD8FAA',

  // Neutrals
  white: '#FFFFFF',
  offWhite: '#FAFAFA',
  charcoal: '#1A1A2E',
  darkText: '#2D2D2D',
  midGray: '#6B7280',
  ruleGray: '#E5E7EB',
  lightGray: '#F4F4F6',

  // Semantic
  success: '#0A6640',
  successBg: '#D1FAE5',
  warning: '#92400E',
  warningBg: '#FEF3C7',

  // Accents
  accentBlue: '#3B82F6',
  accentCyan: '#07bccc',
  accentGreen: '#00C897',
  accentRed: '#FF4757',
  brandAlpha15: 'rgba(252,52,92,0.15)',
} as const;

export const darkColors = {
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceElevated: '#242424',
  text: '#F5F5F5',
  textSecondary: '#9CA3AF',
  border: '#333333',
  brand: '#FC345C',
  brandLight: '#3D1520',
  success: '#34D399',
  successBg: '#0A2E1A',
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const fontFamily = {
  regular: 'Chillax-Bold',
  medium: 'Chillax-Bold',
  bold: 'Chillax-Bold',
  black: 'Chillax-Bold',
} as const;

/**
 * Type scale — every text element in the app must use one of these presets.
 *
 * Line-height rules:
 *   Body  → 1.5×
 *   Headings → 1.2×
 *   Scores / Numbers → 1.0×
 */
export const typography = {
  hero: {
    fontFamily: fontFamily.black,
    fontSize: 48,
    lineHeight: 48, // 1.0×
  },
  h1: {
    fontFamily: fontFamily.black,
    fontSize: 32,
    lineHeight: 38, // 1.2×
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 26,
    lineHeight: 31,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 24,
  },
  body: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 24, // 1.5×
  },
  bodyMedium: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 19,
  },
  brandNum: {
    fontFamily: fontFamily.black,
    // fontSize intentionally omitted — set per usage (streaks, XP, levels)
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing (base unit: 4pt — all values are multiples of 4)
// ---------------------------------------------------------------------------

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,

  /** Horizontal padding for all screens */
  screenHorizontal: 16,
  /** Internal padding inside cards */
  cardPadding: 16,
  /** Vertical gap between major sections on a screen */
  sectionGap: 24,
  /** Vertical gap between cards in a list */
  cardGap: 12,
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

export const radius = {
  /** Primary cards, sheets */
  primary: 16,
  /** Secondary cards */
  secondary: 12,
  /** Chips, tags, small elements */
  chip: 8,
  /** Bottom sheet top corners */
  sheet: 24,
} as const;

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export const layout = {
  /** Minimum tap target — no exceptions */
  minTapTarget: 44,
  /** Bottom nav bar height (excludes safe-area inset) */
  bottomNavHeight: 56,
  /** BKButton height */
  buttonHeight: 56,
  /** BKInput height */
  inputHeight: 48,
} as const;
