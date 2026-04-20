/**
 * Ball Knowledge Design Tokens
 *
 * Single source of truth for all visual constants.
 * Never use raw hex values in component files — import from here.
 */

// ---------------------------------------------------------------------------
// Brand (shared across light and dark)
// ---------------------------------------------------------------------------

export const brand = {
  primary:  '#FC345C',
  light:    '#FF7191',
  dark:     '#B8003D',
  teal:     '#07BCCC',
  gradient: ['#B8003D', '#FC345C', '#FF7191'] as const,
} as const;

// ---------------------------------------------------------------------------
// Dark Theme
// ---------------------------------------------------------------------------

export const dark = {
  background:   '#0F0F0F',
  card:         '#1A1A1A',
  cardBorder:   'rgba(255,255,255,0.07)',
  surface:      '#222222',
  divider:      'rgba(255,255,255,0.08)',

  textPrimary:  '#FFFFFF',
  textSecondary:'rgba(255,255,255,0.55)',
  textMuted:    'rgba(255,255,255,0.3)',
  textDisabled: 'rgba(255,255,255,0.18)',

  tagBg:        'rgba(255,255,255,0.08)',
  inputBg:      '#1A1A1A',
  inputBorder:  'rgba(255,255,255,0.1)',
  overlay:      'rgba(0,0,0,0.6)',
} as const;

// ---------------------------------------------------------------------------
// Light Theme
// ---------------------------------------------------------------------------

export const light = {
  background:   '#F5F2EF',
  card:         '#FFFFFF',
  cardBorder:   '#E5E0DB',
  surface:      '#EDEAE6',
  divider:      '#E5E0DB',

  textPrimary:  '#0F0F0F',
  textSecondary:'#6B6560',
  textMuted:    '#9E9990',
  textDisabled: '#C5BFB8',

  tagBg:        'rgba(252,52,92,0.07)',
  inputBg:      '#FFFFFF',
  inputBorder:  '#E5E0DB',
  overlay:      'rgba(0,0,0,0.35)',
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const fonts = {
  display:      'BebasNeue_400Regular',
  body:         'SpaceGrotesk_400Regular',
  bodyMedium:   'SpaceGrotesk_500Medium',
  bodySemiBold: 'SpaceGrotesk_600SemiBold',
  bodyBold:     'SpaceGrotesk_700Bold',
} as const;

export const fontSizes = {
  display:  { fontSize: 48, letterSpacing: 1 },
  heading:  { fontSize: 32, letterSpacing: 0.5 },
  subhead:  { fontSize: 22, letterSpacing: 0.3 },
  body:     { fontSize: 14, lineHeight: 21 },
  small:    { fontSize: 12, lineHeight: 18 },
  label:    { fontSize: 10, letterSpacing: 2 },
  stat:     { fontSize: 42, letterSpacing: 0.5 },
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

  screenHorizontal: 16,
  cardPadding: 16,
  sectionGap: 24,
  cardGap: 12,
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

export const radius = {
  primary: 12,
  secondary: 12,
  chip: 20,
  pill: 28,
  sheet: 24,
} as const;

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export const layout = {
  minTapTarget: 44,
  bottomNavHeight: 56,
  buttonHeight: 56,
  inputHeight: 48,
} as const;

// ---------------------------------------------------------------------------
// Backward-compatible aliases (existing imports keep working)
// ---------------------------------------------------------------------------

export const colors = {
  brand: brand.primary,
  brandDark: brand.dark,
  brandLight: brand.light,
  brandMid: '#FD8FAA',

  white: '#FFFFFF',
  offWhite: light.background,
  charcoal: '#1A1A2E',
  darkText: light.textPrimary,
  midGray: light.textSecondary,
  ruleGray: light.divider,
  lightGray: light.surface,

  success: '#0A6640',
  successBg: '#D1FAE5',
  warning: '#92400E',
  warningBg: '#FEF3C7',

  accentBlue: '#3B82F6',
  accentCyan: brand.teal,
  accentGreen: '#00C897',
  accentRed: '#FF4757',
  brandAlpha15: 'rgba(252,52,92,0.15)',
} as const;

export const darkColors = {
  background: dark.background,
  surface: dark.card,
  surfaceElevated: dark.surface,
  text: dark.textPrimary,
  textSecondary: dark.textSecondary,
  border: dark.cardBorder,
  brand: brand.primary,
  brandLight: brand.dark,
  success: '#34D399',
  successBg: '#0A2E1A',
} as const;

export const fontFamily = {
  regular: fonts.body,
  medium: fonts.bodyMedium,
  bold: fonts.bodySemiBold,
  black: fonts.display,
} as const;

export const typography = {
  hero: {
    fontFamily: fonts.display,
    fontSize: 48,
    lineHeight: 48,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 31,
  },
  h3: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 20,
    lineHeight: 24,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  brandNum: {
    fontFamily: fonts.display,
  },
} as const;
